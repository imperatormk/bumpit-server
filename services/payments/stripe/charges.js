const exportsObj = {}
const stripe = require('./provider')

const db = require(__basedir + '/db/controllers')
const customersController = require('./customers')

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

const moveToAccountBalance = (custId, amount) => {
  return customersController.updateCustomerBalanceBy(custId, amount)
}

const sendToBankAccount = (custId, amount) => {
  return Promise.reject({ status: 415, msg: 'notImplemented' })
}

exportsObj.releaseFunds = (orderId) => {
  return db.charges.getCharge({ ordId: orderId })
    .then((charge) => {
      const forbiddenStages = ['RELEASED_HOLD', 'RELEASED']
      if (forbiddenStages.includes(charge.stage))
        return Promise.reject({ status: 400, msg: 'paymentAlreadyReleased' })

      return db.charges.updateCharge({ id: charge.id, stage: 'RELEASED_HOLD' })
    })
}

exportsObj.payoutFunds = (orderId, method) => {
  const getOrder = db.orders.getOrderById(orderId)
  const getCharge = db.charges.getCharge({ ordId: orderId })

  const availableActions = {
    balance: moveToAccountBalance,
    bankAccount: sendToBankAccount
  }

  return Promise.all([getOrder, getCharge])
    .then(([order, charge]) => {
      const allowedStates = ['RELEASED_HOLD', 'REFUNDED_HOLD']
      if (!allowedStates.includes(charge.stage))
        return Promise.reject({ status: 400, msg: 'unableToPayoutFunds' })

      const buyer = order.buyer
      const seller = order.product.seller

      const data = {
        custId: null,
        amount: 0,
        nextStage: null
      }

      if (charge.stage === 'REFUNDED_HOLD') {
        data.custId = buyer.stripeCustId
        data.amount = charge.amountRefunded
        data.nextStage = 'REFUNDED'
      } else if (charge.stage === 'RELEASED_HOLD') {
        data.custId = seller.stripeCustId
        data.amount = charge.amount
        data.nextStage = 'RELEASED'
      }

      if (!(data.custId && data.amount && data.nextStage))
        return Promise.reject({ status: 500, msg: 'fundsPayoutFailed' })

      const methodAction = availableActions[method]
      return methodAction(data.custId, data.amount)
        .then((result) => {
          if (!result)
            return Promise.reject({ status: 500, msg: 'fundsPayoutFailed' })
          return db.charges.updateCharge({ id: charge.id, stage: data.nextStage })
            .then(() => ({ success: true }))
        })
    })
}

exportsObj.refundOrder = (orderId, amount) => {
  return db.charges.getCharge({ ordId: orderId })
    .then((charge) => {
      const amountProc = (amount > 0 && amount <= charge.amount) ? amount : charge.amount
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
      return db.charges.updateCharge({ id: chargeId, stage: 'REFUNDED_HOLD', amountRefunded })
        .then(() => result.refund)
    })
}

module.exports = exportsObj