'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.renameColumn('users','email','username');
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.renameColumn('users','username','email');
  }
};
