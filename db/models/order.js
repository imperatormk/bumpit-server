'use strict'
module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define('order', {
    status: DataTypes.STRING,
    shippingInfo: DataTypes.JSON,
    chargeSummary: DataTypes.JSON
  })
  Order.associate = function(models) {
    Order.belongsTo(models.product, {
      foreignKey: 'proId',
      as: 'product'
    })
    Order.belongsTo(models.user, {
      foreignKey: 'usrId',
      as: 'buyer'
    })
    Order.hasOne(models.charge, {
      foreignKey: 'ordId',
      as: 'charge'
    })
    Order.hasOne(models.shipping, {
      foreignKey: 'ordId',
      as: 'shipping'
    })
  }
  return Order
}