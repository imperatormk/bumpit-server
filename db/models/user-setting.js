'use strict'
module.exports = (sequelize, DataTypes) => {
  const UserSetting = sequelize.define('userSetting', {
    disableTrades: DataTypes.BOOLEAN,
    language: DataTypes.STRING,
    currency: DataTypes.STRING,
    notifOnLike: DataTypes.BOOLEAN,
    notifOnFollow: DataTypes.BOOLEAN,
    notifOnFriendPost: DataTypes.BOOLEAN
  }, {
    timestamps: false
  })
  UserSetting.associate = function(models) {
    UserSetting.belongsTo(models.user, {
      foreignKey: 'usrId',
      as: 'user'
    })
  }
  return UserSetting
}