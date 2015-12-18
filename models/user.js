'use strict';
module.exports = function(sequelize, DataTypes) {
  var user = sequelize.define('user', {
    name: DataTypes.STRING,
    username : {
      type     : DataTypes.STRING,
      validate : {
        notEmpty : true
      }
    }
  }, {
    classMethods: {
      associate: function(models) {
        models.user.hasMany(models.provider);
        // associations can be defined here
      }
    },

  });
  return user;
};