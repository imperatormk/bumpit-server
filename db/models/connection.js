'use strict'
module.exports = (sequelize, DataTypes) => {
  const Connection = sequelize.define('connection', {})
  Connection.associate = function(models) {
    Connection.belongsTo(models.user, {
      foreignKey: 'usrFromId',
      as: 'follower'
    })
    Connection.belongsTo(models.user, {
      foreignKey: 'usrToId',
      as: 'followee'
    })
  }
  return Connection
}