'use strict';

var baseBiblioteca = require('../indice');
var Armazenamento = baseBiblioteca.Armazenamento;
var registrador = require('../nucleo/registrador')('armazenamento'); 

function CarregaArmazenamento() {}

CarregaArmazenamento.prototype.carregar = function (configuracao) {

  // Carrega configurações
  var configArmazenamento = configuracao.storage;

  // Inicia o módulo de armazenamento
  var arm = new Armazenamento(configArmazenamento);

  // Inicia sequelize e retorna promessa
  return arm.iniciar();

};

module.exports = CarregaArmazenamento;