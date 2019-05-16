const exportsObj = {}

const Charge = require('../models').charge

exportsObj.getCharges = () => {
	return Charge.findAll()
}

exportsObj.getCharge = (chgId) => {
	return Charge.findOne({ where: { id: chgId }})
}

exportsObj.insertCharge = (charge) => {
	return Charge.create(charge)
}

exportsObj.deleteCharge = (chgId) => {
	return Charge.destroy({ where: { id: chgId }})
	  .then(() => ({ id: chgId }))
}

module.exports = exportsObj