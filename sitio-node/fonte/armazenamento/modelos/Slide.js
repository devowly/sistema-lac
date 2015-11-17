'use strict';

module.exports = function (sequelize, DataTypes) {

  var Slide = sequelize.define('Slide', {
    titulo: {
      type: DataTypes.STRING,
      validate: {}
    },
    texto: {
      type: DataTypes.STRING,
      validate: {}
    },
    imagem: {
      type: DataTypes.BLOB,
      validate: {}
    }
  }, {
    associate: function (modelos) {

    },
    instanceMethods: {
    
    }
  });

  return Slide;
};