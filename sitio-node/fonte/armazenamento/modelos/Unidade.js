'use strict';

/* @arquivo Unidade.js */

// ATENÇÃO: Por enquanto não vamos utilizar isso porque é mais produtivo definir as 
// Coordenadas de Unidades diretamente em arquivo html.
// O grande problema é inserir os dados das coordenadas e unidades.
// Precisariamos de desenvolver um formulário para adicionar os dados.

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