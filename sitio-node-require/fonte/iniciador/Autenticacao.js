'use strict';

/* @arquivo Autenticacao.js 
 *
 * Realiza o inicio e carregamento do serviço de autenticacao JWT (Json Web Token).  
 */

var baseSitio = require('../indice');
var Autenticacao = baseSitio.Autenticacao;

function CarregaServicoAutenticacao() {}

/* Realiza o inicio do nosso modulo de serviço de autenticação.
 *
 * @Parametro {aplicativo} O aplicativo Express.
 * @Parametro {bancoDados} Objeto contendo o banco de dados Sequelize.
 * @Parametro {jwt} Serviço Json Web Token.
 * @Retorna {Promessa} Uma promessa que pode ser de recusa ou deliberação.
 */
CarregaServicoAutenticacao.prototype.carregar = function (aplicativo, bancoDados, jwt) {

  // Inicia o módulo de serviço de Autenticacao.
  var srvcAut = new Autenticacao(aplicativo, bancoDados, jwt);

  // Inicia o serviço de autenticacao e retorna promessa
  return srvcAut.iniciar();

};

module.exports = CarregaServicoAutenticacao;