'use strict';
module.exports = (sequelize, DataTypes) => {
  const Charge = sequelize.define('charge', {
    currency: DataTypes.STRING,
    stage: DataTypes.STRING,
  });
  Charge.associate = function(models) {
    Charge.belongsTo(models.order, {
      foreignKey: 'ordId',
      as: 'order'
    })
    Charge.hasOne(models.bankCharge, {
      foreignKey: 'chgId',
      as: 'bankCharge'
    })
    Charge.hasOne(models.balanceAction, {
      foreignKey: 'entryId',
      as: 'balanceCharge'
    })
  }
  return Charge;
};