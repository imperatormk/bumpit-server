'use strict'
module.exports = (sequelize, DataTypes) => {
  const Refund = sequelize.define('refund', {
    currency: DataTypes.STRING,
    status: DataTypes.STRING,
  })
  Refund.associate = function(models) {
    Refund.belongsTo(models.order, {
      foreignKey: 'ordId',
      as: 'order'
    })
  }
  return Refund
}