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
CarregaServicoAutenticacao.prototype.carregar = function (aplicativo, bancoDados, jwt, autenticacao) {

  // Inicia o módulo de serviço de Autenticacao.
  var srvcAut = new Autenticacao(aplicativo, bancoDados, jwt, autenticacao);

  // Inicia o serviço de autenticacao e retorna promessa
  return srvcAut.iniciar();

};

module.exports = CarregaServicoAutenticacao;