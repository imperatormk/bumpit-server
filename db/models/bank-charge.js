'use strict'
module.exports = (sequelize, DataTypes) => {
  const BankCharge = sequelize.define('bankCharge', {
    txnId: DataTypes.STRING,
    amount: DataTypes.INTEGER,
    status: DataTypes.STRING,
  })
  BankCharge.associate = function(models) {
    BankCharge.belongsTo(models.charge, {
      foreignKey: 'chgId',
      as: 'charge'
    })
    BankCharge.hasMany(models.refund, {
      foreignKey: 'bchId',
      as: 'refunds'
    })
  }
  return BankCharge
}