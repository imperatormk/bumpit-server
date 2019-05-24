const exportsObj = {}

const Product = require('../models').product
const Image = require('../models').image
const User = require('../models').user

exportsObj.getProducts = () => {
	const options = {
		include: [{
			model: Image,
			as: 'images'
		}]
	}
	return Product.findAll(options)
}

exportsObj.getProduct = (productId) => {
	const options = {
		include: [{
			model: Image,
			as: 'images'
		}, {
			model: User,
			as: 'seller'
		}],
		where: {
			id: productId
		}
	}
	return Product.findOne(options)
}

exportsObj.insertProduct = (product) => {
	return Product.create(product)
}

exportsObj.updateProduct = (product) => {
	return Product.update(product, { where: { id: product.id } })
}

exportsObj.deleteProduct = (productId) => {
	return Product.destroy({ where: { id: productId } })
	  .then(() => ({ id: productId }))
}

module.exports = exportsObj