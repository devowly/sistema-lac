'use strict'

/* @arquivo preencherBanco.js 
 *
 * Arquivo que contem as caracteristicas de preenchimento do nosso banco de dados.
 */

/* Versão 0.0.1-Beta
 * - Adicionar forma de carregar todos os dados a partir deste arquivo. (issue #5) [FEITO]
 */
 
var Sequelize = require('sequelize');
var sequelize_fixtures = require('sequelize-fixtures');
var pasta = require('path');
var configuracao = require('../../configuracao/configuracao');
var dados = require('./dadosjson/indice');
var modelos = require('../../fonte/armazenamento/modelos/indice');
var Promessa = require('bluebird');
var registrador = require('../../fonte/nucleo/registrador')('preencherBanco');

/* Provê metodos e função de iniciar a conexão com o banco de dados, carregar os modelos do banco,
 * e preencher o banco com os registros.
 */
var Preencher = function() {
  this.bd = null;
  this.listaModelos = {};
}

/* Realiza o carregamento daqueles modelos do Sequelize, armazenando-os em listaModelos.
 * Estes modelos serão depois utilizados para fazer o preenchimento do banco de dados.
 */
Preencher.prototype.carregarModelos = function () {
  
  registrador.debug('Carregando os modelos do banco de dados.');
  
  // Carrega todos modelos da pasta modelos e cada um deles é adicionado a listaModelos.
  modelos(this.bd, this.listaModelos);
} 
 
/* Realiza o carregamento dos dados ao carregar os arquivos json da pasta dadosjson.
 */
Preencher.prototype.carregarDados = function () { 

  registrador.debug('Carregando dados de preenchimento do banco de dados.');
 
  // Carregamos aqueles arquivos json que contem os registros que serão armazenados no Banco de Dados
  dados(sequelize_fixtures, this.listaModelos);
} 

/* Realiza a conexão com o banco de dados. e depois o sincroniza. Quando for sincronizado, 
 * ele criará as tabelas se ainda não estiverem criadas. Depois de sincronizado a gente retorna
 * para carregar os registros que serão adicionados às tabelas.
 *
 * @Retorna {Promessa} Uma promessa de deliberação ou de recusa.
 */
Preencher.prototype.iniciar = function () { 
  var esteObj = this;
  
  registrador.debug('Iniciando');
  
  return new Promessa(function (deliberar, recusar) {
    
    // Realiza uma conexão com o banco de dados.
    var sequelize = new Sequelize( 
      configuracao.storage.database, 
      configuracao.storage.user, 
      configuracao.storage.password
    );

    // Armazena banco de dados.
    esteObj.bd = sequelize;
    
    // Carregamos todos os nossos modelos.
    esteObj.carregarModelos();
    
    // Sincroniza os modelos com o banco de dados.
    sequelize.sync().then(function() {
      registrador.debug('Banco de dados sincronizado.');
      deliberar(esteObj);
    }).catch(function(erro){
      registrador.error(erro);
      recusar(erro);
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