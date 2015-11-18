'use strict';

module.exports = function (database, DataTypes) {

  var Unidade = database.define('Unidade', {
    titulo: {
      type: DataTypes.STRING,
      validate: {}
    },
    texto: {
      type: DataTypes.STRING,
      validate: {}
    },
    texto_botao: {
      type: DataTypes.STRING,
      validate: {}
    },
    imagem: {
      type: DataTypes.STRING,
      validate: {}
    },
  }, {
    associate: function (modelos) {

    },
    instanceMethods: {
    
    }
  });

  return Unidade;
};