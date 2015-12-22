'use strict';

/* @arquivo Usuario.js */

var uuid = require('node-uuid');
var bcrypt = require('bcrypt-nodejs');

module.exports = function (sequelize, DataTypes) {

  var VERSAO_BANCO_DADOS = 1;

  var Usuario = sequelize.define('Usuario', {
    name: {                    // Nome do usuário.
      type: DataTypes.STRING,
      validate: {}
    },
    jid: {                     // JID do usuário.
      type: DataTypes.STRING,
      unique: true,
      validate: {}
    },
    uuid: {                    // Identificador unico deste usuário.
      type: DataTypes.UUID,
      unique: true,
      defaultValue: uuid.v4,
      validate: {
        isUUID: 4
      }
    },
    password: {                // A senha do usuário. 
      type: DataTypes.STRING,
      validate: {}
    }
  }, {
    associate: function (modelos) {
      // Adiciona coluna de chave estrangeira 'usuario_id' para o modelo de acesso as rotas.
      // Cada um dos acesso a rota pertencerá a um usuário. 
      modelos.Usuario.hasMany(modelos.AcessoRota, { foreignKey: 'usuario_id' }); 
    },
    instanceMethods: {
      verificarSenha: function(password) {
        // Verificamos a senha de forma sincrona. Retorna true se cofere com a nossa senha.
        return bcrypt.compareSync(password, this.password);
      }
    }
  });

  return Usuario;
};