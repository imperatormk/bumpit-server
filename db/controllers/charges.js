const exportsObj = {}

const Charge = require('../models').charge
const BankCharge = require('../models').bankCharge
const BalanceAction = require('../models').balanceAction

exportsObj.getCharges = () => {
	return Charge.findAll()
}

const includedChildren = [{
	model: BankCharge,
	as: 'bankCharge'
}, {
	model: BalanceAction,
	as: 'balanceCharge'
}]

exportsObj.getChargeById = (chargeId) => {
	const options = {
		where: { id: chargeId },
		include: includedChildren
	}
	return Charge.findOne(options)
}

exportsObj.getCharge = (charge) => {
	const options = {
		where: charge,
		include: includedChildren
	}
	return Charge.findOne(options)
}

exportsObj.insertCharge = (charge) => {
	return Charge.create(charge)
}

exportsObj.updateCharge = (charge, criteria) => {
	const criteriaObj = criteria || { id: charge.id }
	return Charge.update(charge, { where: criteriaObj })
}

exportsObj.deleteCharge = (chargeId) => {
	return Charge.destroy({ where: { id: chargeId }})
	  .then(() => ({ id: chargeId }))
}

module.exports = exportsObj