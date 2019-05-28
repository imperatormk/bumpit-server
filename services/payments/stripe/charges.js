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
        moveFromToAccountBalance(-balanceAmount, stripeCustId) :
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
    balance: moveFromToAccountBalance,
    bankAccount: sendToBankAccount // TODO: implement this
  }

  return Promise.all([getOrder, getCharge])
    .then(([order, charge]) => {
      if (!(order && charge)) return Promise.reject({ status: 400, msg: 'invalidData' })
      return [order.toJSON(), charge.toJSON()]
    })
    .then(([order, charge]) => {
      const allowedStages = ['RELEASED_HOLD']
      if (!allowedStages.includes(charge.stage))
        return Promise.reject({ status: 400, msg: 'unableToPayoutFunds' })

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
      if (charge.stage === 'RELEASED_HOLD') {
        data.custId = seller.stripeCustId
        data.nextStage = 'RELEASED'
      }

      if (!(data.custId && data.amount && data.nextStage))
        return Promise.reject({ status: 500, msg: 'fundsPayoutFailed' })

      const methodAction = availableActions[method]
      return methodAction(data.amount, data.custId)
        .then((result) => {
          if (!result.status === 'success')
            return Promise.reject({ status: 500, msg: 'fundsPayoutFailed' })
          return db.charges.updateCharge({ id: charge.id, stage: data.nextStage })
            .then(() => ({ success: true }))
        })
    })
}

exportsObj.refundOrder = (orderId, refAmount) => {
  const getOrder = db.orders.getOrderById(orderId)
  const getCharge = db.charges.getCharge({ ordId: orderId })

  return Promise.all([getOrder, getCharge])
    .then(([order, charge]) => {
      if (!(order && charge)) return Promise.reject({ status: 400, msg: 'invalidData' })
      return [order.toJSON(), charge.toJSON()]
    })
    .then(([order, charge]) => {
      const forbiddenStages = ['RELEASED_HOLD', 'RELEASED', 'REFUNDED']
      if (forbiddenStages.includes(charge.stage))
        return Promise.reject({ status: 400, msg: 'unableToRefundOrder' })

      const nullCharge = { amount: 0 }
      const bankCharge = charge.bankCharge || nullCharge
      const balanceCharge = charge.balanceCharge || nullCharge
      const totalAmount = bankCharge.amount + balanceCharge.amount

      const amount = (refAmount > 0 && refAmount <= totalAmount) ? refAmount : totalAmount
      const currency = charge.currency
      const buyer = order.buyer

      return moveFromToAccountBalance(amount, buyer.stripeCustId)
        .then((result) => {
          if (!result.status === 'success')
            return Promise.reject({ status: 500, msg: 'refundFailed' })
          return db.refunds.insertRefund({
            amount,
            currency,
            status: 'COMPLETED',
            ordId: orderId
          })
        })
    })
    .then((refund) => {
      return db.charges.updateCharge({ stage: 'REFUNDED' }, { ordId: orderId })
        .then(() => refund)
    })
}

module.exports = exportsObj