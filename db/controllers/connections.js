const exportsObj = {}

const Connection = require('../models').connection

exportsObj.getConnections = () => {
	return Connection.findAll()
}

exportsObj.getConnection = (conId) => {
	return Connection.findOne({ where: { id: conId }})
}

exportsObj.insertConnection = (connection) => {
	return Connection.create(connection)
}

exportsObj.deleteConnection = (conId) => {
	return Connection.destroy({ where: { id: conId }})
	  .then(() => ({ id: conId }))
}

module.exports = exportsObj