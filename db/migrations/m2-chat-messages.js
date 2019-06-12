const conversations = (Sequelize) => ({
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER
  },
  open: {
    type: Sequelize.BOOLEAN,
    defaultValue: true
  },
  ordId: {
    type: Sequelize.INTEGER,
    onDelete: 'CASCADE',
    references: {
      model: 'orders',
      key: 'id',
      as: 'ordId'
    },
  },
  usrId: {
    type: Sequelize.INTEGER,
    onDelete: 'CASCADE',
    references: {
      model: 'users',
      key: 'id',
      as: 'usrId'
    },
  },
  createdAt: {
	  type: Sequelize.DATE,
    defaultValue: Sequelize.NOW
  },
  updatedAt: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW
  },
})

const messages = (Sequelize) => ({
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER
  },
  content: {
    type: Sequelize.TEXT
  },
  fromBuyer: {
    type: Sequelize.BOOLEAN
  },
  cnvId: {
    type: Sequelize.INTEGER,
    onDelete: 'CASCADE',
    references: {
      model: 'conversations',
      key: 'id',
      as: 'cnvId'
    },
  },
  createdAt: {
	  type: Sequelize.DATE,
    defaultValue: Sequelize.NOW
  },
  updatedAt: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW
  },
})

module.exports = {
  up: (queryInterface, Sequelize) => {
    const conversationsP = queryInterface.createTable('conversations', conversations(Sequelize))
  	return Promise.all([conversationsP])
      .then(() => {
        const messagesP = queryInterface.createTable('chatMessages', messages(Sequelize))
        return Promise.all([messagesP])
      })
  },
  down: (queryInterface, Sequelize) => {
    const messagesP = queryInterface.dropTable('chatMessages')
    return Promise.all([messagesP])
      .then(() => {
  	    const conversationsP = queryInterface.dropTable('conversations')
        return Promise.all([conversationsP])
      })
  }
}