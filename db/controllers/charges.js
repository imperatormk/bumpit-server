const exportsObj = {}

const Charge = require('../models').charge

exportsObj.getCharges = () => {
	return Charge.findAll()
}

exportsObj.getChargeById = (chgId) => {
	return Charge.findOne({ id: chgId })
}

exportsObj.getCharge = (charge) => {
	return Charge.findOne(charge)
}

exportsObj.insertCharge = (charge) => {
	return Charge.create(charge)
}

exportsObj.modifyCharge = (charge) => {
	return Charge.update(charge, { where: { id: charge.id } })
}

exportsObj.deleteCharge = (chgId) => {
	return Charge.destroy({ where: { id: chgId }})
	  .then(() => ({ id: chgId }))
}

module.exports = exportsObj