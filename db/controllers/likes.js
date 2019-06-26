const exportsObj = {}

const Like = require('../models').like

exportsObj.getLikesForProduct = (proId) => {
	const options = {
		where: {
			proId
		}
	}
	return Like.findAll(options)
}

exportsObj.insertLike = (like) => {
	return Like.create(like)
}

exportsObj.deleteLike = (criteria) => {
	return Like.destroy({ where: criteria })
}

module.exports = exportsObj