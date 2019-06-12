'use strict'
module.exports = (sequelize, DataTypes) => {
  const ChatMessage = sequelize.define('chatMessage', {
  	content: DataTypes.TEXT,
    fromBuyer: DataTypes.BOOLEAN
  })
  ChatMessage.associate = function(models) {
    ChatMessage.belongsTo(models.conversation, {
      foreignKey: 'cnvId',
      as: 'messages'
    })
  };
  return ChatMessage
}