const exportsObj = {}

const Image = require('../models').image

exportsObj.getImages = () => {
	return Image.findAll()
}

exportsObj.getImage = (imageId) => {
	return Image.findOne({ where: { id: imageId }})
}

exportsObj.insertImage = (image) => {
	return Image.create(image)
}

exportsObj.deleteImage = (imageId) => {
	return Image.destroy({ where: { id: imageId }})
	  .then(() => ({ id: imageId }))
}

module.exports = exportsObj