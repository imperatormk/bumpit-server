'use strict'
module.exports = (sequelize, DataTypes) => {
  const ShippingInfo = sequelize.define('shippingInfo', {
    fullname: DataTypes.STRING,
    address: DataTypes.STRING,
    unit: DataTypes.STRING,
    state: DataTypes.STRING,
    city: DataTypes.STRING,
    zipcode: DataTypes.STRING,
    contactPhone: DataTypes.STRING
  }, {
  	timestamps: false
  })
  return ShippingInfo
}