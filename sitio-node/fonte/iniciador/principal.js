'use strict'

/* @arquivo principal.js
 * 
 * @descrição Aqui iremos carregar tudo que é necessário para o site.
 */

// Acessamos os arquivos base da nossa biblioteca.
var baseBiblioteca = require('../indice');

// Carrega todos os outros arquivos necessários
var registrador = require('../nucleo/registrador')('principal'); 
var Armazenamento = require('./Armazenamento');

exports.prosseguir = function(configuracao, pronto) {
  var esteObjeto = {};
  
  esteObjeto.armazenamento = new Armazenamento(configuracao);

  registrador.debug('Carrega os elementos base do nosso sitio');
  
  esteObjeto.armazenamento.carregar(configuracao)
  .then(function (arm) {
    // Carrega os módulos de armazenamento
    esteObjeto.armazenamento = arm;  
  })
  .then(function () {
    // parece que tudo ocorreu bem
    pronto();
  })
  .catch(function (err) {
    registrador.error(err);
  });

}