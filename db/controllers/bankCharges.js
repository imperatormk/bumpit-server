const exportsObj = {}

const BankCharge = require('../models').bankCharge

exportsObj.getBankCharges = () => {
	return BankCharge.findAll()
}

exportsObj.getBankChargeById = (id) => {
	return BankCharge.findOne({ where: { id } })
}

exportsObj.getBankCharge = (bankCharge) => {
	return BankCharge.findOne({ where: bankCharge })
}

exportsObj.insertBankCharge = (bankCharge) => {
	return BankCharge.create(bankCharge)
}

exportsObj.updateBankCharge = (bankCharge) => {
	return BankCharge.update(bankCharge, { where: { id: bankCharge.id } })
}

exportsObj.deleteBankCharge = (id) => {
	return BankCharge.destroy({ where: { id }})
	  .then(() => ({ id }))
}

module.exports = exportsObj