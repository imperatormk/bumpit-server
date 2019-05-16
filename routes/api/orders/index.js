const express = require('express')
const router = express.Router()
const authMiddleware = require(__basedir + '/services/auth').middleware
const db = require(__basedir + '/db/controllers')
const stripe = require(__basedir + '/services/stripe')

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
      const chargeObj = {
        amount: item.price * 100, // is 100 a given?
        currency: item.currency,
        card: paymentToken,
        description: `Order for item #${itemId}`
      }

      return stripe.charges.create(chargeObj)
        .then((chargeRes) => {
          const orderObj = {
            txnId: chargeRes.id,
            usrId: userId,
            itmId: itemId
          }
          return db.items.modifyItem({ ...item, status: 'SOLD' })
            .then(() => db.orders.insertOrder(orderObj))
            .then((orderRes) => res.send(orderRes))
        })
    })
    .catch(err => res.status(err.status || 500).send({ msg: err.msg || 'unknownError' }))
})

module.exports = router