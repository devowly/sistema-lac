'use strict';

var baseSitio = require('../indice');
var Rota = baseSitio.Rota;

function CarregaRota() {}

CarregaRota.prototype.carregar = function (aplicativo, bancoDados) {

  // Inicia o módulo de rotas
  var rota = new Rota(aplicativo, bancoDados);

  // Inicia as rotas e retorna promessa
  return rota.iniciar();

};

module.exports = CarregaRota;