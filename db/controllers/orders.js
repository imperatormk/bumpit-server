const exportsObj = {}

const Order = require('../models').order
const Product = require('../models').product
const Shipping = require('../models').shipping
const User = require('../models').user

exportsObj.getBoughtOrders = (userId) => {
	const options = {
		where: {
			usrId: userId
		},
		include: [{
			model: Product,
			as: 'product'
		}]
	}
	return Order.findAll(options)
}

exportsObj.getSoldOrders = (userId) => {
	const productOptions = {
		where: {
			selId: userId
		},
		attributes: ['id']
	}
	return Product.findAll(productOptions)
		.then(products => products.map(product => product.id))
		.then((productIds) => {
			const orderOptions = {
				where: {
					proId: productIds
				}
			}
			return Order.findAll(orderOptions)
		})
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
		}, {
			model: Shipping,
			as: 'shipping'
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