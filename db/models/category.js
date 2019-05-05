'use strict';
module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define('category', {
  	name: DataTypes.STRING
  }, {
  	timestamps: false
  });
  return Category;
};