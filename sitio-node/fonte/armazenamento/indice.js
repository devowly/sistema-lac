'use strict';

var util = require('util');
var EmissorEvento = require('events').EventEmitter;
var Sequelize = require('sequelize');
var Promessa = require('bluebird');
var modelos = require('./modelos/indice');
var registrador = require('../nucleo/registrador')('armazenamento');

/**
 * Abstração da gerencia da database.
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

/**
 * Inicia o banco de dados e sincroniza as tabelas se elas não estiverem lá
 */
Armazenamento.prototype.iniciar = function (opcsSincroniza) {

  registrador.debug('Iniciando');

  opcsSincroniza = opcsSincroniza ||  {};
  var esteObjeto = this;

  return new Promessa(function (deliberar, recusar) {

    var maxConcurrentQueries = esteObjeto.opc.maxConcurrentQueries ||  100;
    var maxConnections = esteObjeto.opc.maxConnections ||  1;
    var maxIdleTime = esteObjeto.opc.maxIdleTime ||  30;

    // opções base
    var opcoes = {
      language: 'en',
      maxConcurrentQueries: maxConcurrentQueries,
      pool: {
        maxConnections: maxConnections,
        maxIdleTime: maxIdleTime
      }
    };

    // could be sqlite, postgres, mysql
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

module.exports = Armazenamento;