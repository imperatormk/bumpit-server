const exportsObj = {}
const db = require(__basedir + '/db/controllers')
const stripe = require('./provider')

const createCharge = (charge, orderId) => {
  if (!charge || !orderId) return Promise.reject({ msg: 'invalidCharge' })
  return stripe.charges.create(charge)
    .then((chargeRes) => db.charges.insertCharge({
      txnId: chargeRes.id,
      amount: chargeRes.amount,
      amountRefunded: chargeRes.amount_refunded,
      currency: chargeRes.currency,
      status: 'ESCROW', // TODO: maybe we should also utilize the stripe status
      ordId: orderId
    }))
    .then((chargeRes) => ({ id: chargeRes.id }))
}

const releaseFunds = (orderId) => {
  if (!orderId) return Promise.reject({ msg: 'invalidOrder' })

  const getOrder = db.orders.getOrderById(orderId)
  const getCharge = db.charges.getCharge({ ordId: orderId })

  return Promise.all([getOrder, getCharge])
    .then(([order, charge]) => {
      if (order.status === 'RELEASED') return Promise.reject({ msg: 'paymentAlreadyReleased' })
      return db.charges.modifyCharge({ id: charge.id, status: 'RELEASED' })
    })
} 

exportsObj.createCharge = createCharge
exportsObj.releaseFunds = releaseFunds

module.exports = exportsObj