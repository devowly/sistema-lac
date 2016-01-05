'use strict'

/* @arquivo principal.js
 *
 * Nossa função base do nosso serviço. Aqui iremos carregar
 * tudo que é necessário para o site.      
 */

var baseSitio = require('../indice');  // Requisitamos os arquivos base da nossa biblioteca.

// Carrega todos os outros arquivos necessários
var registrador = require('../nucleo/registrador')('principal'); // O nosso registrador
var Armazenamento = require('./Armazenamento');                  // Modulo de armazenamento.
var ServicoRest = require('./ServicoRest');                      // O nosso serviço REST para cada um dos modelos de armazenamento.
var Autenticacao = require('./Autenticacao');                    // Nosso serviço de autenticacao Json Web Token.

/* Realiza o inicio dos nossos serviços principais.
 * 
 * @Parametro {Objeto} [configuracao] Contêm as informações de configuração.
 * @Parametro {Objeto} [aplicativo] O nosso aplicativo do servidor Express.
 * @Parametro {Objeto} [jwt] Contêm propriedades e métodos para lidarmos com os tokens.
 * @Parametro {Função} [pronto] Será chamada ao realizarmos todas as nossas funções.
 */
exports.prosseguir = function(configuracao, aplicativo, jwt, pronto) {
  var esteObjeto = {};
  
  esteObjeto.armazenamento = new Armazenamento(configuracao);
  esteObjeto.srvcRest = new ServicoRest();
  esteObjeto.autenticacao = new Autenticacao();
  
  registrador.debug('Carregando os módulos da base do nosso servidor.');
  
  esteObjeto.armazenamento.carregar(configuracao)
  .then(function (arm) {
    // Foi carregado os módulos de armazenamento
    esteObjeto.armazenamento = arm;  
  })
  .then(function () {
    // Para cada modelo de tabela nós carregamos as rotas RESTFUL.
    return esteObjeto.srvcRest.carregar(aplicativo, esteObjeto.armazenamento, jwt, configuracao.authentication);
  })
  .then(function(){
    // Carregamos nosso serviço de autenticacao JWT.
    return esteObjeto.autenticacao.carregar(aplicativo, esteObjeto.armazenamento, jwt, configuracao.authentication);
  })
  .then(function () {
    // parece que tudo ocorreu bem
    pronto();
  })
  .catch(function (err) {
    registrador.error(err);
  });

}