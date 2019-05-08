'use strict'
module.exports = (sequelize, DataTypes) => {
  const Purchase = sequelize.define('purchase', {
    txnId: DataTypes.STRING,
  })
  Purchase.associate = function(models) {
    Purchase.belongsTo(models.item, {
      foreignKey: 'itmId',
      as: 'item'
    })
    Purchase.belongsTo(models.user, {
      foreignKey: 'usrId',
      as: 'buyer'
    })
  }
  return Purchase
}