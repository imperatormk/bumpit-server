'use strict'
module.exports = (sequelize, DataTypes) => {
  const Shipping = sequelize.define('shipping', {
    address: DataTypes.STRING,
    trackingNo: DataTypes.STRING,
    status: DataTypes.STRING,
  })
  Shipping.associate = function(models) {
    Shipping.belongsTo(models.order, {
      foreignKey: 'ordId',
      as: 'order'
    })
  }
  return Shipping
}