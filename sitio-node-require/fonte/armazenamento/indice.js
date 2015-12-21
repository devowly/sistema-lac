'use strict';

/* @arquivo indice.js 
 *
 * Implementação do nosso armazenamento de dados. Oferecendo o suporte completo de um
 * Banco de Dados relacional ao nosso aplicativo. @Veja http://docs.sequelizejs.com/en/latest/
 */

/* Versão 0.0.1-Beta */

var util = require('util');
var EmissorEvento = require('events').EventEmitter;
var Sequelize = require('sequelize');
var Promessa = require('bluebird');
var modelos = require('./modelos/indice');
var registrador = require('../nucleo/registrador')('armazenamento');

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

/* Inicia o nosso banco de dados e sincroniza as tabelas se elas não estiverem lá.
 *
 * @Parametro {opcsSincroniza} Contem as opções de configuração em um objeto chave valor.
 * @Retorna {Promessa} Promessa de recusa ou deliberação.
 */
Armazenamento.prototype.iniciar = function (opcsSincroniza) {

  registrador.debug('Iniciando');

  opcsSincroniza = opcsSincroniza || {};
  var esteObjeto = this;

  return new Promessa(function (deliberar, recusar) {

    var maxConcurrentQueries = esteObjeto.opc.maxConcurrentQueries ||  100; // Valor máximo de consultas concorrentes.
    var maxConnections = esteObjeto.opc.maxConnections ||  1;               // Valo máximo de conexões.
    var maxIdleTime = esteObjeto.opc.maxIdleTime ||  30;                    // Tempo máximo inativo.

    // As opções base
    var opcoes = {
      language: 'en',
      maxConcurrentQueries: maxConcurrentQueries, // Valor máximo de consultas concorrentes.
      pool: {
        maxConnections: maxConnections,           // Valo máximo de conexões.
        maxIdleTime: maxIdleTime                  // Tempo máximo inativo.
      }
    };

    // O dialeto utilizado. Poderia ser sqlite, postgres ou mysql.
    if (esteObjeto.opc.dialect) {
      opcoes.dialect = esteObjeto.opc.dialect;
    }

    // Endereço do banco de dados.
    if (esteObjeto.opc.host) {
      opcoes.host = esteObjeto.opc.host;
    }

    // Porta do banco de dados.
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
    sequelize.sync(opcsSincroniza).then(function() {
      
      deliberar(esteObjeto);
    }).catch(function(erro){
      registrador.error(erro);
      recusar(erro);
    }); 
   
  });
};

module.exports = Armazenamento;