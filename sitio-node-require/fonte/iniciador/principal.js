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

/* Realiza o inicio dos nossos serviços principais.
 * 
 * @Parametro {configuracao} Objeto contendo as informações de configuração.
 * @Parametro {aplicativo} O objeto do aplicativo do servidor Express.
 * @Parametro {pronto} A função que será chamada ao realizarmos todas as nossas funções.
 */
exports.prosseguir = function(configuracao, aplicativo, pronto) {
  var esteObjeto = {};
  
  esteObjeto.armazenamento = new Armazenamento(configuracao);
  esteObjeto.srvcRest = new ServicoRest();
  
  registrador.debug('Carregando os módulos da base do nosso servidor.');
  
  esteObjeto.armazenamento.carregar(configuracao)
  .then(function (arm) {
    // Foi carregado os módulos de armazenamento
    esteObjeto.armazenamento = arm;  
  })
  .then(function () {
    // Para cada modelo de tabela nós carregamos as rotas RESTFUL.
    return esteObjeto.srvcRest.carregar(aplicativo, esteObjeto.armazenamento);
  })
  .then(function () {
    // parece que tudo ocorreu bem
    pronto();
  })
  .catch(function (err) {
    registrador.error(err);
  });

}