'use strict';

/* @arquivo CarrosselSlide.js */

// @AFAZER: Adicionar o tamanho máximo de cada item 
module.exports = function (database, DataTypes) {

  var CarrosselSlide = database.define('CarrosselSlide', {
    titulo: {
      type: DataTypes.STRING, // <umdez> Qual será o tamanho desta coluna?
      validate: {} // <umdez> Como realizar esta validação?
    },
    texto: {
      type: DataTypes.STRING, // <umdez> Qual será o tamanho desta coluna?
      validate: {} // <umdez> Como realizar esta validação?
    },
    texto_botao: {
      type: DataTypes.STRING, // <umdez> Qual será o tamanho desta coluna?
      validate: {} // <umdez> Como realizar esta validação?
    },
    imagem_dir: {
      type: DataTypes.STRING, // <umdez> Qual será o tamanho desta coluna?
      validate: {} // <umdez> Como realizar esta validação?
    },
    ativo: {
      type: DataTypes.BOOLEAN, // <umdez> Qual será o tamanho desta coluna?
      validate: {} // <umdez> Como realizar esta validação?
    },
    endereco_botao: {
      type: DataTypes.STRING, // <umdez> Qual será o tamanho desta coluna?
      validate: {} // <umdez> Como realizar esta validação?
    }
  }, {
    associate: function (modelos) {

    },
    instanceMethods: {
    
    }
  });

  return CarrosselSlide;
};