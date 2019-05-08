const exportsObj = {}

const Review = require('../models').review

exportsObj.getReviews = () => {
	return Review.findAll()
}

exportsObj.getReview = (reviewId) => {
	return Review.findOne({ where: { id: reviewId }})
}

exportsObj.insertReview = (review) => {
	return Review.create(review)
}

exportsObj.deleteReview = (reviewId) => {
	return Review.destroy({ where: { id: reviewId }})
	  .then(() => ({ id: reviewId }))
}

module.exports = exportsObj