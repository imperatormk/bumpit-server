const exportsObj = {}

const User = require('../models').user

exportsObj.getUsers = () => {
	return User.findAll()
}

exportsObj.getUser = (userId) => {
	return User.findOne({ where: { id: userId } })
}

exportsObj.getUserAuth = (userDetails) => {
	return User.findOne({ where: userDetails })
}

exportsObj.insertUser = (user) => {
	return User.create(user)
}

exportsObj.deleteUser = (userId) => {
	return User.destroy({ where: { id: userId } })
	  .then(() => ({ id: userId }))
}

module.exports = exportsObj