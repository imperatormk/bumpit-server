'use strict'
module.exports = (sequelize, DataTypes) => {
  const Event = sequelize.define('event', {
    type: DataTypes.STRING,
    entryId: DataTypes.INTEGER,
  })
  Event.associate = function(models) {
    Event.belongsTo(models.order, {
      foreignKey: 'ordId',
      as: 'order'
    })
  }
  return Event
}