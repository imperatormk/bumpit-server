const exportsObj = {}

const Like = require('../models').like
const Product = require('../models').product

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

exportsObj.getLikesForProduct = (config) => {
	const filter = config.filter || {}
	const pageData = config.pageData || {}

	const options = {
		where: filter,
		...getPagination(pageData)
	}

	return Like.findAll(options)
		.then(likes => likes.map(like => like.usrId))
		.then((userIds) => {
			return Like.count({ where: filter })
				.then((count) => ({
					totalElements: count,
					content: userIds
				}))
		})
}

exportsObj.getUserLikes = (config) => {
	const filter = config.filter || {}
	const pageData = config.pageData || {}

	const options = {
		where: filter,
		...getPagination(pageData)
	}

	return Like.findAll(options)
		.then(likes => likes.map(like => like.proId))
		.then((productIds) => {
			return Like.count({ where: filter })
				.then((count) => ({
					totalElements: count,
					content: productIds
				}))
		})
}

exportsObj.getLikesToUser = (config) => {
	const filter = config.filter || {}
	const pageData = config.pageData || {}

	const productOptions = {
		where: filter,
		...getPagination(pageData)
	}

	return Product.findAll(productOptions)
		.then(products => products.map(product => product.id))
		.then((productIds) => {
			return Product.count({ where: filter })
				.then((count) => {
					const likeOptions = {
						where: {
							proId: productIds
						}
					}

					return Like.findAll(likeOptions)
						.then((likes) => ({
							totalElements: count,
							content: likes
						}))
				})
		})
}

exportsObj.isLikedByUser = (proId, usrId) => {
	const options = {
		where: {
			proId,
			usrId
		}
	}
	return Like.findOne(options)
		.then(like => !!like)
}

exportsObj.insertLike = (like) => {
	return Like.create(like)
}

exportsObj.deleteLike = (criteria) => {
	return Like.destroy({ where: criteria })
}

module.exports = exportsObj