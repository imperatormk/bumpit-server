'use strict'
module.exports = (sequelize, DataTypes) => {
  const Review = sequelize.define('review', {
    rating: DataTypes.INTEGER,
    message: DataTypes.TEXT,
  })
  Review.associate = function(models) {
    Review.belongsTo(models.item, {
      foreignKey: 'itmId',
      as: 'item'
    })
    Review.belongsTo(models.user, {
      foreignKey: 'usrId',
      as: 'reviewer'
    })
  }
  return Review
}