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
  
 /* As bandeiras de acesso a esta fonte, nós utilizaremos nestas bandeiras operadores bit a bit.
  * Exemplo de como manipular as bandeiras:
  * - bandeira & bandeira (Comparação).
  * - bandeira |= bandeira (Adição).
  * - bandeira &= ~bandeira (Remoção).
  *
  * Para cada requisição a um dos nossos endpoints será necessário que o usuário tenha uma bandeira de acesso.
  * As bandeiras irão servir como uma chave de acesso as requisições. As bandeiras são:
  */
  var ACESSO_CRIAR =     0x00000001   // Chave de acesso necessária para criar um registro. 
  ,   ACESSO_LISTAR =    0x00000002   // Chave de acesso necessária para listar registros.
  ,   ACESSO_LER =       0x00000004   // Chave de acesso necessária para ler algum registro.
  ,   ACESSO_ATUALIZAR = 0x00000008   // Chave de acesso necessária para atualizar algum registro.
  ,   ACESSO_DELETAR =   0x00000010   // Chave de acesso necessária para deletar algum registro.
  ,   ACESSO_LIVRE =     0x00000020;  // Chave de acesso livre, assim o controlador irá aceitar qualquer requisição.

  ACESSO_LISTAR |= ACESSO_LIVRE;  // Geralmente o acesso a listagem é livre.
  ACESSO_LER |=    ACESSO_LIVRE;  // Geralmente o acesso a leitura é livre.
    
  // Verificamos se o acesso a determinado controlador é livre.
  var seAcessoLivre = function(bandeira) {
    return bandeira & ACESSO_LIVRE;
  };
  
  // Verificamos se possui o acesso à criação.
  var seAcessoCriar = function(bandeira) {
    return bandeira & ACESSO_CRIAR;
  };
  
  // Verificamos se possui o acesso à listagem.
  var seAcessoListar = function(bandeira) {
    return bandeira & ACESSO_LISTAR;
  };
  
  // Verificamos se possui o acesso à leitura.
  var seAcessoLer = function(bandeira) {
    return bandeira & ACESSO_LER;
  };
  
  // Verificamos se possui o acesso a atualização.
  var seAcessoAtualizar = function(bandeira) {
    return bandeira & ACESSO_ATUALIZAR;
  };
  
  // Verificamos se possui o acesso a deletar.
  var seAcessoDeletar = function(bandeira) {
    return bandeira & ACESSO_DELETAR;
  };
  
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
  * E para cada um dos hooks, possuimos os milestones. Estes milestones são:
  * before, action, after, fetch etc.
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
      auth: {
        fetch: function(req, res, context) {
          // Manipulamos aqui a chamada fetch.
          return context.continue;
        },
        before: function(req, res, context) {
          // Podemos modificar aqui os dados antes da listagem.
          if (seAcessoLivre(ACESSO_LISTAR)) {
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
    'list': {
      auth: {
        before: function(req, res, context) {
          // Podemos modificar aqui os dados antes da listagem.
          if (seAcessoLivre(ACESSO_LISTAR)) {
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
          if (seAcessoLivre(ACESSO_LER)) {
            // Acesso livre para a leitura. Podemos continuar.
            return context.continue;
          } else {
            
          }
          return context.continue;
        },
        action: function(req, res, context) {
          
          return context.continue;
        },
        after: function(req, res, context) {
         
          return context.continue;
        }
      }
    },
    'update': {
      auth: {
        before: function(req, res, context) {
          
          return context.continue;
        },
        action: function(req, res, context) {
          
          return context.continue;
        },
        after: function(req, res, context) {
          
          return context.continue;
        }
      }
    },
    'delete': {
      auth: {
        before: function(req, res, context) {
         
          return context.continue;
        },
        action: function(req, res, context) {
          
          return context.continue;
        },
        after: function(req, res, context) {
          
          return context.continue;
        }
      }
    }
  };
  
};

module.exports = exame;