const exportsObj = {}

const User = require('../models').user
const UserSetting = require('../models').userSetting

const addExcludes = (options = {}, excludes = ['password']) => {
	if (!options.attributes) options.attributes = {}
	const currentExcludes = options.attributes.exclude || []
	options.attributes.exclude = [...new Set([...currentExcludes, ...excludes])]

	return Promise.resolve(options)
}

exportsObj.getUsers = () => {
	return addExcludes()
		.then(options => User.findAll(options))
}

exportsObj.getUserById = (userId) => {
	const options = {
		where: { id: userId }
	}
	return addExcludes(options)
		.then(options => User.findOne(options))
}

exportsObj.getUser = (user, includePassword = false) => {
	const options = {
		where: user
	}
	const extraExcludes = includePassword ? [] : ['password']
	return addExcludes(options, extraExcludes)
		.then(options => User.findOne(options))
}

exportsObj.getUserSettings = (usrId) => {
	return UserSetting.findOne({
		where: { usrId }
	})
		.then(result => result.toJSON())
}

exportsObj.insertUser = (user) => {
	return User
		.create(user)
		.then(user => exportsObj.getUserById(user.id))
}

exportsObj.insertUserSettings = (usrId, userSetting) => {
	return UserSetting
		.create({ ...userSetting, usrId })
}

exportsObj.updateAvatar = (userId, avatar) => {
	const options = {
		where: { id: userId }
	}
	return User.update({ avatar }, options)
		.then({ avatar })
}

exportsObj.updateUserSettings = (usrId, settings) => {
	const options = {
		where: { usrId }
	}
	return UserSetting.update(settings, options)
		.then(() => exportsObj.getUserSettings(usrId))
}

exportsObj.updateUser = (user) => {
	const options = {
		where: { id: user.id }
	}
	return addExcludes(options)
		.then(options => User.update(user, options))
}

exportsObj.deleteUser = (userId) => {
	const options = {
		where: { id: userId }
	}
	return User.destroy(options)
	  .then(() => ({ id: userId }))
}

module.exports = exportsObj