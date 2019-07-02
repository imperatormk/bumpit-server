'use strict'
module.exports = (sequelize, DataTypes) => {
  const Refund = sequelize.define('refund', {
    amount: DataTypes.INTEGER,
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