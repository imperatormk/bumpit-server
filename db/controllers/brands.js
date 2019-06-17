const exportsObj = {}

const Brand = require('../models').brand

exportsObj.getBrands = () => {
	return Brand.findAll()
}

exportsObj.getBrand = (catId) => {
	return Brand.findOne({ where: { id: catId }})
}

exportsObj.insertBrand = (brand) => {
	return Brand.create(brand)
}

exportsObj.deleteBrand = (catId) => {
	return Brand.destroy({ where: { id: catId }})
	  .then(() => ({ id: catId }))
}

module.exports = exportsObj