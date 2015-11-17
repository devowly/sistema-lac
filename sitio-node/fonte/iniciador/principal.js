'use strict'

/* @arquivo principal.js
 * 
 * @descrição Aqui iremos carregar tudo que é necessário para o site.
 */

// Acessamos os arquivos base da nossa biblioteca.
var baseSitio = require('../indice');

// Carrega todos os outros arquivos necessários
var registrador = require('../nucleo/registrador')('principal'); 
var Armazenamento = require('./Armazenamento');
var Rota = require('./Rota');

exports.prosseguir = function(configuracao, aplicativo, pronto) {
  var esteObjeto = {};
  
  esteObjeto.armazenamento = new Armazenamento(configuracao);
  esteObjeto.rota = new Rota();
  
  registrador.debug('Carrega os elementos base do nosso sitio');
  
  esteObjeto.armazenamento.carregar(configuracao)
  .then(function (arm) {
    // Carrega os módulos de armazenamento
    esteObjeto.armazenamento = arm;  
  })
  .then(function () {
    // Para cada modelo de tabela nós carregamos as rotas RESTFUL.
    return esteObjeto.rota.carregar(aplicativo, esteObjeto.armazenamento);
  })
  .then(function () {
    // parece que tudo ocorreu bem
    pronto();
  })
  .catch(function (err) {
    registrador.error(err);
  });

}