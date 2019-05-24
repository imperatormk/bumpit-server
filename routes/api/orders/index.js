const router = require('express').Router()

const authMiddleware = require(__basedir + '/services/auth').middleware
const db = require(__basedir + '/db/controllers')

const chargesService = require(__basedir + '/services/payments').charges
const eventsService = require(__basedir + '/services/events')

router.get('/:id', function(req, res, next) {
  const id = req.params.id
  return db.orders.getOrderById(id)
    .then((product) => {
      if (!product) return next({ status: 404, msg: 'notFound' })
      return res.send(product)
    })
    .catch(err => next(err))
})

router.post('/', authMiddleware, function(req, res, next) { // here charge event is created
  const order = req.body
  const productId = order.productId
  const paymentToken = order.paymentToken
  const userId = req.user.id

  return db.products.getProduct(productId) // DRY!
    .then((product) => {
      if (!product) return next({ status: 400, msg: 'badProduct' })
      return product.toJSON()
    })
    .then((product) => {
      if (product.status !== 'AVAILABLE') return next({ status: 400, msg: 'productUnavailable' })
      const orderObj = {
        usrId: userId,
        proId: productId,
        status: 'PROCESSING'
      }
      const chargeObj = {
        amount: product.price,
        currency: product.currency,
        card: paymentToken,
        description: `Order for product #${productId}`
      }
      // TODO: this HAS to be transactional
      return db.orders.insertOrder(orderObj) // TODO: send mails here
        .then((orderRes) => {
          return chargesService.createCharge(chargeObj, orderRes.id)
            .then((chargeRes) => ({ order: orderRes, charge: chargeRes }))
        })
        .then((resData) => {
          return db.products.updateProduct({ ...product, status: 'SOLD' })
            .then(() => resData)
        })
        .then((resData) => {
          const orderId = resData.order.id
          const chargeId = resData.charge.id

          const event = {
            type: 'CHARGE',
            entryId: chargeId,
            ordId: orderId
          }
          return eventsService.createEvent(event)
            .then(() => res.send({ success: true }))
        })
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
      const validStatuses = ['IN_TRANSIT', 'IN_DISPUTE']
      if (!validStatuses.includes(order.status)) return next({ status: 400, msg: 'orderNotCompleteable' })

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
      if (refundAmount != null && (refundAmount > order.price || refundAmount <= 0)) next({ status: 400, msg: 'invalidRefund' })
      return order.toJSON()
    })
    .then((order) => {
      if (order.status === 'COMPLETED') return next({ status: 400, msg: 'orderNotRefundable' })

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

module.exports = router