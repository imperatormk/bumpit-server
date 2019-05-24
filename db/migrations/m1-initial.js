'use strict'

const categories = (Sequelize) => ({
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
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
    defaultValue: ''
  },
  bio: {
    type: Sequelize.TEXT,
    defaultValue: ''
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  phone: {
    type: Sequelize.STRING,
    defaultValue: ''
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

const products = (Sequelize) => ({
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
    type: Sequelize.INTEGER,
    allowNull: false
  },
  currency: {
    type: Sequelize.STRING,
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
      model: 'products',
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
      model: 'products',
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
      model: 'products',
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

const orders = (Sequelize) => ({
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER
  },
  status: {
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
      model: 'products',
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

const shippings = (Sequelize) => ({
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER
  },
  address: {
    type: Sequelize.STRING,
    allowNull: false
  },
  trackingNo: {
    type: Sequelize.STRING
  },
  status: {
    type: Sequelize.STRING,
    allowNull: false
  },
  ordId: {
    type: Sequelize.INTEGER,
    onDelete: 'CASCADE',
    references: {
      model: 'orders',
      key: 'id',
      as: 'ordId'
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

const events = (Sequelize) => ({
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER
  },
  type: {
    type: Sequelize.STRING,
    allowNull: false
  },
  entryId: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  ordId: {
    type: Sequelize.INTEGER,
    onDelete: 'CASCADE',
    references: {
      model: 'orders',
      key: 'id',
      as: 'ordId'
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

const charges = (Sequelize) => ({
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
  amount: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  amountRefunded: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  currency: {
    type: Sequelize.STRING,
    allowNull: false
  },
  stage: {
    type: Sequelize.STRING,
    allowNull: false
  },
  status: {
    type: Sequelize.STRING,
    allowNull: false
  },
  ordId: {
    type: Sequelize.INTEGER,
    onDelete: 'CASCADE',
    references: {
      model: 'orders',
      key: 'id',
      as: 'ordId'
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

const refunds = (Sequelize) => ({
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER
  },
  refId: {
    type: Sequelize.STRING,
    allowNull: false
  },
  amount: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  currency: {
    type: Sequelize.STRING,
    allowNull: false
  },
  status: {
    type: Sequelize.STRING,
    allowNull: false
  },
  chgId: {
    type: Sequelize.INTEGER,
    onDelete: 'CASCADE',
    references: {
      model: 'charges',
      key: 'id',
      as: 'chgId'
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
          const productsP = queryInterface.createTable('products', products(Sequelize))
          const connectionsP = queryInterface.createTable('connections', connections(Sequelize))
          return Promise.all([productsP, connectionsP])
            .then(() => {
              const imagesP = queryInterface.createTable('images', images(Sequelize))
              const reviewsP = queryInterface.createTable('reviews', reviews(Sequelize))
              const likesP = queryInterface.createTable('likes', likes(Sequelize))
              const ordersP = queryInterface.createTable('orders', orders(Sequelize))
              return Promise.all([imagesP, reviewsP, likesP, ordersP])
                .then(() => {
                  const eventsP = queryInterface.createTable('events', events(Sequelize))
                  const chargesP = queryInterface.createTable('charges', charges(Sequelize))
                  const shippingsP = queryInterface.createTable('shippings', shippings(Sequelize))
                  return Promise.all([eventsP, chargesP, shippingsP])
                    .then(() => {
                      const refundsP = queryInterface.createTable('refunds', refunds(Sequelize))
                      return Promise.all([refundsP])
                        .then(() => {
                          const reviewsU = addUnique(queryInterface, 'reviews', ['itmId', 'usrId'])
                          const likesU = addUnique(queryInterface, 'likes', ['itmId', 'usrId'])
                          const eventsU = addUnique(queryInterface, 'events', ['type', 'ordId'])
                          const chargesU = addUnique(queryInterface, 'charges', ['txnId'])
                          const refundsU = addUnique(queryInterface, 'refunds', ['refId'])
                          return Promise.all([reviewsU, likesU, eventsU, chargesU, refundsU])
                        })
                    })
                })
            })
      })
    })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      const refundsP = queryInterface.dropTable('refunds')
      return Promise.all([refundsP])
        .then(() => {
          const eventsP = queryInterface.dropTable('events')
          const chargesP = queryInterface.dropTable('charges')
          const shippingsP = queryInterface.dropTable('shippings')
          return Promise.all([chargesP, eventsP, shippingsP])
            .then(() => {
              const imagesP = queryInterface.dropTable('images')
              const reviewsP = queryInterface.dropTable('reviews')
              const likesP = queryInterface.dropTable('likes')
              const ordersP = queryInterface.dropTable('orders')
              return Promise.all([imagesP, reviewsP, likesP, ordersP])
                .then(() => {
                  const productsP = queryInterface.dropTable('products')
                  const connectionsP = queryInterface.dropTable('connections')
                  return Promise.all([productsP, connectionsP])
                    .then(() => {
                      const categoriesP = queryInterface.dropTable('categories')
                      const usersP = queryInterface.dropTable('users')
                      return Promise.all([categoriesP, usersP])
                    })
              })
            })
        })
    })
  }
}