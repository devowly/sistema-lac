'use strict';

var baseSitio = require('../indice');
var ServicoRest = baseSitio.ServicoRest;

function CarregaServicoRest() {}

CarregaServicoRest.prototype.carregar = function (aplicativo, bancoDados) {

  // Inicia o módulo de serviço REST
  var srvcRest = new ServicoRest(aplicativo, bancoDados);

  // Inicia o serviço REST e retorna promessa
  return srvcRest.iniciar();

};

module.exports = CarregaServicoRest;