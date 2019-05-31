const exportsObj = {}

const ShippingInfo = require('../models').shippingInfo

exportsObj.getShippingInfoForUser = (userId) => {
	return ShippingInfo.findOne({ where: { usrId: userId } })
}

exportsObj.insertShippingInfo = (shippingInfo) => {
	return ShippingInfo.create(shippingInfo)
}

exportsObj.updateShippingInfo = (shippingInfo) => {
	return ShippingInfo.update(shippingInfo, { where: { id: shippingInfo.id } })
}

module.exports = exportsObj