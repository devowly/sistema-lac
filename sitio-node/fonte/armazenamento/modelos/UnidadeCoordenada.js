'use strict';

/* @arquivo UnidadeCoordenada.js */

// ATENÇÃO: Por enquanto não vamos utilizar isso porque é mais produtivo definir as 
// Coordenadas de Unidades diretamente em arquivo html.
// O grande problema é inserir os dados das coordenadas e unidades.
// Precisariamos de desenvolver um formulário para adicionar os dados.

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