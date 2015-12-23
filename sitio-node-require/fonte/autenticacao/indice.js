'use strict';

/* @arquivo indice.js 
 *
 * @descrição Realizará uma parte da autenticação e também autorização do nosso serviço
 *            Utilizando Json Web Token.
 */

/* Versão 0.0.1-Beta */

var util = require('util');
var EmissorEvento = require('events').EventEmitter;
var Promessa = require('bluebird');
var registrador = require('../nucleo/registrador')('Autenticacao');

/* Abstração da gerencia das autenticações e autorizações. 
 *
 * @Parametro {aplicativo} O nosso servidor Express.
 * @Parametro {bancoDados} Objeto do nosso banco de dados.
 * @Parametro {jwt} Módulo para tratar as requisições em Json Web Token.
 */
var Autenticacao = function (aplicativo, bancoDados, jwt) {
  
  EmissorEvento.call(this);

  // Armazena a classe do banco de dados sequelize.
  this.bd = bancoDados; 
  
  // Armazena aplicativo express
  this.aplic = aplicativo;
  
  // Utilizaremos os tokens para autenticação.
  this.jsonWebToken = jwt;
};

util.inherits(Autenticacao, EmissorEvento);

/* Realizamos aqui o inicio do nosso serviço de autenticação e autorização.
 *
 * @Retorna {Promessa} Promessa de recusa ou de deliberação. 
 */
Autenticacao.prototype.iniciar = function () {

  registrador.debug('Iniciando serviço de Autenticacao e Autorização.');

  var esteObjeto = this;

  return new Promessa(function (deliberar, recusar) {

    // Inicia o serviço REST Epilogue.
    epilogue.initialize({
      app: esteObjeto.aplic,               // Aplicativo Express.
      sequelize: esteObjeto.bd.sequelize   // Nosso banco de dados Sequelize.
    });
    
    // Iniciamos aqui os utilitários.
    utilitarios.inicializar(esteObjeto.bd, esteObjeto.jsonWebToken);
    
    // Carrega os arquivos que contem os nossos modelos.
    esteObjeto.carregarServicoRest();

    // Se tudo ocorreu bem.
    deliberar(esteObjeto);
    
  });
};

module.exports = Autenticacao;