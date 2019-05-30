const exportsObj = {}

const Connection = require('../models').connection
const Op = require('sequelize').Op

exportsObj.getConnectionsForUser = (userId, config = []) => { // TODO: think about private?
	const fields = {
		followees: 'usrFromId',
		followers: 'usrToId'
	}

	const criteria = []
	const compConfig = !!config.length ? config : Object.keys(fields)
	compConfig.forEach((configKey) => {
		const field = fields[configKey]
		if (field) {
			const fieldObj = {}
			fieldObj[field] = userId
			criteria.push(fieldObj)
		}
	})

	const options = {
		where: {
			[Op.or]: criteria
		}
	}
	return Connection.findAll(options)
		.then(connections => connections.map(connection => connection.toJSON()))
		.then((connections) => {
			return connections.map((connection) => {
				const connectionObj = {}
				const followeeId = connection[fields.followees]
				const followerId = connection[fields.followers]
				
				if (userId === followeeId) {
					connectionObj.type = 'followee'
					connectionObj.userId = followerId
				} else if (userId === followerId) {
					connectionObj.type = 'follower'
					connectionObj.userId = followeeId
				} else return null
				return connectionObj
			})
		})
		.then(connections => connections.filter(connection => !!connection))
}

exportsObj.getConnectionById = (conId) => {
	return Connection.findOne({ where: { id: conId }})
}

exportsObj.getConnection = (connection) => {
	return Connection.findOne({
		where: connection
	})
}

exportsObj.insertConnection = (connection) => {
	return Connection.create(connection)
}

exportsObj.deleteConnection = (conId) => {
	return Connection.destroy({ where: { id: conId }})
	  .then(() => ({ id: conId }))
}

module.exports = exportsObj