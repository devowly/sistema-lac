'use strict';

/* @arquivo Armazenamento.js
 * 
 * Realiza o inicio e carregamento dos nossos modelos de banco de dados.     
 */

var baseSitio = require('../indice');
var Armazenamento = baseSitio.Armazenamento;
var registrador = require('../nucleo/registrador')('Armazenamento'); 

/* @Classe CarregaArmazenamento().
 ----------------------------------------*/
function CarregaArmazenamento() {}

/* @Método carregar().
 *
 * Realiza o incio do nosso modulo de armazenamento.
 *
 * @Parametro {Objeto} [configuracao] Contêm as informações de configuração.
 * @Retorna {Promessa} Uma promessa de recusa ou de deliberação.
 */
CarregaArmazenamento.prototype.carregar = function (configuracao) {

  /* @Propriedade {Objeto} [configArmazenamento] As nossas configurações. */
  var configArmazenamento = configuracao.storage;

  /* @Propriedade {Objeto} [arm] O módulo de armazenamento. */
  var arm = new Armazenamento(configArmazenamento);

  // Inicia sequelize e retorna promessa
  return arm.iniciar();

};

module.exports = CarregaArmazenamento;