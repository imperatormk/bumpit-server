const express = require('express')
const router = express.Router()
const authMiddleware = require(__basedir + '/services/auth').middleware
const db = require(__basedir + '/db/controllers')

const paymentsService = require(__basedir + '/services/payments')
const eventsService = require(__basedir + '/services/events')

router.get('/:id', function(req, res) {
  const id = req.params.id
  return db.orders.getOrderById(id)
    .then((item) => {
      if (!item) return res.status(404).send({ msg: 'notFound' })
      return res.send(item)
    })
    .catch(err => res.status(500).send(err))
})

router.post('/', authMiddleware, function(req, res) { // here charge event is created
  const order = req.body
  const itemId = order.itemId
  const paymentToken = order.paymentToken
  const userId = req.user.id

  return db.items.getItem(itemId) // DRY!
    .then((item) => {
      if (!item) throw ({ status: 400, msg: 'badItem' })
      return item.toJSON()
    })
    .then((item) => {
      if (item.status !== 'AVAILABLE') return res.status(400).send({ msg: 'itemUnavailable' })
      const orderObj = { // TODO: use this?
        usrId: userId,
        itmId: itemId,
        status: 'PROCESSING'
      }
      const chargeObj = {
        amount: item.price,
        currency: item.currency,
        card: paymentToken,
        description: `Order for item #${itemId}`
      }
      // TODO: this HAS to be transactional
      return db.orders.insertOrder(orderObj) // TODO: send mails here
        .then((orderRes) => {
          return paymentsService.createCharge(chargeObj, orderRes.id)
            .then((chargeRes) => ({ order: orderRes, charge: chargeRes }))
        })
        .then((resData) => {
          return db.items.updateItem({ ...item, status: 'SOLD' })
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
    .catch(err => res.status(err.status || err.statusCode || 500).send({ msg: err.msg || err.message || err || 'unknownError' }))
})

router.post('/:id/ship', (req, res) => {
  const orderId = req.params.id
  const shipping = req.body

  return db.orders.getOrderById(orderId) // DRY!
    .then((order) => {
      if (!order) throw ({ status: 400, msg: 'badOrder' })
      return order.toJSON()
    })
    .then((order) => {
      if (order.status !== 'PROCESSING') return res.status(400).send({ msg: 'orderNotShippable' })
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
    .catch(err => res.status(err.status || err.statusCode || 500).send({ msg: err.msg || err.message || err || 'unknownError' })) // DRY
})

router.post('/:id/complete', (req, res) => {
  const orderId = req.params.id

  return db.orders.getOrderById(orderId) // DRY!
    .then((order) => {
      if (!order) throw ({ status: 400, msg: 'badOrder' })
      return order.toJSON()
    })
    .then((order) => {
      const validStatuses = ['IN_TRANSIT', 'IN_DISPUTE']
      if (!validStatuses.includes(order.status)) return res.status(400).send({ msg: 'orderNotCompleteable' })

      return paymentsService.releaseFunds(orderId)
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
    .catch(err => res.status(err.status || err.statusCode || 500).send({ msg: err.msg || err.message || err || 'unknownError' })) // DRY
})

router.post('/:id/refund', (req, res) => {
  const orderId = req.params.id
  const refund = req.body
  const refundAmount = refund.amount || null

  return db.orders.getOrderById(orderId) // DRY!
    .then((order) => {
      if (!order) throw ({ status: 400, msg: 'badOrder' })
      if (refundAmount != null && (refundAmount > order.price || refundAmount <= 0)) throw ({ status: 400, msg: 'invalidRefund' })
      return order.toJSON()
    })
    .then((order) => {
      if (order.status === 'COMPLETED') return res.status(400).send({ msg: 'orderNotRefundable' })

      return paymentsService.refundOrder(orderId, refundAmount)
        .then((refund) => {
          const item = order.item
          return db.items.updateItem({ ...item, status: 'AVAILABLE' })
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
    .catch(err => res.status(err.status || err.statusCode || 500).send({ msg: err.msg || err.message || err || 'unknownError' })) // DRY
})

module.exports = router