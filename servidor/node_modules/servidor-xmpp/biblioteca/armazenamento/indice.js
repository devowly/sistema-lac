'use strict';

var util = require('util');
var EmissorEvento = require('events').EventEmitter;
var Sequelize = require('sequelize');
var Promessa = require('bluebird');
var modelos = require('./modelos/indice');
var _ = require('lodash');
var registrador = require('../nucleo/Registrador')('armazenamento');

/* Contem funções para a gerencia da database.
 *
 * @Parametro {opcoes} Contem as opções para configuração
 */
var Armazenamento = function (opcoes) {
  EmissorEvento.call(this);

  if (!opcoes) {
    throw new Error('Opções da database não foram colocados');
  }
  this.opc = opcoes;
};

util.inherits(Armazenamento, EmissorEvento);

Armazenamento.prototype.carregarModelos = function () {
  // Carrega todos modelos da pasta modelos e cada um deles é adicionado a este objeto.
  // Por exemplo, o modelo Slide será armazenado em this.Slide
  // Sendo assim a gente pode acessar daqui os diversos modelos.
  modelos(this.sequelize, this);
};

/* Inicia o nosso banco de dados e sincroniza as tabelas se elas não estiverem lá
 *
 * @Parametro {opcsSincroniza} Contem as opções de configuração.
 * @Retorna {Promessa} Promessa de recusa ou deliberação.
 */
Armazenamento.prototype.iniciar = function (opcsSincroniza) {

  registrador.debug('Iniciando');

  opcsSincroniza = opcsSincroniza ||  {};
  var esteObjeto = this;

  return new Promessa(function (deliberar, recusar) {

    var maxConcurrentQueries = esteObjeto.opc.maxConcurrentQueries ||  100;
    var maxConnections = esteObjeto.opc.maxConnections ||  1;
    var maxIdleTime = esteObjeto.opc.maxIdleTime ||  30;

    // opções base
    var opcoes = {
      language: 'en',
      maxConcurrentQueries: maxConcurrentQueries,
      pool: {
        maxConnections: maxConnections,
        maxIdleTime: maxIdleTime
      }
    };

    // Poderia ser sqlite, postgres e mysql
    if (esteObjeto.opc.dialect) {
      opcoes.dialect = esteObjeto.opc.dialect;
    }

    if (esteObjeto.opc.host) {
      opcoes.host = esteObjeto.opc.host;
    }

    if (esteObjeto.opc.port) {
      opcoes.port = esteObjeto.opc.port;
    }

    // Pasta do banco de dados para o SqLite <umdez> Obsoleto?
    if (esteObjeto.opc.storage) {
      opcoes.storage = esteObjeto.opc.storage;
    }

    // Inicia conexão com o banco de dados.
    var sequelize = new Sequelize(
      esteObjeto.opc.database,
      esteObjeto.opc.user,
      esteObjeto.opc.password, 
      opcoes
    );
    
    // Armazenamos o sequelize para utilização das outras classes.
    esteObjeto.sequelize = sequelize;

    // Carrega os arquivos que contem os nossos modelos.
    esteObjeto.carregarModelos();

    // Sincroniza os modelos com o banco de dados.
    sequelize.sync(opcsSincroniza)
      .complete(function (err) {
        if (err) {
          registrador.error(err);
          recusar(err);
        } else {
          deliberar(esteObjeto);
        }
      });
  });
};

Armazenamento.prototype.procurarUsuario = function (jid, opcoes) {

  var armazenamento = this;
  opcoes = opcoes || {};

  if (!jid) {
    throw new Error('Está faltando o jid');
    return;
  }

  return armazenamento.Usuario.find({
    where: {
      jid: jid
    }
  }, opcoes).then(function (usuario) {
    if (!usuario) {
      throw new Error('Não foi possível encontrar o usuário ');
    }
    return usuario;
  })

};

Armazenamento.prototype.encontrarOuCriarUsuario = function (jid, opcoes) {

  var armazenamento = this;
  opcoes = opcoes || {};

  if (!jid) {
    throw new Error('Está faltando o jid');
    return;
  }

  return armazenamento.Usuario.findOrCreate({
    where: {
      jid: jid
    },
    defaults: {
      jid: jid
    }
  }, opcoes);
};

/**
 * find a room
 */
Armazenamento.prototype.findRoom = function (roomname, options) {

  var storage = this;
  options = options || {};

  if (!roomname) {
    throw new Error('roomname is missing')
    return;
  }

  return storage.Room.find({
    include: [{
      model: storage.User,
      attributes: ['jid'],
      as: 'members'
    }],
    where: {
      name: roomname
    }
  }, options).then(function (room) {
    if (!room) {
      throw new Error('could not find room')
    }
    return room;
  })

};

/**
 * find a room or creates a new one
 */
Armazenamento.prototype.findOrCreateRoom = function (owner, roomname, options) {

  var storage = this;
  options = options || {};

  if (!roomname) {
    throw new Error('roomname is missing')
    return;
  }

  return storage.Room.find({
    include: [{
      model: storage.User,
      attributes: ['jid'],
      as: 'members'
    }],
    where: {
      name: roomname
    }
  }, options).then(function (room) {
    if (!room) {
      return storage.addRoom(owner, {
        name: roomname
      }, options)
    } else {
      return room;
    }
  })
}

/**
 * owner is an instance of the user
 */
Armazenamento.prototype.getRoom = function (owner, roomname, options) {

  var storage = this;
  options = options || {};

  if (!owner ||  !roomname) {
    throw new Error('getRoom: no owner or roomname');
  }

  var affiliation = [];
  affiliation.push(storage.RoomMember.Affiliation.Owner);

  // Owner as default affiliation
  return owner.getRooms({
    include: [{
      model: storage.User,
      attributes: ['jid'],
      as: 'members'
    }],
    where: {
      name: roomname,
      'RoomMember.affiliation': affiliation
    }
  }, options).then(function (ownerRooms) {
    registrador.debug('found rooms ' + JSON.stringify(ownerRooms));
    var room = _.first(ownerRooms)
    if (room) {
      return room;
    } else {
      throw new Error('could not find room ' + roomname);
    }
  })
};

Armazenamento.prototype.getRooms = function (user, type, options) {

  var storage = this;
  options = options || {};

  if (!user) {
    throw new Error('no user');
  }

  type = type || 'all';

  var affiliation = [];

  switch (type) {
  case 'owner':
    affiliation.push(storage.RoomMember.Affiliation.Owner);
    break;
  case 'member':
    affiliation.push(storage.RoomMember.Affiliation.Member);
    break;
  default: // all 
    affiliation.push(storage.RoomMember.Affiliation.Owner);
    affiliation.push(storage.RoomMember.Affiliation.Member);
    break;
  }

  // Owner as default affiliation
  return user.getRooms({
    attributes: ['id'],
    where: {
      'RoomMember.affiliation': affiliation,
      'RoomMember.state': [storage.RoomMember.State.Accepted, storage.RoomMember.State.Pending]
    }
  }, options).then(function (userRooms) {

    var ids = userRooms.map(function (val) {
      return val.id;
    });

    registrador.debug(JSON.stringify(ids));

    // read rooms with members
    return storage.Room.findAll({
      // include owner
      include: [{
        model: storage.User,
        attributes: ['jid'],
        as: 'members'
      }],
      where: {
        id: ids
      }
    }, options)
  })
};

Armazenamento.prototype.addRoom = function (owner, data, options) {

  var storage = this;
  options = options || {};

  if (!owner || !data) {
    throw new Error('no owner or data');
  }

  registrador.debug('add room ' + data.name + ' with owner ' + JSON.stringify(owner));
  return storage.Room.create({
    name: data.name,
    subject: data.subject,
    description: data.description
  }, options).then(function (room) {
    registrador.debug('add member to room')

    var opts = {
      'role': storage.RoomMember.Role.Moderator,
      'affiliation': storage.RoomMember.Affiliation.Owner,
      'nickname': ''
    }

    // merge opts with options
    return room.addMember(owner, _.merge(options, opts)).then(function () {

      storage.emit('room_create', {
        'room': room.exportJSON(),
        'owner' : owner
      });

      return room;
    });
  })
};

Armazenamento.prototype.updateRoom = function (room, data, options) {
  var storage = this;
  options = options || {};

  if (!room ||  !data) {
    throw new Error('no room or data');
  }

  var updates = {};

  if (data.subject) {
    updates.subject = data.subject;
  }

  if (data.description) {
    updates.description = data.description;
  }

  registrador.debug('update room ' + room.name);
  return room.updateAttributes(updates, options).then(function(){
    storage.emit('room_update', {
      room: room.exportJSON()
    });
  })
};

Armazenamento.prototype.delRoom = function (room, options) {
  var storage = this;
  options = options || {};

  if (!room) {
    throw new Error('no room');
  }

  registrador.debug('remove room ' + room.name);

  // remove members because cascading delete does not work for through tables
  return room.destroy(options).then(function(){
    storage.emit('room_delete', {
      room: room.exportJSON()
    });
  })

};

Armazenamento.prototype.addMember = function (room, user, options) {

  registrador.debug('add member');

  var storage = this;
  options = options || {};

  if (!room ||  !user) {
    throw new Error('no room or user');
  }

  var opts = {
    'role': storage.RoomMember.Role.Participant,
    'affiliation': storage.RoomMember.Affiliation.Member,
    'nickname': '',
    'state': storage.RoomMember.State.Accepted
  }

  return room.addMember(user, _.merge(options, opts))

};

Armazenamento.prototype.inviteMember = function (data, options) {
  // TODO do not overwrite existing membership with invitation

  registrador.debug('invite member');

  var storage = this;
  options = options || {};

  if (!data ||  !data.room || !data.invitee ||  !data.inviter) {
    throw new Error('room or invitee is missing');
  }

  registrador.debug('compare ' + data.invitee.jid + ' ' + data.inviter.jid);
  if (data.invitee.jid === data.inviter.jid) {
    throw new Error('cannot invite inviter');
  }

  var room = data.room;

  // check if room has this member already, we cannot invite members
  return room.isMember(data.invitee, options).then(function () {
    // alright, we have nothing to do
    return;
  }).catch(function () {

    var opts = {
      'role': storage.RoomMember.Role.Participant,
      'affiliation': storage.RoomMember.Affiliation.Member,
      'nickname': '',
      'state': storage.RoomMember.State.Accepted, // TODO temporary
    }

    // add a user as pending
    return room.addMember(data.invitee, _.merge(options, opts)).then(function () {
      
      // added member to room
      storage.emit('member_invite', {
        room: room.exportJSON(),
        invitee: data.invitee,
        inviter: data.inviter,
        reason: data.reason
      });

    })
  });
};

Armazenamento.prototype.declineMembership = function (data, options) {
  var storage = this;
  options = options || {};

  if (!data || !data.room || !data.invitee) {
    throw new Error('no room or invitee');
  }

  var room = data.room;

  // checkout if the current user is member
  return room.getMembers({
    where: {
      'User.id': data.invitee.id
    }
  }, options).then(function (users) {
    registrador.debug('found users: ' + JSON.stringify(users));

    // user is already part of this room
    if (users && users.length > 0) {
      var roomUser = users[0];

      // update data
      roomUser.RoomMember.state = storage.RoomMember.State.Declined;
      roomUser.RoomMember.save(options);

      // added member to room
      storage.emit('member_declined', {
        room: room,
        invitee: data.invitee,
        inviter: data.inviter,
        reason: data.reason
      });

      return roomUser;
    }
  }).catch(function(err){
    registrador.error(err);
  })
};

Armazenamento.prototype.removeMember = function (room, user, options) {

  if (!room ||  !user) {
    throw new Error('no room or user');
  }

  return room.removeMember(user, options);
};

Armazenamento.prototype.getChannel = function (owner, channelname, options) {
  var storage = this;
  options = options || {};

  if (!owner ||  !channelname) {
    throw new Error('getChannel: no owner or channelname');
  }

  var affiliation = [];
  affiliation.push(storage.ChannelSub.Affiliation.Owner);

  // Owner as default affiliation
  return owner.getChannels({
    where: {
      name: channelname,
      affiliation: affiliation
    }
  }, options).then(function (ownerChannels) {

    var user = _.first(ownerChannels)
    if (user) {
      return user;
    } else {
      throw new Error('owner channels are missing');
    }
  })

};

Armazenamento.prototype.getChannels = function (user, type, options) {
  var storage = this;
  options = options || {};

  if (!user) {
    throw new Error('no user');
  }

  type = type || 'all';

  var affiliation = [];

  switch (type) {
  case 'owner':
    affiliation.push(storage.ChannelSub.Affiliation.Owner);
    break;
  case 'member':
    affiliation.push(storage.ChannelSub.Affiliation.Member);
    break;
  case 'publisher':
    affiliation.push(storage.ChannelSub.Affiliation.Publisher);
    break;
  default: // all 
    affiliation.push(storage.ChannelSub.Affiliation.Owner);
    affiliation.push(storage.ChannelSub.Affiliation.Member);
    affiliation.push(storage.ChannelSub.Affiliation.Publisher);
    break;
  }

  // Owner as default affiliation
  return user.getChannels({
    where: {
      affiliation: affiliation
    }
  }, options)
};

Armazenamento.prototype.addChannel = function (user, data, options) {
  var storage = this;
  options = options || {};

  if (!user) {
    throw new Error('no user');
  }

  return storage.Channel.create({
    name: data.name
  }, options).then(function (channel) {
    var opts = {
      'affiliation': storage.ChannelSub.Affiliation.Owner,
      'substate': storage.ChannelSub.SubState.Member
    };
    return user.addChannel(channel, _.merge(options, opts)).then(function () {
      return channel;
    })
  })
};

Armazenamento.prototype.delChannel = function (channel, options) {

  if (!channel) {
    throw new Error('no channel');
  }

  // remove subscribers because cascading delete does not work for through tables
  /*storage.ChannelSub.destroy({
      ChannelId: channel.id
  }, {});*/

  // delete channel
  return channel.destroy(options)
};

Armazenamento.prototype.findChannel = function (channelname, options) {
  var storage = this;
  options = options || {};

  return storage.Channel.find({
    where: {
      name: channelname
    }
  }, options)
};

/**
 * finds or creates a channel
 */
Armazenamento.prototype.findOrCreateChannel = function (channelname, owner, options) {
  var storage = this;
  options = options || {};

  return storage.Channel.findOrCreate({
      where: {
        name: channelname
      },
      defaults : {
        name: channelname
      }
    },options).spread(function (channel, created) {

      if (created) {
        // assign channel to owner
        return channel.associateUser(channel, owner, [], options).then(function () {
          registrador.debug('Found channel: ' + channel);
          return channel;
        })
      } else {
        return channel;
      }
    })
};

module.exports = Armazenamento;