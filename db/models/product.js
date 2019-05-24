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
      foreignKey: 'proId',
      as: 'order'
    })
    Product.hasMany(models.like, {
      foreignKey: 'proId',
      as: 'likes'
    })
    Product.hasMany(models.image, {
      foreignKey: 'proId',
      as: 'images'
    })
  }
  return Product
}