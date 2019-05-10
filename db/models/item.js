'use strict'
module.exports = (sequelize, DataTypes) => {
  const Item = sequelize.define('item', {
    title: DataTypes.STRING,
    details: DataTypes.TEXT,
    condition: DataTypes.INTEGER,
    price: DataTypes.FLOAT,
    currency: DataTypes.INTEGER,
    size: DataTypes.STRING,
    location: DataTypes.STRING,
    status: DataTypes.INTEGER,
  })
  Item.associate = function(models) {
    Item.belongsTo(models.category, {
      foreignKey: 'catId',
      as: 'category'
    })
    Item.belongsTo(models.user, {
      foreignKey: 'selId',
      as: 'seller'
    })
    Item.hasMany(models.like, {
      foreignKey: 'itmId',
      as: 'likes'
    })
    Item.hasMany(models.image, {
      foreignKey: 'itmId',
      as: 'images'
    })
  }
  return Item
}