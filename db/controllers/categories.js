const exportsObj = {}

const Category = require('../models').category

exportsObj.getCategories = () => {
	return Category.findAll()
}

exportsObj.getCategory = (catId) => {
	return Category.findOne({ where: { id: catId }})
}

exportsObj.insertCategory = (category) => {
	return Category.create(category)
}

exportsObj.deleteCategory = (catId) => {
	return Category.destroy({ where: { id: catId }})
	  .then(() => ({ id: catId }))
}

module.exports = exportsObj