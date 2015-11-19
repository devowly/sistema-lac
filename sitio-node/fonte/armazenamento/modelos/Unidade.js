'use strict';

/* @arquivo Unidade.js */

// @AFAZER: Adicionar o tamanho máximo de cada item 
// @AFAZER: Adicionar associação com as coordenadas.
module.exports = function (database, DataTypes) {

  var Unidade = database.define('Unidade', {
    nome: {
      type: DataTypes.STRING, // <umdez> Qual será o tamanho desta coluna?
      validate: {} // <umdez> Como realizar esta validação?
    },
    texto: {
      type: DataTypes.STRING, // <umdez> Qual será o tamanho desta coluna?
      validate: {} // <umdez> Como realizar esta validação?
    }
  }, {
    associate: function (modelos) {

    },
    instanceMethods: {
    
    }
  });

  return Unidade;
};