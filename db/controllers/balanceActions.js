const exportsObj = {}

const BalanceAction = require('../models').balanceAction

exportsObj.getBalanceActions = () => {
	return BalanceAction.findAll()
}

exportsObj.getBalanceActionById = (id) => {
	return BalanceAction.findOne({ where: { id } })
}

exportsObj.getBalanceAction = (balanceAction) => {
	return BalanceAction.findOne({ where: balanceAction })
}

exportsObj.insertBalanceAction = (balanceAction) => {
	return BalanceAction.create(balanceAction)
}

exportsObj.updateBalanceAction = (balanceAction) => {
	return BalanceAction.update(balanceAction, { where: { id: balanceAction.id } })
}

exportsObj.deleteBalanceAction = (id) => {
	return BalanceAction.destroy({ where: { id }})
	  .then(() => ({ id }))
}

module.exports = exportsObj