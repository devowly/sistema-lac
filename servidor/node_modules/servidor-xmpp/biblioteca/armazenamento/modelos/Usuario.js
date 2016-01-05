'use strict';

/* @arquivo Usuario.js */

var uuid = require('node-uuid');

module.exports = function (sequelize, DataTypes) {

  var VERSAO_BANCO_DADOS = 1;

  var Usuario = sequelize.define('Usuario', {
    name: {                            // Nome do usuário.
      type: DataTypes.STRING,
      validate: {}
    },
    jid: {                             // JID do usuário.
      type: DataTypes.STRING,
      unique: true,
      validate: {}
    },
    uuid: {                            // Identificador unico deste usuário.
      type: DataTypes.UUID,
      unique: true,
      defaultValue: uuid.v4,
      validate: {
        isUUID: 4
      }
    }
  }, {
    associate: function (modelos) {
/*
      // all users have a relationship
      // owner is only a special type of relationship
      // roles and affiliations are stored with association between
      // room and user

      // rooms where a user is member
      modelos.Usuario.hasMany(modelos.Room, {
        through: modelos.RoomMember
      });

      // channels where a user is subscriber
      modelos.Usuario.hasMany(modelos.Channel, {
        through: modelos.ChannelSub
      });

      // roaster
      modelos.Usuario.hasMany(modelos.Usuario, {
        through: modelos.Roaster,
        as: 'RoasterItems'
      });

      modelos.Usuario.hasMany(modelos.Usuario, {
        through: modelos.Roaster,
        as: 'Roaster'
      });
*/
    },
    instanceMethods: {
      /*
       * is used especially for the api, be aware
       * that no internal data should be exposed
       */
      exportJSON: function () {
        var json = this.toJSON();

        if (json) {
          // remove internal id
          delete json.id;
        }
        return json;
      }
    }
  });

  return Usuario;
};