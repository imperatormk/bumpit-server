const exportsObj = {}

const Item = require('../models').item
const Image = require('../models').image

exportsObj.getItems = () => {
	return Item.findAll()
}

exportsObj.getItem = (itemId) => {
	const options = {
		include: [{
			model: Image,
			as: 'images'
		}],
		where: {
			id: itemId
		}
	}
	return Item.findOne(options)
}

exportsObj.insertItem = (item) => {
	return Item.create(item)
}

exportsObj.modifyItem = (item) => {
	return Item.update(item, { where: { id: item.id } })
}

exportsObj.deleteItem = (itemId) => {
	return Item.destroy({ where: { id: itemId } })
	  .then(() => ({ id: itemId }))
}

module.exports = exportsObj