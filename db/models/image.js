'use strict'
module.exports = (sequelize, DataTypes) => {
  const Image = sequelize.define('image', {
    url: DataTypes.STRING,
    featured: DataTypes.BOOLEAN,
  })
  Image.associate = function(models) {
    Image.belongsTo(models.item, {
      foreignKey: 'itmId',
      as: 'item'
    })
  }
  return Image
}