const exportsObj = {}

const Product = require('../models').product
const User = require('../models').user

// TODO: move to a shared location
const getPagination = (pageData) => {
  const limit = pageData.size || 100
	const page = pageData.page || 1
	const by = pageData.by || 'id'
	const order = pageData.order || 'ASC'
	
	const options = {
    limit,
    offset: limit * (page - 1),
		order: [[by, order]],
  }
  return options
}

exportsObj.getProduct = (productId) => {
	const options = {
		include: [{
			model: User,
			as: 'seller'
		}],
		where: {
			id: productId
		}
	}
	return Product.findOne(options)
}

exportsObj.getProducts = (config) => {
	const filter = config.filter || {}
	const pageData = config.pageData || {}

	const options = {
		where: filter,
		...getPagination(pageData)
	}

	return Product.findAll(options)
		.then((products) => {
			return Product.count({ where: filter })
				.then((count) => ({
					totalElements: count,
					content: products
				}))
		})
}

exportsObj.getByIds = (productIds = []) => {
	const options = {
		where: {
			id: productIds
		}
	}
	return Product.findAll(options)
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