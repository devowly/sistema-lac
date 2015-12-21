'use strict';

/* Aqui possuimos tudo relativo a nossa fonte REST exame. Temos aqui definido o controle de acesso a esta fonte.
 *
 * @Arquivo Exame.js 
 */

/* Versão 0.0.1-Beta
 */
 
var exame = {
    nome: 'Exame'                      // É o nome dado a tabela (modelo) no banco de dados.
  , rotas: ['/exames', '/exames/:id']  // Rotas para o serviço REST.
  , sePossuirAssociacoes: true         // Se possui associações.
  , parametroPesquisa: 'q'             // O parametro utilizado na pesquisa.
  , parametroOrdenamento: 'order'      // Parametro de ordenamento.
  , seRealizarPaginacao: true          // Caso seja necessário possuir suporte à paginação.
  , controladores: null                // Os controladores desta rota.
};

exame.controladores = function() {
  
  /* Para cada requisição a um dos nossos endpoints será necessário que o usuário tenha uma bandeira de acesso.
   * As bandeiras irão servir como uma chave de acesso as requisições. As bandeiras são:
   */
  var ACESSO_CRIAR = 0      // Chave de acesso necessária para criar um registro.
  ,   ACESSO_LISTAR = 0     // Chave de acesso necessária para listar registros.
  ,   ACESSO_LER = 0        // Chave de acesso necessária para ler algum registro.
  ,   ACESSO_ATUALIZAR = 0  // Chave de acesso necessária para atualizar algum registro.
  ,   ACESSO_DELETAR = 0    // Chave de acesso necessária para deletar algum registro.
  ,   ACESSO_LIVRE = 0;     // Chave de acesso livre, assim o controlador irá aceitar qualquer requisição.
  
  ACESSO_LISTAR = ACESSO_LIVRE;  // O acesso a listagem é livre.
  ACESSO_LER = ACESSO_LIVRE;     // O acesso a leitura é livre.
  
 /* Para esta fonte, teremos alguns controladores listados abaixo:
  * - Exame.create
  * - Exame.list
  * - Exame.read
  * - Exame.update
  * - Exame.delete
  *
  * E para cada um dos controladores acima listados, nós temos os hooks:
  * auth, start, auth, fetch, data, write, send e complete.
  *
  * Os valores retornados podem ser o valor em JSON, ou em alguns casos, nós iremos retornar um código de status informando
  * o ocorrido. Os valores de status poderão ser:
  * - [status 403] Retornamos este valor sempre que o acesso a uma fonte é proibida.
  * - [status 404] Retornamos este valor sempre que, por algum motivo, a fonte não está disponível no momento.
  *
  * @Veja https://en.wikipedia.org/wiki/List_of_HTTP_status_codes
  */
  
  return {
    'create': {
      fetch: function(req, res, context) {
        // Manipulamos aqui a chamada fetch.
        return context.continue;
      }
    },
    'list': {
      auth: {
        before: function(req, res, context) {
          // Podemos modificar aqui os dados antes da listagem.
          if (ACESSO_LISTAR === ACESSO_LIVRE) {
            // Acesso livre para a listagem. Podemos continuar.
            return context.continue;
          } else {
            
          }
          return context.continue;
        },
        action: function(req, res, context) {
          // Podemos mudar aqui o comportamento da escrita atual dos dados.
          return context.continue;
        },
        after: function(req, res, context) {
          // Podemos mudar aqui algo após a escrita da listagem dos dados.
          return context.continue;
        }
      }
    },
    'read': {
      auth: {
        before: function(req, res, context) {
          // Podemos modificar aqui os dados antes da listagem.
          return context.continue;
        },
        action: function(req, res, context) {
          // Podemos mudar aqui o comportamento da escrita atual dos dados.
          return context.continue;
        },
        after: function(req, res, context) {
          // Podemos mudar aqui algo após a escrita da listagem dos dados.
          return context.continue;
        }
      }
    },
    'update': {
      auth: {
        before: function(req, res, context) {
          // Podemos modificar aqui os dados antes da listagem.
          return context.continue;
        },
        action: function(req, res, context) {
          // Podemos mudar aqui o comportamento da escrita atual dos dados.
          return context.continue;
        },
        after: function(req, res, context) {
          // Podemos mudar aqui algo após a escrita da listagem dos dados.
          return context.continue;
        }
      }
    },
    'delete': {
      auth: {
        before: function(req, res, context) {
          // Podemos modificar aqui os dados antes da listagem.
          return context.continue;
        },
        action: function(req, res, context) {
          // Podemos mudar aqui o comportamento da escrita atual dos dados.
          return context.continue;
        },
        after: function(req, res, context) {
          // Podemos mudar aqui algo após a escrita da listagem dos dados.
          return context.continue;
        }
      }
    }
  };
  
};

module.exports = exame;