'use strict'
module.exports = (sequelize, DataTypes) => {
  const Conversation = sequelize.define('conversation', {
  	status: DataTypes.INTEGER
  })
  Conversation.associate = function(models) { // TODO: make cnvId + ordId unique
    Conversation.hasMany(models.chatMessage, {
      foreignKey: 'cnvId',
      as: 'messages'
    })
    Conversation.belongsTo(models.product, {
      foreignKey: 'proId',
      as: 'product'
    })
    Conversation.belongsTo(models.user, {
      foreignKey: 'usrId',
      as: 'buyer'
    })
  }
  return Conversation
}