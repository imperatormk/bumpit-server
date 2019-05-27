// might rename
'use strict';
module.exports = (sequelize, DataTypes) => {
  const BalanceAction = sequelize.define('balanceAction', {
  	direction: DataTypes.STRING,
    amount: DataTypes.INTEGER
  });
  BalanceAction.associate = function(models) {
    BalanceAction.belongsTo(models.order, {
      foreignKey: 'ordId',
      as: 'order'
    })
    BalanceAction.belongsTo(models.refund, {
      foreignKey: 'refId',
      as: 'refunds'
    })
  }
  return BalanceAction;
};