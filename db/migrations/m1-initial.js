'use strict'

const categories = (Sequelize) => ({
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER
  },
  name: {
    type: Sequelize.STRING
  }
})

module.exports = {
  up: (queryInterface, Sequelize) => {
    const categoriesP = queryInterface.createTable('categories', categories(Sequelize))
  	return Promise.all([categoriesP])
  },
  down: (queryInterface, Sequelize) => {
  	const categoriesP = queryInterface.dropTable('categories')
    return Promise.all([categoriesP])
  }
}