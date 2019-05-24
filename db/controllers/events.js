const exportsObj = {}

const Event = require('../models').event

exportsObj.getEventsForProduct = (itmId) => {
	return Event.findAll({ where: { itmId } })
}

exportsObj.getEvent = (evtId) => {
	return Event.findOne({ where: { id: evtId }})
}

exportsObj.insertEvent = (event) => {
	return Event.create(event)
}

exportsObj.deleteEvent = (evtId) => {
	return Event.destroy({ where: { id: evtId }})
	  .then(() => ({ id: evtId }))
}

module.exports = exportsObj