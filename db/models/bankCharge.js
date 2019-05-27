'use strict'
module.exports = (sequelize, DataTypes) => {
  const BankCharge = sequelize.define('bankCharge', {
    txnId: DataTypes.STRING,
    amount: DataTypes.INTEGER,
    amountRefunded: DataTypes.INTEGER,
    currency: DataTypes.STRING,
    stage: DataTypes.STRING,
    status: DataTypes.STRING,
  })
  BankCharge.associate = function(models) {
    BankCharge.belongsTo(models.order, {
      foreignKey: 'ordId',
      as: 'order'
    })
    BankCharge.hasMany(models.refund, {
      foreignKey: 'chgId',
      as: 'refunds'
    })
  }
  return BankCharge
}