'use strict'
module.exports = (sequelize, DataTypes) => {
  const BankRefund = sequelize.define('bankRefund', {
    txnId: DataTypes.STRING,
    status: DataTypes.STRING,
  })
  BankRefund.associate = function(models) {
    BankRefund.belongsTo(models.refund, {
      foreignKey: 'refId',
      as: 'refunds'
    })
  }
  return BankRefund
}