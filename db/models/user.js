'use strict'
const helpers = require(__basedir + '/helpers')

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('user', {
    avatar: {
      type: DataTypes.STRING,
      get() {
        const value = this.getDataValue('avatar')
        if (!value) return helpers.getStaticFilesUrl('system', 'default_avatar.png')
        return helpers.getStaticFilesUrl('avatars', value)
      }
    },
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    name: DataTypes.STRING,
    surname: DataTypes.STRING,
    location: DataTypes.STRING,
    bio: DataTypes.TEXT,
    email: DataTypes.STRING,
    phone: DataTypes.STRING,
    stripeCustId: DataTypes.STRING,
    rating: {
      type: DataTypes.VIRTUAL,
      get() {
        const reviews = this.getDataValue('reviews')
        if (reviews && reviews.length) {
          const rating = reviews.map(val => val.rating).reduce((acc, val) => acc + val) / reviews.length
          return rating
        }
      }
    }
  }, {
    defaultScope: {
      include: [{ model: sequelize.models.review, as: 'reviews', attributes: ['rating'] }]
    }
  })
  User.associate = function(models) {
    User.hasOne(models.shippingInfo, {
      foreignKey: 'usrId',
      as: 'shippingInfo'
    })
    User.hasMany(models.product, {
      foreignKey: 'selId',
      as: 'products'
    })
    User.hasMany(models.review, {
      foreignKey: 'usrId',
      as: 'reviews'
    })
    User.hasMany(models.like, {
      foreignKey: 'usrId',
      as: 'likes'
    })
    User.hasMany(models.order, {
      foreignKey: 'usrId',
      as: 'orders'
    })
    User.hasMany(models.connection, {
      foreignKey: 'usrFromId',
      as: 'followees'
    })
    User.hasMany(models.connection, {
      foreignKey: 'usrToId',
      as: 'followers'
    })
  }
  return User
}