const exportsObj = {}

const Like = require('../models').like
const Product = require('../models').product

exportsObj.getLikesForProduct = (proId) => {
	const options = {
		where: {
			proId
		}
	}
	return Like.findAll(options)
		.then(likes => likes.map(like => like.usrId))
		.then(users => ({ users })
	)
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

exportsObj.getUserLikes = (likerId) => {
	const options = {
		where: {
			usrId: likerId
		}
	}
	return Like.findAll(options)
		.then(likes => likes.map(like => like.proId))
		.then(products => ({ products })
	)
}

exportsObj.getLikesToUser = (likeeId) => {
	const productOptions = {
		where: {
			selId: likeeId
		}
	}
	return Product.findAll(productOptions)
		.then(products => products.map(product => product.id))
		.then((productIds) => {
			const likeOptions = {
				where: {
					proId: productIds
				}
			}
			return Like.findAll(likeOptions)
		})
}

exportsObj.insertLike = (like) => {
	return Like.create(like)
}

exportsObj.deleteLike = (criteria) => {
	return Like.destroy({ where: criteria })
}

module.exports = exportsObj