'use strict';

/* @arquivo ServicoRest.js 
 *
 * Realiza o inicio e carregamento dos serviços REST.  
 */

var baseSitio = require('../indice');
var ServicoRest = baseSitio.ServicoRest;

/* @Classe CarregaServicoRest().
 ----------------------------------*/
function CarregaServicoRest() {}

/* @Método carregar().
 *
 * Realiza o inicio do nosso modulo de serviço REST.
 *
 * @Parametro {Objeto} [aplicativo] O nosso aplicativo Express.
 * @Parametro {Objeto} [bancoDados] Contêm o banco de dados Sequelize.
 * @Parametro {Objeto} [jwt] Contêm métodos e propriedades para o serviço Json Web Token.
 * @Parametro {Método} [jwt.verify] Utilizado para verificarmos o token.
 * @Parametro {Objeto} [autenticacao] Contêm as diretivas de configuração para a autenticação.
 * @Parametro {Texto} [autenticacao.verifyModel] Contêm o nome do modelo onde iremos buscar verificar os dados do usuário.
 * @Parametro {Texto} [autenticacao.accessModel] Contêm o nome do modelo onde iremos buscar verificar as bandeiras de acesso do usuário.
 * @Parametro {Texto} [autenticacao.superSecret] Contêm o valor da chave super secreta para codificar e decodificar os tokens.
 * @Parametro {Boleano} [autenticacao.useSessionWithCookies] Contêm o valor que informa se vamos utilizar cookies com sessão.
 * @Retorna {Promessa} Uma promessa que pode ser de recusa ou deliberação.
 */
CarregaServicoRest.prototype.carregar = function (aplicativo, bancoDados, jwt, autenticacao) {

  /* @Propriedade {Objeto} [srvcRest] O módulo do serviço REST. */
  var srvcRest = new ServicoRest(aplicativo, bancoDados, jwt, autenticacao);

  // Inicia o serviço REST e retorna promessa
  return srvcRest.iniciar();

};

module.exports = CarregaServicoRest;