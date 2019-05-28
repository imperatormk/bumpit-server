const router = require('express').Router()

const authMiddleware = require(__basedir + '/services/auth').middleware
const db = require(__basedir + '/db/controllers')

const chargesService = require(__basedir + '/services/payments').charges
const eventsService = require(__basedir + '/services/events')

router.get('/:id', (req, res, next) => {
  const id = req.params.id
  return db.orders.getOrderById(id)
    .then((product) => {
      if (!product) return next({ status: 404, msg: 'notFound' })
      return res.send(product)
    })
    .catch(err => next(err))
})

router.post('/', authMiddleware, (req, res, next) => { // here charge event is created
  const order = req.body
  const productId = order.productId
  const paymentToken = order.paymentToken
  const userId = req.user.id

  return db.products.getProduct(productId) // DRY!
    .then((product) => {
      if (!product)
        return next({ status: 400, msg: 'badProduct' })
      if (product.selId === userId)
        return next({ status: 400, msg: 'cantBuyFromSelf' })
      return product.toJSON()
    })
    .then((product) => {
      if (product.status !== 'AVAILABLE')
        return next({ status: 400, msg: 'productUnavailable' })

      const amount = product.price
      const currency = product.currency

      const charge = {
        amount,
        currency,
        card: paymentToken,
        description: `Order for product #${productId}`
      }

      // TODO: this HAS to be transactional
      return chargesService.chargeAmount(charge, userId)
        .then((totalResults) => {
          const order = {
            proId: product.id,
            usrId: userId,
            status: 'PROCESSED'
          }
          return db.orders.insertOrder(order)
            .then((order) => {
              const charge = {
                currency: product.currency,
                stage: 'ESCROW',
                ordId: order.id
              }
              return db.charges.insertCharge(charge)
                .then((charge) => {
                  const charges = []

                  const balanceResult = totalResults.balanceResult
                  const bankResult = totalResults.bankResult

                  if (balanceResult !== 'UNUSED') {
                    const balanceAction = {
                      direction: 'OUT',
                      amount: totalResults.balanceAmount,
                      chgId: charge.id
                    }
                    const balanceChargePromise = db.balanceActions.insertBalanceAction(balanceAction)
                    charges.push(balanceChargePromise)
                  } else {
                    charges.push(Promise.resolve())
                  }

                  if (bankResult !== 'UNUSED') {
                    const bankCharge = {
                      txnId: bankResult.id,
                      amount: bankResult.amount,
                      status: bankResult.status,
                      chgId: charge.id
                    }
                    const bankChargePromise = db.bankCharges.insertBankCharge(bankCharge)
                    charges.push(bankChargePromise)
                  } else {
                    charges.push(Promise.resolve())
                  }
                  return Promise.all(charges)
                    .then(() => { // use results here?
                      const event = {
                        type: 'CHARGE',
                        entryId: charge.id,
                        ordId: order.id
                      }
                      return eventsService.createEvent(event)
                    })
                })
            })
          // TODO: send mails here?
        })
        .then(() => {
          return db.products.updateProduct({ ...product, status: 'SOLD' })
        })
        .then(() => res.send({ success: true }))
        .catch(err => next(err)) // TODO: try to rollback any of the successes?
    })
    .catch(err => next(err))
})

router.post('/:id/ship', (req, res, next) => {
  const orderId = req.params.id
  const shipping = req.body

  return db.orders.getOrderById(orderId) // DRY!
    .then((order) => {
      if (!order) return next({ status: 400, msg: 'badOrder' })
      return order.toJSON()
    })
    .then((order) => {
      if (order.status !== 'PROCESSING') return next({ status: 400, msg: 'orderNotShippable' })
      shipping.ordId = orderId

      return db.shipping.insertShipping(shipping)
        .then((shippingRes) => {
          const shippingId = shippingRes.id
          const event = {
            type: 'SHIPPING',
            entryId: shippingId,
            ordId: orderId
          }
          return eventsService.createEvent(event)
        })
        .then(() => res.send({ success: true }))
    })
    .catch(err => next(err))
})

router.post('/:id/complete', (req, res, next) => {
  const orderId = req.params.id

  return db.orders.getOrderById(orderId) // DRY!
    .then((order) => {
      if (!order) return next({ status: 400, msg: 'badOrder' })
      return order.toJSON()
    })
    .then((order) => {
      const allowedStatuses = ['IN_TRANSIT', 'IN_DISPUTE']
      if (!allowedStatuses.includes(order.status))
        return next({ status: 400, msg: 'orderNotCompleteable' })

      return chargesService.releaseFunds(orderId)
        .then(() => {
          const event = {
            type: 'COMPLETION',
            entryId: -1, // TODO: think about a model here
            ordId: orderId
          }
          return eventsService.createEvent(event)
        })
        .then(() => res.send({ success: true }))
    })
    .catch(err => next(err))
})

router.post('/:id/refund', (req, res, next) => {
  const orderId = req.params.id
  const refund = req.body
  const refundAmount = refund.amount || null

  return db.orders.getOrderById(orderId) // DRY!
    .then((order) => {
      if (!order) return next({ status: 400, msg: 'badOrder' })
      if (refundAmount != null && (refundAmount > order.price || refundAmount <= 0))
        return next({ status: 400, msg: 'invalidRefund' })
      return order.toJSON()
    })
    .then((order) => {
      const forbiddenStatuses = ['COMPLETED', 'REFUNDED']
      if (forbiddenStatuses.includes(order.status)) return next({ status: 400, msg: 'orderNotRefundable' })

      return chargesService.refundOrder(orderId, refundAmount)
        .then((refund) => {
          const product = order.product
          return db.products.updateProduct({ ...product, status: 'AVAILABLE' })
            .then(() => refund)
        })
        .then((refund) => {
          const event = {
            type: 'REFUND',
            entryId: refund.id,
            ordId: orderId
          }
          return eventsService.createEvent(event)
        })
        .then(() => res.send({ success: true }))
    })
    .catch(err => next(err))
})

router.post('/:id/payout', (req, res, next) => {
  const orderId = req.params.id
  const { method } = req.body

  const availableMethods = ['balance', 'bankAccount']
  if (!availableMethods.includes(method))
    return next({ status: 400, msg: 'invalidPayoutMethod' })

  return db.orders.getOrderById(orderId) // DRY!
    .then((order) => {
      if (!order)
        return next({ status: 400, msg: 'badOrder' })
      return order.toJSON()
    })
    .then((order) => {
      const allowedStatuses = ['COMPLETED', 'REFUNDED']
      if (!allowedStatuses.includes(order.status)) 
        return next({ status: 400, msg: 'orderStillPending' })

      return chargesService.payoutFunds(orderId, method)
        .then(result => res.send(result))
    })
    .catch(err => next(err))
})

module.exports = router