'use strict';

/* @Arquivo Autenticacao.js
 *
 * Realiza o carregamento dos método de autenticação com base naquilo que foi configurado.
 */

var registrador = require('./Registrador')('Autenticacao'); 
var baseBiblioteca = require('../indice'); // Acessamos os arquivos base do nosso servidor.
var Promessa = require('bluebird');

function Autenticacao() {}

/* Nossa autenticação anonymous requer apenas um nome de usuário.
 *
 * @Parametro {configuracao} A nossa configuração para esta autenticação.
 * @Retorna Objeto contendo os métodos necessários deste tipo de autenticação.
 */
Autenticacao.prototype.anonymous = function (configuracao) {
  
  var autentAnon = new baseBiblioteca.Autenticacao.Anonimo();
  
  return autentAnon;
};

/* Nossa autenticação Oauth2 requer um nome de usuário e um token.
 * No momento nós ainda não implementamos o armazenamento no banco de dados.
 * Deve ser fornecido para este método um endereço de um servidor Oauth2.
 *
 * @Parametro {configuracao} A nossa configuração para esta autenticação.
 * @Retorna Objeto contendo os métodos necessários deste tipo de autenticação.
 */
Autenticacao.prototype.oauth2 = function (configuracao) {

  var autentOauth2 = null;
  if (configuracao.server) {
      autentOauth2 = new baseBiblioteca.Autenticacao.OAuth2({
      'url': configuracao.server // Nosso servidor Oauth2.
    });
  }
  return autentOauth2;
};

/* Nossa autenticação simples requer um nome de usuário e a sua senha.
 * No momento nós ainda não implementamos o armazenamento no banco de dados.
 *
 * @Parametro {configuracao} A nossa configuração para esta autenticação.
 * @Retorna Objeto contendo os métodos necessários deste tipo de autenticação.
 */
Autenticacao.prototype.simple = function (configuracao) {

  var autentSimples = new baseBiblioteca.Autenticacao.Simples();

  /* Registra usuários configurados. 
   * Lembre-se que isso deve ser utilizado apenas em modo de produção.
   */
  if (configuracao.users) {
    configuracao.users.forEach(function (usuario) {
      autentSimples.adcUsuario(usuario.user, usuario.password);
    });
  }

  /* Registra os usuário de teste.
   * Devemos utilizar isso apenas no modo de produção.
   */
  if (configuracao.testusers) {
    // Aqui vamos registrar cerca de 10mil usuários para testar
    var baseUsuario = 'carregar'; 
    var baseSenha = 'senha';  // Senha base
    var quantidade = 10000;  //Quantidade de usuários 

    for (var i = 1; i <= quantidade; i++) {
      autentSimples.adcUsuario(baseUsuario + i, baseSenha + i);
    }
  }

  return autentSimples;
};

/* Percorremos as diversas autenticações disponiveis no arquivo de configuração e as carregamos.
 * Os tipos de autenticação disponiveis até o momento são: simple, oauth2 e anonymous.
 *
 * @Parametro {rotaConexao} Objeto que lida com as rotas de conexões.
 * @Parametro {configuração} A configuração por onde iremos pegar os tipos.
 * @Retorna {Promessa} Promessa de deliberação ou recusa.
 */
Autenticacao.prototype.carregar = function (rotaConexao, configuracao) {
  var esteObj = this;
  return new Promessa(function (deliberar, recusar) {
    registrador.debug('Autenticacao');
    var autenticacao = configuracao.auth;

    if (autenticacao && autenticacao.length > 0) {
      // Para cada um dos tipos de autenticação nós iremos carregar.
      autenticacao.forEach(function (modulo) {
        registrador.debug('Carrega módulo de autenticação ' + modulo.type);
        var m = esteObj[modulo.type](modulo);

        // Adiciona mecanismo de autenticação a rota conexão.
        rotaConexao.adcMetodoAutenticacao(m);
      });
      deliberar();
    } else {
      recusar();
    }
  });
};

module.exports = Autenticacao;