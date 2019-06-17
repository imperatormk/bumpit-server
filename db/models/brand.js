'use strict'
module.exports = (sequelize, DataTypes) => {
  const Brand = sequelize.define('brand', {
  	name: DataTypes.STRING
  }, {
  	timestamps: false
  })
  return Brand
}