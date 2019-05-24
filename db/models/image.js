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
      foreignKey: 'proId',
      as: 'product'
    })
  }
  return Image
}