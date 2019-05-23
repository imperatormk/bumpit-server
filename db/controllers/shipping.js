const exportsObj = {}

const Shipping = require('../models').shipping

exportsObj.getShipping = (shiId) => {
	return Shipping.findOne({ where: { id: shiId }})
}

exportsObj.insertShipping = (shipping) => {
	return Shipping.create(shipping)
}

exportsObj.deleteShipping = (shiId) => {
	return Shipping.destroy({ where: { id: shiId }})
	  .then(() => ({ id: shiId }))
}

module.exports = exportsObj