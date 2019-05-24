'use strict'
module.exports = (sequelize, DataTypes) => {
  const Image = sequelize.define('image', {
    url: DataTypes.STRING,
    featured: DataTypes.BOOLEAN,
  }, {
    timestamps: false
  })
  Image.associate = function(models) {
    Image.belongsTo(models.product, {
      foreignKey: 'itmId',
      as: 'product'
    })
  }
  return Image
}