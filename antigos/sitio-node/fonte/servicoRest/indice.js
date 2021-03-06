'use strict';

/* @arquivo indice.js 
 *
 * @descrição Carrega serviço REST
 **/

/* Versão 0.0.1-Beta
 * - Adicionar requisição de autenticação para acesso aos dados do serviço REST. (issue #4) 
 */

var util = require('util');
var EmissorEvento = require('events').EventEmitter;
var Promessa = require('bluebird');
var modelos = require('./modelos/indice');
var registrador = require('../nucleo/registrador')('servicorest');
var epilogue = require('epilogue');

/**
 * CLASSE SERVICOREST
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

/* Iniciamos o serviço REST para cada modelo do banco de dados.
 */
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
        model: esteObjeto.bd[mod.nome],   // Nosso modelo do banco de dados 
        endpoints: mod.rotas,             // Nossas rotas REST
        associations: mod.associations,   // Relações 
        search: {
          param: 'q'                      // Realizaremos a pesquisa utilizando o padrao modelo?q=valor
        }
      });
    } else {
      registrador.debug('Não encontramos o modelo (' + mod.nome + ') do banco de dados.');
    }
  });
   
};

/**
 * Inicia o epilogue e carrega o serviço REST para cada modelo de tabela do sequelize
 */
ServicoRest.prototype.iniciar = function () {

  registrador.debug('Iniciando serviço REST.');

  var esteObjeto = this;

  return new Promessa(function (deliberar, recusar) {

    // Inicia o epilogue
    epilogue.initialize({
      app: esteObjeto.aplic,
      sequelize: esteObjeto.bd.sequelize
    });
    
    // Carrega os arquivos que contem os nossos modelos.
    esteObjeto.carregarModelos();

    // Se tudo ocorreu bem.
    deliberar(esteObjeto);
    
  });
};

module.exports = ServicoRest;