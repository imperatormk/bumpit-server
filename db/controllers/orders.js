const exportsObj = {}

const Purchase = require('../models').purchase

exportsObj.getOrders = () => {
	return Purchase.findAll()
}

exportsObj.getPurchase = (purId) => {
	return Purchase.findOne({ where: { id: purId }})
}

exportsObj.insertPurchase = (purchase) => {
	return Purchase.create(purchase)
}

exportsObj.deletePurchase = (purId) => {
	return Purchase.destroy({ where: { id: purId }})
	  .then(() => ({ id: purId }))
}

module.exports = exportsObj