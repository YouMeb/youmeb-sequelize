'use strict';

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('<%= name %>', {
    timestamps: false
  });
};
