'use strict'
module.exports = (sequelize, DataTypes) => {
  const Like = sequelize.define('like', {})
  Like.associate = function(models) {
    Like.belongsTo(models.item, {
      foreignKey: 'itmId',
      as: 'item'
    })
    Like.belongsTo(models.user, {
      foreignKey: 'usrId',
      as: 'liker'
    })
  }
  return Like
}