const exportsObj = {}

const Item = require('../models').item

exportsObj.getItems = () => {
	return Item.findAll()
}

exportsObj.getItem = (itemId) => {
	return Item.findOne({ where: { id: itemId }})
}

exportsObj.insertItem = (item) => {
	return Item.create(item)
}

exportsObj.deleteItem = (itemId) => {
	return Item.destroy({ where: { id: itemId }})
	  .then(() => ({ id: itemId }))
}

module.exports = exportsObj