'use strict';

/* @arquivo UnidadeCoordenada.js */

module.exports = function (database, DataTypes) {

  var UnidadeCoordenada = database.define('UnidadeCoordenada', {
    latitude: {
      type: DataTypes.STRING,
      validate: {}
    },
    longitude: {
      type: DataTypes.STRING,
      validate: {}
    }
  }, {
    associate: function (modelos) {

    },
    instanceMethods: {
    
    }
  });

  return UnidadeCoordenada;
};