'use strict';

/* @arquivo indice.js 
 *
 * @descrição Realiza o carregamento do nosso serviço REST.
 */

/* Versão 0.0.1-Beta
 * - Adicionar requisição de autenticação para acesso aos dados do serviço REST. (issue #4) [FEITO]
 */

var util = require('util');
var EmissorEvento = require('events').EventEmitter;
var Promessa = require('bluebird');
var modelos = require('./modelos/indice');
var registrador = require('../nucleo/registrador')('ServicoRest');
var epilogue = require('epilogue');
var utilitarios = require('./utilitarios');

/* Abstração da gerencia das rotas do serviço REST. 
 * Realiza o carregamento das rotas REST do nosso servidor.
 *
 * @Parametro {aplicativo} O nosso servidor Express.
 * @Parametro {bancoDados} Objeto do nosso banco de dados.
 * @Parametro {jwt} Nosso módulo Json Web Token.
 * @Parametro {autenticacao} Configuração de autenticação.
 */
var ServicoRest = function (aplicativo, bancoDados, jwt, autenticacao) {
  
  EmissorEvento.call(this);

  // Armazena a classe do banco de dados sequelize.
  this.bd = bancoDados; 
  
  // Armazena aplicativo express
  this.aplic = aplicativo;
  
  // Utilizaremos os tokens para autenticação.
  this.jsonWebToken = jwt;
  
  // Configuração da autenticação.
  this.autentic = autenticacao;
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
      
      /* Abaixo nós criamos a fonte do serviço RESTFUL, utilizando o Epilogue, para implementação de operações CRUD.
       * 
       * Um serviço CRUD é um acrônimo de Create, Read, Update e Delete. Ou seja, ele fornecerá os 
       * serviços de Criar, Ler, Atualizar e Deletar as entradas do nosso banco de dados.
       * 
       * Imagine que para um modelo chamado 'usuarios', teremos alguns controladores listados abaixo:
       * - usuarios.create
       * - usuarios.list
       * - usuarios.read
       * - usuarios.update
       * - usuarios.delete
       *
       * Os controladores listados acima serão chamados sempre que houver uma requisição http em algum dos nossos endpoints.
       * Os endpoints são as rotas associadas a um determinado modelo. Por exemplo, imagine o modelo 'usuarios', ele
       * terá os seguintes endpoints:
       * 
       * POST /usuarios                  (Cria um registro de usuário) (Create)
       * GET /usuarios                   (Pega uma lista de registros de usuarios) (Read)
       * GET /usuarios/:identificador    (Pega um unico registro de usuarios passando um identificador) (Read)
       * PUT /usuarios/:identificador    (Atualização de um registro de usuários) (Update)
       * DELETE /usuarios/:identificador (Apaga um registro dos usuários) (Delete)
       *
       * O nosso modelo ficticio 'usuarios' possue os controladores já listados acima, e para cada um destes controladores, 
       * o modelo possue também alguns hooks. Os hooks podem ser utilizados para acrescentar ou substituir o comportamento
       * para cada requisição nos endpoints. Abaixo listamos os hooks disponíveis:
       * 
       * - start
       * - auth
       * - fetch
       * - data
       * - write
       * - send
       * - complete
       * 
       * Nós podemos utilizar os hooks acima para uma diversidade de coisas, no exemplo abaixo apresentamos uma forma de 
       * proibir qualquer tentativa de apagar um registro no modelo 'usuarios'
       *
       * // Não permitir remoção do registro do usuario
       * usuarios.delete.auth(function(req, res, context) {
       *   // Pode ser por meio de um throw
       *   // throw new ForbiddenError("Não é possível deletar este usuário");
       *   // Ou pode ser retornando um erro:
       *   // return context.error(403, "Não é possível deletar este usuário");
       * })
       *
       * @Veja https://github.com/dchester/epilogue
      --------------------------------------------------------------------------------------------------------------------------------*/
      esteObjeto[mod.nome] = epilogue.resource({
        model: esteObjeto.bd[mod.nome],                         // Nosso modelo do banco de dados. 
        endpoints: mod.rotas,                                   // Nossas rotas REST. Estas rotas irão fornecer os resultados,
                                                                // Cada uma das rotas poderá apresentar um ou mais registros.
        associations: mod.sePossuirAssociacoes ? true : false,  // Relações entre os modelos, podendo ser: BelongsTo, HasOne, HasMany e BelongsToMany. 
        search: {
          param: mod.parametroPesquisa || 'q'                   // Realizaremos a pesquisa utilizando o padrao 'endpoint?q=valor'
                                                                // Assim realiza a pesquisa de qualquer coluna de texto que possui o valor informado.
        },
        order: {
          param: mod.parametroOrdenamento || 'order'            // Definimos aqui o parametro responsável pela ordenação (Ascendente e descendente).
                                                                // Ex. order=ASC ou order=DESC
        },
        resource: {
          pagination: mod.seRealizarPaginacao ? true : false    // Modo de paginação. É importante para retornar o valor total
                                                                // de registros para o Backbone.Paginator por meio da variavel X-total no header.
        },
        reloadInstances: mod.seRecarregarInstancias  ? true : false  // Recomendado não utilizar esta opção, porque com ela ativada, o serviço CRUD 
                                                                     // não funciona corretamente.
      });
      
      // Acrescentamos aqui a nossa fonte os seus controladores.
      if (mod.controladores){
        var ponteRest = mod.controladores(utilitarios);
        esteObjeto[mod.nome].use(ponteRest);
      }
      
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
    
    // Iniciamos aqui os utilitários.
    utilitarios.inicializar(esteObjeto.bd, esteObjeto.jsonWebToken, esteObjeto.autentic.supersecret);
    
    // Carrega os arquivos que contem os nossos modelos.
    esteObjeto.carregarServicoRest();

    // Se tudo ocorreu bem.
    deliberar(esteObjeto);
    
  });
};

module.exports = ServicoRest;