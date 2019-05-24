const exportsObj = {}

const Order = require('../models').order
const Product = require('../models').product
const User = require('../models').user

exportsObj.getOrders = () => {
	return Order.findAll()
}

exportsObj.getOrderById = (orderId) => {
	const options = {
		include: [{
			model: Product,
			as: 'product',
			include: [{
				model: User,
				as: 'seller'
			}]
		}, {
			model: User,
			as: 'buyer'
		}],
		where: { id: orderId }
	}
	return Order.findOne(options)
}

exportsObj.getOrder = (order) => {
	const options = {
		include: [{
			model: Product,
			as: 'product'
		}],
		where: order
	}
	return Order.findOne(options)
}

exportsObj.insertOrder = (order) => {
	return Order.create(order)
}

exportsObj.updateOrder = (order) => {
	return Order.update(order, { where: { id: order.id } })
}

exportsObj.deleteOrder = (ordId) => {
	return Order.destroy({ where: { id: ordId }})
	  .then(() => ({ id: ordId }))
}

module.exports = exportsObj