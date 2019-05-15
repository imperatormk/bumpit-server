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

const users = (Sequelize) => ({
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER
  },
  username: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  },
  location: {
    type: Sequelize.STRING,
    allowNull: false
  },
  bio: {
    type: Sequelize.TEXT
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  phone: {
    type: Sequelize.STRING
  },
  createdAt: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW // bad
  },
  updatedAt: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW // bad
  }
})

const items = (Sequelize) => ({
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER
  },
  catId: {
    type: Sequelize.INTEGER,
    onDelete: 'CASCADE',
    references: {
      model: 'categories',
      key: 'id',
      as: 'catId'
    }
  },
  selId: {
    type: Sequelize.INTEGER,
    onDelete: 'CASCADE',
    references: {
      model: 'users',
      key: 'id',
      as: 'selId'
    }
  },
  title: {
    type: Sequelize.STRING,
    allowNull: false
  },
  details: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  condition: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  price: {
    type: Sequelize.FLOAT,
    allowNull: false
  },
  currency: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  size: {
    type: Sequelize.STRING,
    allowNull: false
  },
  location: {
    type: Sequelize.STRING,
    allowNull: false
  },
  status: {
    type: Sequelize.STRING,
    defaultValue: 'AVAILABLE'
  },
  createdAt: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW // bad
  },
  updatedAt: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW // bad
  }
})

const images = (Sequelize) => ({
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER
  },
  itmId: {
    type: Sequelize.INTEGER,
    onDelete: 'CASCADE',
    references: {
      model: 'items',
      key: 'id',
      as: 'itmId'
    },
    allowNull: false
  },
  url: {
    type: Sequelize.STRING,
    allowNull: false
  },
  featured: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  }
})

const reviews = (Sequelize) => ({
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER
  },
  usrId: {
    type: Sequelize.INTEGER,
    onDelete: 'CASCADE',
    references: {
      model: 'users',
      key: 'id',
      as: 'usrId'
    },
    allowNull: false,
    unique: 'reviewUnique'
  },
  itmId: {
    type: Sequelize.INTEGER,
    onDelete: 'CASCADE',
    references: {
      model: 'items',
      key: 'id',
      as: 'itmId'
    },
    allowNull: false,
    unique: 'reviewUnique'
  },
  rating: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  message: {
    type: Sequelize.STRING,
    allowNull: false
  },
  createdAt: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW // bad
  },
  updatedAt: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW // bad
  }
})

const likes = (Sequelize) => ({
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER
  },
  usrId: {
    type: Sequelize.INTEGER,
    onDelete: 'CASCADE',
    references: {
      model: 'users',
      key: 'id',
      as: 'usrId'
    },
    allowNull: false,
    unique: 'likeUnique'
  },
  itmId: {
    type: Sequelize.INTEGER,
    onDelete: 'CASCADE',
    references: {
      model: 'items',
      key: 'id',
      as: 'itmId'
    },
    allowNull: false,
    unique: 'likeUnique'
  },
  createdAt: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW // bad
  },
  updatedAt: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW // bad
  }
})

const purchases = (Sequelize) => ({
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER
  },
  txnId: {
    type: Sequelize.STRING,
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
  itmId: {
    type: Sequelize.INTEGER,
    onDelete: 'CASCADE',
    references: {
      model: 'items',
      key: 'id',
      as: 'itmId'
    },
    allowNull: false
  },
  createdAt: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW // bad
  },
  updatedAt: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW // bad
  }
})

const connections = (Sequelize) => ({
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER
  },
  usrFromId: {
    type: Sequelize.INTEGER,
    onDelete: 'CASCADE',
    references: {
      model: 'users',
      key: 'id',
      as: 'usrFromId'
    },
    allowNull: false
  },
  usrToId: {
    type: Sequelize.INTEGER,
    onDelete: 'CASCADE',
    references: {
      model: 'users',
      key: 'id',
      as: 'usrToId'
    },
    allowNull: false
  },
  createdAt: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW // bad
  },
  updatedAt: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW // bad
  }
})

const addUnique = (queryInterface, tableName, fields) => {
  return queryInterface.addIndex(tableName, fields, {
    name: tableName + 'Unique',
    unique: true
  })
}

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      const categoriesP = queryInterface.createTable('categories', categories(Sequelize))
      const usersP = queryInterface.createTable('users', users(Sequelize))

      return Promise.all([categoriesP, usersP])
      .then(() => {
        const itemsP = queryInterface.createTable('items', items(Sequelize))
        const connectionsP = queryInterface.createTable('connections', connections(Sequelize))
          return Promise.all([itemsP, connectionsP])
            .then(() => {
              const imagesP = queryInterface.createTable('images', images(Sequelize))
              const reviewsP = queryInterface.createTable('reviews', reviews(Sequelize))
              const likesP = queryInterface.createTable('likes', likes(Sequelize))
              const purchasesP = queryInterface.createTable('purchases', purchases(Sequelize))
              return Promise.all([imagesP, reviewsP, likesP, purchasesP])
                .then(() => {
                  const reviewsU = addUnique(queryInterface, 'reviews', ['itmId', 'usrId'])
                  const likesU = addUnique(queryInterface, 'likes', ['itmId', 'usrId'])
                  return Promise.all([reviewsU, likesU])
                })
            })
      })
    })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      const imagesP = queryInterface.dropTable('images')
      const reviewsP = queryInterface.dropTable('reviews')
      const likesP = queryInterface.dropTable('likes')
      const purchasesP = queryInterface.dropTable('purchases')

      return Promise.all([imagesP, reviewsP, likesP, purchasesP])
        .then(() => {
          const itemsP = queryInterface.dropTable('items')
          const connectionsP = queryInterface.dropTable('connections')
          return Promise.all([itemsP, connectionsP])
            .then(() => {
              const categoriesP = queryInterface.dropTable('categories')
              const usersP = queryInterface.dropTable('users')
              return Promise.all([categoriesP, usersP])
            })
      })
    })
  }
}