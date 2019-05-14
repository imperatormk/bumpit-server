'use strict'
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('user', {
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    location: DataTypes.STRING,
    bio: DataTypes.TEXT,
    email: DataTypes.TEXT,
    phone: DataTypes.TEXT,
    rating: {
      type: DataTypes.VIRTUAL,
      get() {
        const reviews = this.getDataValue('reviews')
        if (reviews && reviews.length) {
          const rating = reviews.map(val => val.rating).reduce((acc, val) => acc + val) / reviews.length
          return rating
        }
        return null
      }
    }
  }, {
    defaultScope: {
      include: [{ model: sequelize.models.review, as: 'reviews', attributes: ['rating'] }]
    }
  })
  User.associate = function(models) {
    User.hasMany(models.item, {
      foreignKey: 'selId',
      as: 'items'
    })
    User.hasMany(models.review, {
      foreignKey: 'usrId',
      as: 'reviews'
    })
    User.hasMany(models.like, {
      foreignKey: 'usrId',
      as: 'likes'
    })
    User.hasMany(models.purchase, {
      foreignKey: 'usrId',
      as: 'purchases'
    })
    User.hasMany(models.connection, {
      foreignKey: 'usrId',
      as: 'connections'
    })
  }
  return User
}