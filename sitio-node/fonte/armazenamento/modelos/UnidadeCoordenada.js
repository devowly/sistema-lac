'use strict';

/* @arquivo UnidadeCoordenada.js */

// ATENÇÃO: Por enquanto não vamos utilizar isso porque é mais produtivo definir as 
// Coordenadas de Unidades diretamente em arquivo html.

module.exports = function (database, DataTypes) {

  var UnidadeCoordenada = database.define('UnidadeCoordenada', {
    latitude: {
      type: DataTypes.CHAR,
      validate: {}
    },
    longitude: {
      type: DataTypes.CHAR,
      validate: {}
    }
  }, {
    associate: function (modelos) {
      
      // Adiciona coluna de chave estrangeira 'UnidadeId' para esta tabela.
      modelos.UnidadeCoordenada.belongsTo(modelos.Unidade, {
        
      }); 
      
    },
    instanceMethods: {
    
    }
  });

  return UnidadeCoordenada;
};