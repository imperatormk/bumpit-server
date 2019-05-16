const express = require('express')
const router = express.Router()
const authMiddleware = require(__basedir + '/services/auth').middleware
const db = require(__basedir + '/db/controllers')
const payments = require(__basedir + '/services/payments')

router.get('/:id', function(req, res) {
  const id = req.params.id
  return db.orders.getOrder(id)
    .then((item) => {
      if (!item) return res.status(404).send({ msg: 'notFound' })
      return res.send(item)
    })
    .catch(err => res.status(500).send(err))
})

router.post('/', authMiddleware, function(req, res) {
  const order = req.body
  const itemId = order.itemId
  const paymentToken = order.paymentToken
  const userId = req.user.id

  return db.items.getItem(itemId)
    .then((item) => {
      if (!item) throw ({ status: 400, msg: 'badItem' })
      return item.toJSON()
    })
    .then((item) => {
      if (item.status !== 'AVAILABLE') return res.status(400).send({ msg: 'itemUnavailable' })
      const orderObj = {
        usrId: userId,
        itmId: itemId
      }
      const chargeObj = {
        amount: item.price * 100, // is 100 a given?
        currency: item.currency,
        card: paymentToken,
        description: `Order for item #${itemId}`
      }
      // TODO: this HAS to be transactional
      return db.orders.insertOrder(orderObj)
        .then((orderRes) => payments.createCharge(chargeObj, orderRes.id))
        .then(() => db.items.modifyItem({ ...item, status: 'SOLD' }))
        .then(() => res.send({ success: true }))
    })
    .catch(err => res.status(err.status || err.statusCode || 500).send({ msg: err.msg || err.message || err || 'unknownError' }))
})

module.exports = router