const exportsObj = {}

const Item = require('../models').item
const Image = require('../models').image
const User = require('../models').user

exportsObj.getItems = () => {
	const options = {
		include: [{
			model: Image,
			as: 'images'
		}]
	}
	return Item.findAll(options)
}

exportsObj.getItem = (itemId) => {
	const options = {
		include: [{
			model: Image,
			as: 'images'
		}, {
			model: User,
			as: 'seller'
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

exportsObj.updateItem = (item) => {
	return Item.update(item, { where: { id: item.id } })
}

exportsObj.deleteItem = (itemId) => {
	return Item.destroy({ where: { id: itemId } })
	  .then(() => ({ id: itemId }))
}

module.exports = exportsObj