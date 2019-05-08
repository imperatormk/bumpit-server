'use strict'
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('user', {
    username: DataTypes.STRING,
    location: DataTypes.STRING,
    bio: DataTypes.TEXT,
    email: DataTypes.TEXT,
    phone: DataTypes.TEXT,
  })
  User.associate = function(models) {
    User.hasMany(models.item, {
      foreignKey: 'usrId',
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