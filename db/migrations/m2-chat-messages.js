const conversations = (Sequelize) => ({
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER
  },
  status: {
    type: Sequelize.INTEGER,
    defaultValue: 1
  },
  proId: {
    type: Sequelize.INTEGER,
    onDelete: 'CASCADE',
    references: {
      model: 'products',
      key: 'id',
      as: 'proId'
    },
    allowNull: false
  },
  usrId: {
    type: Sequelize.INTEGER,
    onDelete: 'CASCADE',
    references: {
      model: 'users',
      key: 'id',
      as: 'usrId'
    },
    allowNull: false
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
    type: Sequelize.TEXT,
    allowNull: false
  },
  fromBuyer: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  },
  cnvId: {
    type: Sequelize.INTEGER,
    onDelete: 'CASCADE',
    references: {
      model: 'conversations',
      key: 'id',
      as: 'cnvId'
    },
    allowNull: false
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