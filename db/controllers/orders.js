const exportsObj = {}

const Order = require('../models').order
const Item = require('../models').item

exportsObj.getOrders = () => {
	return Order.findAll()
}

exportsObj.getOrder = (ordId) => {
	const options = {
		include: [{
			model: Item,
			as: 'item'
		}],
		where: { id: ordId }
	}
	return Order.findOne(options)
}

exportsObj.insertOrder = (order) => {
	return Order.create(order)
}

exportsObj.modifyOrder = (order) => {
	return Order.update(order, { where: { id: order.id } })
}

exportsObj.deleteOrder = (ordId) => {
	return Order.destroy({ where: { id: ordId }})
	  .then(() => ({ id: ordId }))
}

module.exports = exportsObj