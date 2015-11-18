'use strict';

module.exports = function (database, DataTypes) {

  var Coordenada = database.define('Coordenada', {
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

  return Coordenada;
};