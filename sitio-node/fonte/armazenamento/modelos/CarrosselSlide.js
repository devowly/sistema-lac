'use strict';

module.exports = function (database, DataTypes) {

  var CarrosselSlide = database.define('CarrosselSlide', {
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
    imagem_dir: {
      type: DataTypes.STRING,
      validate: {}
    },
    ativo: {
      type: DataTypes.BOOLEAN,
      validate: {}
    },
    endereco_botao: {
      type: DataTypes.STRING,
      validate: {}
    }
  }, {
    associate: function (modelos) {

    },
    instanceMethods: {
    
    }
  });

  return CarrosselSlide;
};