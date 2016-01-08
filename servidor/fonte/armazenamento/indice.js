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

/* @Classe Armazenamento().
 *
 * Contêm as funções para a gerencia da database. Aqui iremos tentar uma conexão com o nosso banco de dados.
 * Para a conexão estaremos utilizando o Sequelize. Assim que a conexão for realizadas nós iremos 
 * sincronizar com o banco, faremos isso ao carregarmos todos os arquivos de modelos do nosso banco.
 * Ao final nós teremos cada modelo como uma propriedades desta classe, por exemplo, quando 
 * carregarmos o modelo de nome Slide, ele poderá ser acesso a qualquer momento utilizando this.Slide ou
 * this[Slide].
 *
 * @Parametro {Objeto} [opcoes] Contem todas as opções para a configuração deste serviço de armazenamento.
 --------------------------------------------------------------------------------------------------------------*/
var Armazenamento = function (opcoes) {
  
  EmissorEvento.call(this);

  if (!opcoes) {
    throw new Error('Opções da database não foram informadas.');
  }
  
  /* @Propriedade {Objeto} [opcoes] As opções de configuração do armazenamento. */
  this.opc = opcoes;
};

util.inherits(Armazenamento, EmissorEvento);

/* @Método carregarModelos().
 *
 * Carrega todos modelos da pasta modelos e cada um deles é adicionado a este objeto.
 * Por exemplo, o modelo Slide será armazenado em this.Slide ou this[Slide].
 * Sendo assim a gente pode acessar daqui os diversos modelos.
 */
Armazenamento.prototype.carregarModelos = function () {
  modelos(this.sequelize, this);
};

/* @Método iniciar(). 
 *
 * Inicia o nosso banco de dados e sincroniza as tabelas se elas não estiverem lá.
 *
 * @Parametro {Objeto} [opcsSincroniza] Contem as opções de configuração em um objeto chave valor.
 * @Parametro {Texto} [opcsSincroniza.dialect] Dialeto utilizado, pode ser MySQL, SQlite e Postgres.
 * @Parametro {Texto} [opcsSincroniza.user] Nome do usuário do banco de dados, não é necessário para o SQlite.
 * @Parametro {Texto} [opcsSincroniza.password] Senha do usuário do banco de dados, não é necessário para o SQlite.
 * @Parametro {Texto} [opcsSincroniza.database] Nome do nosso banco de dados.
 * @Parametro {Número} [opcsSincroniza.maxConcurrentQueries] Valor máximo de consultas concorrentes.
 * @Parametro {Número} [opcsSincroniza.maxConnections] Valor máximo de conexões.
 * @Parametro {Número} [opcsSincroniza.maxIdleTime] Tempo máximo inativo.
 * @Parametro {Texto} [opcsSincroniza.host] Endereço ao qual utilizaremos para a conexão com o banco de dados.
 * @Parametro {Número} [opcsSincroniza.port] A porta ao qual utilizaremos para a conexão com o banco de dados.
 * @Retorna {Promessa} Uma promessa de recusa em caso de erro, ou de deliberação se tudo correr bem.
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