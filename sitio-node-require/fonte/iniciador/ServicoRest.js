'use strict';

/* @arquivo ServicoRest.js 
 *
 * Realiza o inicio e carregamento dos serviços REST.  
 */

var baseSitio = require('../indice');
var ServicoRest = baseSitio.ServicoRest;

function CarregaServicoRest() {}

/* Realiza o inicio do nosso modulo de serviço REST.
 *
 * @Parametro {aplicativo} O aplicativo Express.
 * @Parametro {bancoDados} Objeto contendo o banco de dados Sequelize.
 * @Parametro {jwt} Serviço Json Web Token.
 * @Retorna {Promessa} Uma promessa que pode ser de recusa ou deliberação.
 */
CarregaServicoRest.prototype.carregar = function (aplicativo, bancoDados, jwt) {

  // Inicia o módulo de serviço REST
  var srvcRest = new ServicoRest(aplicativo, bancoDados, jwt);

  // Inicia o serviço REST e retorna promessa
  return srvcRest.iniciar();

};

module.exports = CarregaServicoRest;