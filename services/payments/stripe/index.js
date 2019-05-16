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
      status: chargeRes.status,
      ordId: orderId
    }))
    .then((chargeRes) => ({ id: chargeRes.id }))
}

exportsObj.createCharge = createCharge

module.exports = exportsObj