'use strict'
const helpers = require(__basedir + '/helpers')

module.exports = (sequelize, DataTypes) => {
  const Image = sequelize.define('image', {
    url: {
      type: DataTypes.STRING,
      get() {
        const value = this.getDataValue('url')
        return helpers.getStaticFilesUrl('productImages', value)
      }
    },
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