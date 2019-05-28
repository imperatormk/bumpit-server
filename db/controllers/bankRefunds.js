const exportsObj = {}

const BankRefund = require('../models').bankRefund

exportsObj.getBankRefunds = () => {
	return BankRefund.findAll()
}

exportsObj.getBankRefundById = (id) => {
	return BankRefund.findOne({ where: { id } })
}

exportsObj.getBankRefund = (bankRefund) => {
	return BankRefund.findOne({ where: bankRefund })
}

exportsObj.insertBankRefund = (bankRefund) => {
	return BankRefund.create(bankRefund)
}

exportsObj.updateBankRefund = (bankRefund) => {
	return BankRefund.update(bankRefund, { where: { id: bankRefund.id } })
}

exportsObj.deleteBankRefund = (id) => {
	return BankRefund.destroy({ where: { id }})
	  .then(() => ({ id }))
}

module.exports = exportsObj