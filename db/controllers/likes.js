const exportsObj = {}

const Like = require('../models').like

exportsObj.getLikes = () => {
	return Like.findAll()
}

exportsObj.getLike = (likeId) => {
	return Like.findOne({ where: { id: likeId }})
}

exportsObj.insertLike = (like) => {
	return Like.create(like)
}

exportsObj.deleteLike = (likeId) => {
	return Like.destroy({ where: { id: likeId }})
	  .then(() => ({ id: likeId }))
}

module.exports = exportsObj