'use strict';

/* @arquivo Unidade.js */

// ATENÇÃO: Por enquanto não vamos utilizar isso porque é mais produtivo definir as 
// Coordenadas de Unidades diretamente em arquivo html.

module.exports = function (database, DataTypes) {

  var Unidade = database.define('Unidade', {
    nome: {
      type: DataTypes.STRING, // Por padrão o tamanho é de 255 caracteres.
      validate: {} 
    }
  }, {
    associate: function (modelos) {
      
    },
    instanceMethods: {
    
    }
  });

  return Unidade;
};