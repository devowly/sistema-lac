'use strict'

/* @arquivo preencherBanco.js 
 *
 * @descrição Carrega os dados  para o banco de dados.
 **/

/* Versão 0.0.1-Beta
 * - Adicionar forma de carregar todos os arquivos a partir deste arquivo. (issue #5) [FEITO]
 */
 
var Sequelize = require('sequelize');
var sequelize_fixtures = require('sequelize-fixtures');
var pasta = require('path');
var configuracao = require('../configuracao/configuracao');
var dados = require('./dadosjson/indice');
var modelos = require('../fonte/armazenamento/modelos/indice');
var Promessa = require('bluebird');
var registrador = require('../fonte/nucleo/registrador')('preencherbanco');

/* CLASSE PREENCHER */
var Preencher = function() {
  this.bd = null;
  this.listaModelos = {};

}
 
Preencher.prototype.carregarModelos = function () {
  registrador.debug('Carregando os modelos do banco de dados.');
  
  // Carrega todos modelos da pasta modelos e cada um deles é adicionado a listaModelos.
  modelos(this.bd, this.listaModelos);
 
} 
 
Preencher.prototype.carregarDados = function () { 

  // Carregamos aqueles arquivos json que contem os registros que serão armazenados no Banco de Dados
  registrador.debug('Carregando dados de preenchimento do banco de dados.');
  dados(sequelize_fixtures, this.listaModelos);
} 
 
Preencher.prototype.iniciar = function () { 
  var esteObj = this;
  
  registrador.debug('Iniciando');
  
  return new Promessa(function (deliberar, recusar) {
    // Inicia conexão com o banco de dados.
    var sequelize = new Sequelize( configuracao.storage.database, configuracao.storage.user,configuracao.storage.password);

    // Armazena banco de dados.
    esteObj.bd = sequelize;
    
    // Carregamos todos os nossos modelos.
    esteObj.carregarModelos();
    
    // Sincroniza os modelos com o banco de dados.
    sequelize.sync()
    .complete(function (err) {
      if (err) {
        registrador.error(err);
        recusar(err);
      } else {
        registrador.debug('Banco de dados sincronizado.');
        deliberar(esteObj);
      }
    });
  });
}

var preencher = new Preencher();

preencher.iniciar().then(function(esteObj) {
  // Carregamos os dados após o banco de dados estiver criado e sincronizado.
  preencher.carregarDados();
}).catch(function (err) {
  registrador.error(err);
});