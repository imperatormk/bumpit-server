'use strict'
module.exports = (sequelize, DataTypes) => {
  const Refund = sequelize.define('refund', {
    refId: DataTypes.STRING,
    amount: DataTypes.INTEGER,
    currency: DataTypes.STRING,
    status: DataTypes.STRING,
  })
  Refund.associate = function(models) {
    Refund.belongsTo(models.charge, {
      foreignKey: 'chgId',
      as: 'charge'
    })
  }
  return Refund
}