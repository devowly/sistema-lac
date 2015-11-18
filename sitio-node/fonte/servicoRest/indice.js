'use strict';

var util = require('util');
var EmissorEvento = require('events').EventEmitter;
var Promessa = require('bluebird');
var modelos = require('./modelos/indice');
var registrador = require('../nucleo/registrador')('servicorest');
var epilogue = require('epilogue');

/**
 * Abstração da gerencia das rotas do serviço REST.
 */
var ServicoRest = function (aplicativo, bancoDados) {
  
  EmissorEvento.call(this);

  // Armazena banco de dados sequelize
  this.bd = bancoDados; 
  
  // Armazena aplicativo express
  this.aplic = aplicativo;
};

util.inherits(ServicoRest, EmissorEvento);

ServicoRest.prototype.carregarModelos = function () {
  
  var mods = modelos(this);
  var esteObjeto = this;
  
   // No momento em que o modelo é definido, vamos carregar as associações
  mods.forEach(function (mod) {
    if (esteObjeto.bd.hasOwnProperty(mod.nome)) {
      
      /* Abaixo Criamos a fonte do serviço RESTFUL:
       * GET (Pega dados)
       * POST (Envio de dados)
       * PUT (Atualização de dados)
       * DELETE (Apaga uma entrada)
      --------------------------------------*/
      
      esteObjeto[mod.nome] = epilogue.resource({
        model: esteObjeto.bd[mod.nome],
        endpoints: mod.rotas
      });
    } else {
      registrador.debug('Não encontramos o modelo (' + mod.nome + ') do banco de dados.');
    }
  });
   
};

/**
 * Inicia o banco de dados e sincroniza as tabelas se elas não estiverem lá
 */
ServicoRest.prototype.iniciar = function () {

  registrador.debug('Iniciando serviço REST.');

  var esteObjeto = this;

  return new Promessa(function (deliberar, recusar) {

    // Inicia o epilogue
    epilogue.initialize({
      app: esteObjeto.aplic,
      sequelize: esteObjeto.bd
    });
  
    // Carrega os arquivos que contem os nossos modelos.
    esteObjeto.carregarModelos();

    // Se tudo ocorreu bem.
    deliberar(esteObjeto);
    
  });
};

module.exports = ServicoRest;