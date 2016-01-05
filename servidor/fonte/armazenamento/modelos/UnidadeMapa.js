'use strict';

/* @arquivo UnidadeMapa.js */

/* Versão 0.0.1-beta
 * - Fazer associação funcionar. [FEITO]
 */

module.exports = function (database, DataTypes) {
  
  var VERSAO_BANCO_DADOS = 1;
  
  var UnidadeMapa = database.define('UnidadeMapa', {
    id: { 
      type: DataTypes.INTEGER, 
      autoIncrement: true, 
      primaryKey: true 
    },
    zoom: {
      type: DataTypes.STRING, // Zoom realizado no mapa.
      validate: {} 
    },
    lat: {                  // Latitude da coordenada do nosso mapa.
      type: DataTypes.CHAR,
      validate: {}
    },
    lng: {                 // Longitude da coordenada do nosso mapa.
      type: DataTypes.CHAR,
      validate: {}
    }
  }, 
   {
    associate: function (modelos) {
      
      
    },
    instanceMethods: {
    
    },
    underscored: true, // Lembre-se que utilizamos o padrão snake_case
    timestamps: false
  });

  return UnidadeMapa;
};