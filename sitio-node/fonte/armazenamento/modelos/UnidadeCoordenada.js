'use strict';

/* @arquivo UnidadeCoordenada.js */

/* Versão 0.0.1-beta
 * - Uso do padrão snake_case. [FEITO]
 * - Fazer associação funcionar. [FEITO]
 */

module.exports = function (database, DataTypes) {
  
  var VERSAO_BANCO_DADOS = 1;

  var UnidadeCoordenada = database.define('UnidadeCoordenada',  {
    latitude: {                  // Latitude da coordenada do nosso mapa.
      type: DataTypes.CHAR,
      validate: {}
    },
    longitude: {                 // Longitude da coordenada do nosso mapa.
      type: DataTypes.CHAR,
      validate: {}
    }
  },  
  {
    associate: function (modelos) {
      
    },
    instanceMethods: {
    
    },
    underscored: true // Lembre-se que utilizamos o padrão snake_case
  });

  return UnidadeCoordenada;
};