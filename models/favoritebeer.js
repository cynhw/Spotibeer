'use strict';
module.exports = function(sequelize, DataTypes) {
  var favoriteBeer = sequelize.define('favoriteBeer', {
    beer: DataTypes.STRING,
    abv: DataTypes.STRING,
    style: DataTypes.STRING,
    brewery: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return favoriteBeer;
};