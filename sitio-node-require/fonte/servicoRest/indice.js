'use strict';

/* @arquivo indice.js 
 *
 * @descrição Realiza o carregamento do nosso serviço REST.
 **/

/* Versão 0.0.1-Beta
 * - Adicionar requisição de autenticação para acesso aos dados do serviço REST. (issue #4) [AFAZER]
 */

var util = require('util');
var EmissorEvento = require('events').EventEmitter;
var Promessa = require('bluebird');
var modelos = require('./modelos/indice');
var registrador = require('../nucleo/registrador')('ServicoRest');
var epilogue = require('epilogue');

/* Abstração da gerencia das rotas do serviço REST. 
 * Realiza o carregamento das rotas REST do nosso servidor.
 *
 * @Parametro {aplicativo} O nosso servidor Express.
 * @Parametro {bancoDados} Objeto do nosso banco de dados.
 */
var ServicoRest = function (aplicativo, bancoDados) {
  
  EmissorEvento.call(this);

  // Armazena a classe do banco de dados sequelize.
  this.bd = bancoDados; 
  
  // Armazena aplicativo express
  this.aplic = aplicativo;
};

util.inherits(ServicoRest, EmissorEvento);

/* Realiza o inicio do serviço REST para cada modelo do banco de dados.
 */
ServicoRest.prototype.carregarServicoRest = function () {
  
  var mods = modelos(this);    // Nossos modelos do banco de dados.
  var esteObjeto = this;
  
  // No momento em que o modelo é definido, vamos carregar o nosso serviço REST para ele.
  mods.forEach(function (mod) {
    
    if (esteObjeto.bd.hasOwnProperty(mod.nome)) {
      
      /* Abaixo Criamos a fonte do serviço RESTFUL para implementação de operações CRUD.
       * Ele possuirá as funções de:
       * POST (Envio de dados) (Create)
       * GET (Pega dados) (Read)
       * PUT (Atualização de dados) (Update)
       * DELETE (Apaga uma entrada) (Delete)
      --------------------------------------*/
      esteObjeto[mod.nome] = epilogue.resource({
        model: esteObjeto.bd[mod.nome],                         // Nosso modelo do banco de dados. 
        endpoints: mod.rotas,                                   // Nossas rotas REST. Estas rotas irão fornecer os resultados,
                                                                // Cada uma das rotas poderá apresentar um ou mais registros.
        associations: mod.sePossuirAssociacoes ? true : false,  // Relações entre os modelos.
        search: {
          param: mod.parametroPesquisa || 'q'                   // Realizaremos a pesquisa utilizando o padrao rota?q=valor
                                                                // Assim realiza a pesquisa de qualquer coluna de texto que possui o valor procurado.
        },
        order: {
          param: mod.parametroOrdenamento || 'order'            // Definimos aqui o parametro responsável pela ordenação (Ascendente e descendente).
                                                                // Ex. order=ASC
        },
        resource: {
          pagination: mod.seRealizarPaginacao ? true : false    // Modo de paginação. É importante para retornar o valor total
                                                                // de registros para o Backbone.Paginator por meio de variavel no header.
        }
      });
    } else {
      registrador.debug('Não encontramos o modelo (' + mod.nome + ') do banco de dados.');
    }
  });
   
};

/* Realiza o inicio do serviço REST Epilogue e logo em seguida carrega o serviço REST
 * para cada um dos modelos do banco de dados. 
 *
 * @Retorna {Promessa} Promessa de recusa ou de deliberação. 
 */
ServicoRest.prototype.iniciar = function () {

  registrador.debug('Iniciando serviço REST.');

  var esteObjeto = this;

  return new Promessa(function (deliberar, recusar) {

    // Inicia o serviço REST Epilogue.
    epilogue.initialize({
      app: esteObjeto.aplic,               // Aplicativo Express.
      sequelize: esteObjeto.bd.sequelize   // Nosso banco de dados Sequelize.
    });
    
    // Carrega os arquivos que contem os nossos modelos.
    esteObjeto.carregarServicoRest();

    // Se tudo ocorreu bem.
    deliberar(esteObjeto);
    
  });
};

module.exports = ServicoRest;