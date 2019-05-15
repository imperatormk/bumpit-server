'use strict'
module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define('order', {
    txnId: DataTypes.STRING,
  })
  Order.associate = function(models) {
    Order.belongsTo(models.item, {
      foreignKey: 'itmId',
      as: 'item'
    })
    Order.belongsTo(models.user, {
      foreignKey: 'usrId',
      as: 'buyer'
    })
  }
  return Order
}