const exportsObj = {}

const Order = require('../models').order

exportsObj.getOrders = () => {
	return Order.findAll()
}

exportsObj.getOrder = (ordId) => {
	return Order.findOne({ where: { id: ordId }})
}

exportsObj.insertOrder = (order) => {
	return Order.create(order)
}

exportsObj.deleteOrder = (ordId) => {
	return Order.destroy({ where: { id: ordId }})
	  .then(() => ({ id: ordId }))
}

module.exports = exportsObj