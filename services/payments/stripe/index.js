const exportsObj = {}
const db = require(__basedir + '/db/controllers')
const stripe = require('./provider')

exportsObj.createCharge = (chargeObj, orderId) => {
  return stripe.charges.create(chargeObj)
    .then((chargeObj) => db.charges.insertCharge({
      txnId: chargeObj.id,
      amount: chargeObj.amount,
      amountRefunded: chargeObj.amount_refunded,
      currency: chargeObj.currency,
      stage: 'ESCROW',
      status: chargeObj.status,
      ordId: orderId
    }))
}

exportsObj.releaseFunds = (orderId) => {
  return db.charges.getCharge({ ordId: orderId })
    .then((charge) => {
      if (charge.status === 'RELEASED') return Promise.reject({ msg: 'paymentAlreadyReleased' })
      return db.charges.updateCharge({ id: charge.id, status: 'RELEASED' })
    })
}

exportsObj.refundOrder = (orderId, amount) => {
  return db.charges.getCharge({ ordId: orderId })
    .then((charge) => {
      const amountProc = amount > 0 ? amount : charge.amount
      const refundObj = {
        charge: charge.txnId,
        amount: amountProc
      }
      return stripe.refunds.create(refundObj)
        .then((refund) => db.refunds.insertRefund({
          refId: refund.id,
          chgId: charge.id,
          amount: refund.amount,
          currency: refund.currency,
          status: refund.status
        }))
        .then(refund => ({ refund, charge }))
    })
    .then((result) => {
      const chargeId = result.charge.id
      const amountRefunded = result.refund.amount
      return db.charges.updateCharge({ id: chargeId, stage: 'REFUNDED', amountRefunded })
        .then(() => result.refund)
    })
}

module.exports = exportsObj