'use strict'
module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define('product', {
    title: DataTypes.STRING,
    details: DataTypes.TEXT,
    condition: DataTypes.INTEGER,
    price: DataTypes.FLOAT,
    currency: DataTypes.STRING,
    size: DataTypes.STRING,
    location: DataTypes.STRING,
    status: DataTypes.STRING,
  })
  Product.associate = function(models) {
    Product.belongsTo(models.category, {
      foreignKey: 'catId',
      as: 'category'
    })
    Product.belongsTo(models.user, {
      foreignKey: 'selId',
      as: 'seller'
    })
    Product.hasOne(models.order, {
      foreignKey: 'itmId',
      as: 'order'
    })
    Product.hasMany(models.like, {
      foreignKey: 'itmId',
      as: 'likes'
    })
    Product.hasMany(models.image, {
      foreignKey: 'itmId',
      as: 'images'
    })
  }
  return Product
}