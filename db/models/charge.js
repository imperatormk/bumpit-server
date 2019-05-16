'use strict'
module.exports = (sequelize, DataTypes) => {
  const Charge = sequelize.define('charge', {
    txnId: DataTypes.STRING,
    amount: DataTypes.INTEGER,
    amountRefunded: DataTypes.INTEGER,
    currency: DataTypes.STRING,
    status: DataTypes.STRING,
  })
  Charge.associate = function(models) {
    Charge.belongsTo(models.order, {
      foreignKey: 'ordId',
      as: 'order'
    })
    Charge.hasMany(models.refund, {
      foreignKey: 'chgId',
      as: 'refunds'
    })
  }
  return Charge
}