'use strict';

/* @arquivo Armazenamento.js
 * 
 * Realiza o inicio e carregamento dos nossos modelos de banco de dados.     
 */

var baseSitio = require('../indice');
var Armazenamento = baseSitio.Armazenamento;
var registrador = require('../nucleo/registrador')('Armazenamento'); 

function CarregaArmazenamento() {}

/* Realiza o incio do nosso modulo de armazenamento.
 *
 * @Parametro {configuracao} Objeto contendo as informações de configuração.
 * @Retorna {Promessa} Uma promessa de recusa ou de deliberação.
 */
CarregaArmazenamento.prototype.carregar = function (configuracao) {

  // Recebe as nossas configurações
  var configArmazenamento = configuracao.storage;

  // Inicia o módulo de armazenamento
  var arm = new Armazenamento(configArmazenamento);

  // Inicia sequelize e retorna promessa
  return arm.iniciar();

};

module.exports = CarregaArmazenamento;