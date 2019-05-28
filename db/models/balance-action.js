// might rename
'use strict';
module.exports = (sequelize, DataTypes) => {
  const BalanceAction = sequelize.define('balanceAction', {
  	direction: DataTypes.STRING,
    amount: DataTypes.INTEGER
  });
  BalanceAction.associate = function(models) {
    BalanceAction.belongsTo(models.order, {
      foreignKey: 'entryId',
      as: 'order'
    })
    BalanceAction.belongsTo(models.refund, {
      foreignKey: 'entryId',
      as: 'refunds'
    })
  }
  return BalanceAction;
};