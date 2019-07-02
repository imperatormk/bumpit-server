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

const brands = (Sequelize) => ({
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
  avatar: {
    type: Sequelize.STRING,
    allowNull: true
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
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  surname: {
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
  stripeCustId: {
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

const userSettings = (Sequelize) => ({
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER
  },
  disableTrades: {
    type: Sequelize.BOOLEAN,
    allowNull: false
  },
  language: {
    type: Sequelize.STRING,
    allowNull: false
  },
  currency: {
    type: Sequelize.STRING,
    allowNull: false
  },
  notifOnLike: {
    type: Sequelize.BOOLEAN,
    allowNull: false
  },
  notifOnFollow: {
    type: Sequelize.BOOLEAN,
    allowNull: false
  },
  notifOnFriendPost: {
    type: Sequelize.BOOLEAN,
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
    allowNull: false,
    unique: true
  },
})

const shippingInfos = (Sequelize) => ({
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER
  },
  fullname: {
    type: Sequelize.STRING,
    allowNull: false
  },
  address: {
    type: Sequelize.STRING,
    allowNull: false
  },
  unit: {
    type: Sequelize.STRING
  },
  state: {
    type: Sequelize.STRING,
    allowNull: false
  },
  city: {
    type: Sequelize.STRING,
    allowNull: false
  },
  zipcode: {
    type: Sequelize.STRING,
    allowNull: false
  },
  contactPhone: {
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
    allowNull: false,
    unique: true
  },
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
    },
    allowNull: false
  },
  brandId: {
    type: Sequelize.INTEGER,
    onDelete: 'CASCADE',
    references: {
      model: 'brands',
      key: 'id',
      as: 'brandId'
    },
    allowNull: false
  },
  selId: {
    type: Sequelize.INTEGER,
    onDelete: 'CASCADE',
    references: {
      model: 'users',
      key: 'id',
      as: 'selId'
    },
    allowNull: false
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
  size: {
    type: Sequelize.STRING,
    allowNull: false
  },
  location: {
    type: Sequelize.STRING,
    allowNull: false
  },
  shippingCost: {
    type: Sequelize.INTEGER,
    defaultValue: 0
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
  proId: {
    type: Sequelize.INTEGER,
    onDelete: 'CASCADE',
    references: {
      model: 'products',
      key: 'id',
      as: 'proId'
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
  proId: {
    type: Sequelize.INTEGER,
    onDelete: 'CASCADE',
    references: {
      model: 'products',
      key: 'id',
      as: 'proId'
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
  shippingInfo: {
    type: Sequelize.JSON,
    allowNull: false
  },
  chargeSummary: {
    type: Sequelize.JSON,
    allowNull: false
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
    allowNull: false,
    unique: 'eventsUnique'
  },
  entryId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    unique: 'eventsUnique'
  },
  ordId: {
    type: Sequelize.INTEGER,
    onDelete: 'CASCADE',
    references: {
      model: 'orders',
      key: 'id',
      as: 'ordId'
    },
    allowNull: false,
    unique: 'eventsUnique'
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
  stage: {
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
  amount: {
    type: Sequelize.INTEGER,
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

const bankCharges = (Sequelize) => ({
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER
  },
  txnId: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  amount: {
    type: Sequelize.INTEGER,
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
    allowNull: false,
    unique: true
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

const balanceActions = (Sequelize) => ({
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER
  },
  direction: {
    type: Sequelize.STRING,
    allowNull: false
  },
  amount: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  entryId: {
    type: Sequelize.INTEGER,
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
      const brandsP = queryInterface.createTable('brands', brands(Sequelize))
      const usersP = queryInterface.createTable('users', users(Sequelize))
      return Promise.all([categoriesP, brandsP, usersP])
        .then(() => {
          const userSettingsP = queryInterface.createTable('userSettings', userSettings(Sequelize))
          const shippingInfosP = queryInterface.createTable('shippingInfos', shippingInfos(Sequelize))
          const productsP = queryInterface.createTable('products', products(Sequelize))
          const connectionsP = queryInterface.createTable('connections', connections(Sequelize))
          return Promise.all([userSettingsP, shippingInfosP, productsP, connectionsP])
            .then(() => {
              const imagesP = queryInterface.createTable('images', images(Sequelize))
              const reviewsP = queryInterface.createTable('reviews', reviews(Sequelize))
              const likesP = queryInterface.createTable('likes', likes(Sequelize))
              const ordersP = queryInterface.createTable('orders', orders(Sequelize))
              return Promise.all([imagesP, reviewsP, likesP, ordersP])
                .then(() => {
                  const eventsP = queryInterface.createTable('events', events(Sequelize))
                  const shippingsP = queryInterface.createTable('shippings', shippings(Sequelize))
                  const chargesP = queryInterface.createTable('charges', charges(Sequelize))
                  const refundsP = queryInterface.createTable('refunds', refunds(Sequelize))
                  return Promise.all([eventsP, shippingsP, chargesP, refundsP])
                    .then(() => {
                      const bankChargesP = queryInterface.createTable('bankCharges', bankCharges(Sequelize))
                      const balanceActionsP = queryInterface.createTable('balanceActions', balanceActions(Sequelize))
                      return Promise.all([bankChargesP, balanceActionsP])
                        .then(() => {
                          const reviewsU = addUnique(queryInterface, 'reviews', ['proId', 'usrId'])
                          const likesU = addUnique(queryInterface, 'likes', ['proId', 'usrId'])
                          const eventsU = addUnique(queryInterface, 'events', ['type', 'ordId'])
                          return Promise.all([reviewsU, likesU, eventsU])
                        })
                    })
                })
            })
      })
    })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      const bankChargesP = queryInterface.dropTable('bankCharges')
      const balanceActionsP = queryInterface.dropTable('balanceActions')
      return Promise.all([bankChargesP, balanceActionsP])
        .then(() => {
          const chargesP = queryInterface.dropTable('charges')
          const refundsP = queryInterface.dropTable('refunds')
          const eventsP = queryInterface.dropTable('events')
          const shippingsP = queryInterface.dropTable('shippings')
          return Promise.all([chargesP, refundsP, eventsP, shippingsP])
            .then(() => {
              const imagesP = queryInterface.dropTable('images')
              const reviewsP = queryInterface.dropTable('reviews')
              const likesP = queryInterface.dropTable('likes')
              const ordersP = queryInterface.dropTable('orders')
              return Promise.all([imagesP, reviewsP, likesP, ordersP])
                .then(() => {
                  const productsP = queryInterface.dropTable('products')
                  const connectionsP = queryInterface.dropTable('connections')
                  const shippingInfosP = queryInterface.dropTable('shippingInfos')
                  const userSettingsP = queryInterface.dropTable('userSettings')
                  return Promise.all([productsP, connectionsP, shippingInfosP, userSettingsP])
                    .then(() => {
                      const categoriesP = queryInterface.dropTable('categories')
                      const brandsP = queryInterface.dropTable('brands')
                      const usersP = queryInterface.dropTable('users')
                      return Promise.all([categoriesP, brandsP, usersP])
                    })
                })
            })
        })
    })
  }
}