'use strict';

/* @arquivo AcessoRota.js */

module.exports = function (sequelize, DataTypes) {

  var VERSAO_BANCO_DADOS = 1;

  var Escopo = sequelize.define('Escopo', {
    id: { 
      type: DataTypes.INTEGER, 
      autoIncrement: true, 
      primaryKey: true 
    },
    modelo: {
      type: DataTypes.STRING       // O nome do modelo de banco de dados. Exemplo: Exame
    },
    bandeira: {                    // Bandeira para acesso as rotas deste modelo.
      type: DataTypes.STRING,
      validate: {}
    }
  }, {
    associate: function (modelos) {

    },
    instanceMethods: {
      
    }
  });

  return Escopo;
};