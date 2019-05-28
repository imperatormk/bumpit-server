const exportsObj = {}
const stripe = require('./provider')

const db = require(__basedir + '/db/controllers')
const customersController = require('./customers')

exportsObj.chargeAmount = (totalCharge, userId) => {
  return db.users.getUserById(userId)
    .then((user) => {
      const { stripeCustId } = user
      return customersController.getCustomerBalance(stripeCustId)
        .then((balance) => {
          const balanceAbs = Math.abs(balance)
          return { id: stripeCustId, balance: balanceAbs }
        })
    })
    .then((customer) => {
      const balance = customer.balance
      const stripeCustId = customer.id

      const totalAmount = totalCharge.amount
      const balanceAmount = (balance > totalAmount) ? totalAmount : balance
      const bankAmount = (totalAmount - balanceAmount)

      if (balanceAmount < 0 || bankAmount < 0)
        return Promise.reject({ status: 400, msg: 'invalidPrice' })

      const willUseBalance = balanceAmount > 0
      const willUseBank = bankAmount > 0

      const totalResult = {
        balanceAmount,
        bankAmount,
        balanceResult: willUseBalance ? 'PENDING' : 'UNUSED',
        bankResult: willUseBank ? 'PENDING' : 'UNUSED'
      }

      const balanceAction = willUseBalance ? 
        moveFromToAccountBalance(balanceAmount, stripeCustId) :
        Promise.resolve({ flag: true })

      return balanceAction
        .then((balanceResult) => {
          const balanceSuccess = balanceResult.flag || balanceResult.status === 'success'

          if (!balanceSuccess) {
            totalResult.balanceResult = 'FAILURE'
            return Promise.reject({ status: 400, msg: 'chargeFailed', details: totalResult })
          }
          if (!balanceResult.flag) totalResult.balanceResult = 'SUCCESS'

          const bankCharge = { ...totalCharge, amount: bankAmount }
          const bankAction = willUseBank ?
            chargeFromBankAccount(bankCharge) :
            Promise.resolve({ flag: true })

          return bankAction
            .then((bankResult) => {
              const bankSuccess = bankResult.flag || bankResult.status === 'succeeded'

              if (!bankSuccess) {
                totalResult.bankResult = 'FAILURE'
                return Promise.reject({ status: 400, msg: 'chargeFailed', details: totalResult })
              }
              if (!bankResult.flag) totalResult.bankResult = bankResult
              return totalResult
            })
        })
    })
}

// helpers start, move?

const moveFromToAccountBalance = (amount, custId) => {
  return customersController.updateCustomerBalanceBy(amount, custId)
}

const chargeFromBankAccount = (chargeObj) => {
  return stripe.charges.create(chargeObj)
}
const sendToBankAccount = (amount, custId) => {
  return Promise.reject({ status: 415, msg: 'notImplemented' })
}
const refundToBankAccount = (amount, custId) => {
  return Promise.reject({ status: 415, msg: 'notImplemented' })
}

// helpers end

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
    payout: {
      balance: moveFromToAccountBalance,
      bankAccount: sendToBankAccount // TODO: implement this
    },
    refund: {
      balance: moveFromToAccountBalance,
      bankAccount: refundToBankAccount // TODO: implement this
    }
  }

  return Promise.all([getOrder, getCharge])
    .then(([order, charge]) => {
      if (!(order && charge)) return Promise.reject({ status: 400, msg: 'invalidData' })
      return [order.toJSON(), charge.toJSON()]
    })
    .then(([order, charge]) => {
      const allowedStages = ['RELEASED_HOLD', 'REFUNDED_HOLD']
      if (!allowedStages.includes(charge.stage))
        return Promise.reject({ status: 400, msg: 'unableToPayoutFunds' })

      const buyer = order.buyer
      const seller = order.product.seller

      const data = {
        custId: null,
        amount: 0,
        nextStage: null
      }

      const balanceAmount = (charge.balanceCharge && charge.balanceCharge.amount) || 0
      const bankAmount = (charge.bankCharge && charge.bankCharge.amount) || 0
      const totalAmount = balanceAmount + bankAmount

      data.amount = totalAmount
      if (charge.stage === 'REFUNDED_HOLD') {
        data.custId = buyer.stripeCustId
        data.nextStage = 'REFUNDED'
        data.type = 'refund'
      } else if (charge.stage === 'RELEASED_HOLD') {
        data.custId = seller.stripeCustId
        data.nextStage = 'RELEASED'
        data.type = 'payout'
      }

      if (!(data.custId && data.amount && data.nextStage))
        return Promise.reject({ status: 500, msg: 'fundsPayoutFailed' })

      const methodAction = availableActions[data.type][method]
      return methodAction(data.amount, data.custId)
        .then((result) => {
          if (!result.status === 'success')
            return Promise.reject({ status: 500, msg: 'fundsPayoutFailed' })
          return db.charges.updateCharge({ id: charge.id, stage: data.nextStage })
            .then(() => ({ success: true }))
        })
    })
}

exportsObj.refundOrder = (orderId, refAmount) => { // note: this just inits refund
  return db.charges.getCharge({ ordId: orderId })
    .then((charge) => {
      const forbiddenStages = ['RELEASED_HOLD', 'REFUNDED_HOLD', 'RELEASED', 'REFUNDED']
      if (forbiddenStages.includes(charge.stage))
        return Promise.reject({ status: 400, msg: 'unableToRefundOrder' })

      const currency = charge.currency
      const nullCharge = { amount: 0 }
      const bankCharge = charge.bankCharge || nullCharge
      const balanceCharge = charge.balanceCharge || nullCharge
      const amount = bankCharge.amount + balanceCharge.amount

      return { amount, currency }
    })
    .then((charge) => {
      const amount = (refAmount > 0 && refAmount <= charge.amount) ? refAmount : charge.amount
      const currency = charge.currency

      return db.refunds.insertRefund({
        amount,
        currency,
        status: 'HOLD',
        ordId: orderId
      })
    })
    .then((refund) => {
      return db.charges.updateCharge({ stage: 'REFUNDED_HOLD' }, { ordId: orderId })
        .then(() => refund)
    })
}

module.exports = exportsObj