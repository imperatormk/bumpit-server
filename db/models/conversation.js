'use strict'
module.exports = (sequelize, DataTypes) => {
  const Conversation = sequelize.define('conversation', {
  	open: DataTypes.BOOLEAN
  })
  Conversation.associate = function(models) { // TODO: make cnvId + ordId unique
    Conversation.hasMany(models.chatMessage, {
      foreignKey: 'cnvId',
      as: 'messages'
    })
    Conversation.belongsTo(models.order, {
      foreignKey: 'ordId',
      as: 'order'
    })
    Conversation.belongsTo(models.user, {
      foreignKey: 'usrId',
      as: 'buyer'
    })
  }
  return Conversation
}