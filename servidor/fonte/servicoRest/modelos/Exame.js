'use strict';

/* Aqui possuimos tudo relativo a nossa fonte REST exame. Temos aqui definido o controle de acesso a esta fonte.
 *
 * @Arquivo Exame.js 
 */

/* Versão 0.0.1-Beta
 */
 
/* @Objeto exame.
 *
 * Possui propriedades necessárias para o inicio do serviço REST para o modelo Exame.
 -------------------------------------------------------------------------------------*/
var exame = {
    nome: 'Exame'                      // É o nome dado a tabela (modelo) no banco de dados.
  , rotas: ['/exames', '/exames/:id']  // Rotas para o serviço REST.
  , sePossuirAssociacoes: true         // Se possui associações.
  , parametroPesquisa: 'q'             // O parametro utilizado na pesquisa.
  , parametroOrdenamento: 'order'      // Parametro de ordenamento.
  , seRealizarPaginacao: true          // Caso seja necessário possuir suporte à paginação.
  , controladores: null                // Os controladores desta rota.
  , seRecarregarInstancias: false      // É importante *não* ligar esta opção, porque causa um comportamento estranho ao atualizar e ou criar registros.
};

/* @Função controladores().
 *
 * Os controladores deste modelo.
 *
 * @Parametro {Objeto} [utilitarios] Contêm métodos uteis como autenticação e verificação de acesso.
 * @Retorna {Objeto} Contendo os controladores do Epilogue.
 */
exame.controladores = function(utilitarios) {
  
  // Nome deste módulo, Geralmente é o nome dessa tabela no banco de dados.
  exame.esteModelo = exame.nome;
  
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
  ,   ACESSO_LIVRE =     0x00000020   // Chave de acesso livre, assim o controlador irá aceitar qualquer requisição.
  ,   ACESSO_TOTAL =     0x00000040;  // Chave de acesso do usuário raiz, com esta chave é possível acessar todas as rotas.

  ACESSO_LISTAR |= ACESSO_LIVRE;  // Geralmente o acesso a listagem é livre.
  ACESSO_LER |=    ACESSO_LIVRE;  // Geralmente o acesso a leitura é livre.
    
  // Adicionamos aqui as nossas bandeiras suportadas por este modelo.
  // Lembre-se que cada modelo pode possir bandeiras de acesso diferentes.
  utilitarios.adcUmaBandeiraParaModelo(exame.esteModelo, 'ACESSO_CRIAR', 'Criar', ACESSO_CRIAR);  
  utilitarios.adcUmaBandeiraParaModelo(exame.esteModelo, 'ACESSO_LISTAR', 'Listar', ACESSO_LISTAR);  
  utilitarios.adcUmaBandeiraParaModelo(exame.esteModelo, 'ACESSO_LER', 'Ler', ACESSO_LER);  
  utilitarios.adcUmaBandeiraParaModelo(exame.esteModelo, 'ACESSO_ATUALIZAR', 'Atualizar', ACESSO_ATUALIZAR);  
  utilitarios.adcUmaBandeiraParaModelo(exame.esteModelo, 'ACESSO_DELETAR', 'Deletar', ACESSO_DELETAR);  
  utilitarios.adcUmaBandeiraParaModelo(exame.esteModelo, 'ACESSO_LIVRE', 'Livre', ACESSO_LIVRE);  
  utilitarios.adcUmaBandeiraParaModelo(exame.esteModelo, 'ACESSO_TOTAL', 'Total', ACESSO_TOTAL);  
        
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
  * - [status 401] Não autorizado. Quando a autenticação é requerida e falhou ou dados necessários não foram providos.
  * - [status 403] Retornamos este valor sempre que o acesso a uma fonte é proibida.
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
          if (sePossuiAcesso('Criar', ACESSO_LIVRE)) {
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
          var seValidado = false;   // Informamos se o usuário foi validado.
          var dadosEscopos = null;  // Dados do usuário.
          
          // Aqui iremos ver se o usuário possui acesso a esta fonte. Esta verificação é realizada antes da listagem  começar.
          // De qualquer forma, podemos aqui adicionar a verificação do cliente (para saber se ele possui ou não acesso).
          if (utilitarios.verificarSePossuiAcesso(exame.esteModelo, ['Listar'], ACESSO_LIVRE)) {
            // Acesso livre para a listagem. Podemos continuar.
            return context.continue;
          } else {
            // Iremos buscar o token que está em uma sessão ou que foi informado na requisição.
            var token = utilitarios.buscarUmToken(req);
            
            if (token) {
              // Autenticamos aqui o usuário utilizando o token informado.
              utilitarios.autenticarPeloToken(token, function(seConfere, escopos) {
                if (seConfere) {
                  // Nosso usuário foi validado com sucesso.
                  dadosEscopos = escopos;
                  seValidado = seConfere;
                } 
              });
            } else {
              return context.error(401, "É necessário informar um token.");
            }
            
            // Aqui verificamos se o usuário é valido e se possui algum acesso a esta fonte.
            // Caso não possua acesso é retornado um erro 403 de acesso proibido.
            if (seValidado && dadosEscopos) {
              if(utilitarios.verificarSePossuiAcesso(exame.esteModelo, ['Listar', 'Total'], dadosEscopos[exame.esteModelo])) {
                return context.continue;
              } else {
                return context.error(403, "Acesso proibido a listagem.");
              }
            } else {
              return context.error(401, "Tentativa de acesso sem sucesso. Verifique seu token de acesso.");
            }
          }
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
          if (sePossuiAcesso('Ler', ACESSO_LIVRE)) {
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