'use strict';

/* @arquivo indice.js 
 *
 * Aqui, nós iremos realizará uma parte da autenticação e também autorização do nosso serviço
 * Utilizando Json Web Token.
 *
 * Estas rotas irão ser utilizadas para a criação, revogação e ou validação dos tokens.
 * Utilizaremos o JWTs porque são um bom mecanismo de autenticação. Além disso, iremos utiliza-lo
 * em conjunto com uma verificação de acesso aos diversos escopos do nosso projeto. 
 * Obs: Nós estamos utilizando o nosso proprio design de controle de acesso aos diversos escopos.
 */

/* A abordagem que utilizaremos para requisitar dados pelo lado cliente é que, sempre que necessário,
 * Iremos realizar uma requisição GET passando o token para a rota '/session'. Assim a gente descobre 
 * se o usuário está validado e depois utilizamos o token para requisitar as diversas rotas do nosso aplicativo.
 * Se a validação der errado, sabemos que o cliente deverá realizar nova autenticação.
 *
 * Abaixo listamos algumas dicas de segurança para o nosso sistema de autenticação.
 * - Crie os tokens com uma chave secreta forte, que seja disponivel para acesso SOMENTE pelo serviço de autenticação.
 *   Sempre que utilizarmos um token para autenticar um usuário, devemos verificar que o token foi criado com a nossa chave super secreta.
 * - Iremos encripta os tokens quando necessário passar informações sensiveis. Isso é realizado utilizando JSON Web Encryption(JWE).
 * - Nunca iremos transmitir os tokens por meio de uma conexão não-HTTPS. Ataques do tipo Man in the middle acontecem.
 * - Iremos armazenar os tokens do lado cliente, somente em HTTPS cookies. Isso nos previne de ataques XSS (https://en.wikipedia.org/wiki/Cross-site_scripting).
 *
 * Lembre-se que mesmo utilizando cookies seguros, ainda assim estaremos vulneráveis aos ataques do tipo CSRF
 * Portanto uma boa abordagem é utilizarmos uma estratégia para combater essa vulnerabilidade. 
 * 
 * @Veja https://stormpath.com/blog/token-auth-spa/
 * @Veja https://www.owasp.org/index.php/Cross-Site_Request_Forgery_%28CSRF%29_Prevention_Cheat_Sheet
 */

/* Versão 0.0.1-Beta 
 * - Mover configuração de cookie para o aquivo de configuração. (issue #44) [FEITO]
 * - Retornar codigo de estado da sessão. (issue #43) [FEITO]
 * - Adicionar rotas de acesso a bandeiras (e os escopos) aninhadas a rota de sessão. (issue #40) [FEITO]
 * - Remover informações sensíveis na resposta da nossa sessão. (issue #35) [FEITO]
 * - Adicionar uma caracteristica de manipulação do serviço de sessões onde possamos ativar o modo cookie ou o modo token. (issue #34) [FEITO]
 * - Adicionar caracteristica de armazenar o token (JWT) em cookie seguro. (issue #33) [FEITO]
 * - Organizar melhor o nosso serviço de autenticação e autorização com Json Web Token. (issue #30) [FEITO]
 * - Adicionar caracteristica de revogar um determinado token. (issue #29) [NAO]
 * - Criar rota no express para permitir ao cliente re-validar seu token de acesso. (issue #27) [FEITO]
 */
 
var util = require('util');
var EmissorEvento = require('events').EventEmitter;
var Promessa = require('bluebird');
var registrador = require('../nucleo/registrador')('Autenticacao');
var express = require('express');
var Respostas = require('./Respostas');

/* A cada requisição iremos retornar na resposta um campo 'code' que é responsável por
 * informar qual estado da sessão. Isso faz com que o lado cliente possa facilmente
 * manipular os diversos estados de uma requisição. Abaixo a lista dos códigos: 
 ------------------------------------------------------------------------------ */
var CODIGOS = {
  
  // Aqui são os códigos relacionados às informações.
  INFO: {
     SENHA_INVALIDA: '001'          // A senha está incorreta ou não foi informada.
   , JID_INVALIDO:   '002'          // O Jid informado não confere.
   , JID_SENHA_NECESSARIOS: '003'   // O Jid ou a senha não foram informados.
   , TOKEN_NECESSARIO: '004'        // O token é necessário de ser informado.
   , TOKEN_EXPIRADO:   '005'        // O token está expirado.
   , SESSAO_ENCERRADA: '006'        // A sessão foi encerrada. Geralmente quando o usuário sai da conta.
   , SERVICO_NAO_DISPONIVEL: '007'  // O serviço ainda está indisponível.
  },
  
  // Aqui os códigos de sucesso.
  SUCESSO: {
     USUARIO_AUTENTICADO: '101'       // O usuário está autenticado com sucesso.
   , TOKEN_VALIDADO: '102'            // O token é valido e pode ser utilizado nas requisições seguintes.
  },
  
  // Informar o cliente que houve algum erro.
  ERRO: {
     TOKEN_NAO_DECODIFICADO: '201'    // Ocorreu algum problema ao decodifica-lo.
   , VERIFICACAO_TOKEN: '202'         // Ocorreu algum problema ao verificarmos a validade do token informado.
  }
};

/* Geralmente o usuário autenticado será verdadeiro ou falso se o contrário.
 * Também utilizaremos o valor daqueles onde não consta a utilização do valor de autenticado.
 */
var AUTENTICADO = {
  NAO: false,
  SIM: true,
  NAO_CONSTA: -1
};

/* Abstração da gerencia das autenticações e autorizações. 
 *
 * @Parametro {Objeto} [aplicativo] O nosso servidor Express.
 * @Parametro {Objeto} [bancoDados] O nosso banco de dados Sequelize.
 * @Parametro {Objeto} [jwt] Utilizado para tratar as requisições em Json Web Token.
 * @Parametro {Método} [jwt.verify] Utilizado para verificarmos o token.
 * @Parametro {Objeto} [autenticacao] Configuração de autenticação.
 * @Parametro {Texto} [autenticacao.verifyModel] Contêm o nome do modelo onde iremos buscar verificar os dados do usuário.
 * @Parametro {Texto} [autenticacao.accessModel] Contêm o nome do modelo onde iremos buscar verificar as bandeiras de acesso do usuário.
 * @Parametro {Texto} [autenticacao.superSecret] Contêm o valor da chave super secreta para codificar e decodificar os tokens.
 * @Parametro {Boleano} [autenticacao.useSessionWithCookies] Contêm o valor que informa se vamos utilizar cookies com sessão.
 * @Parametro {Número} [autenticacao.minutesToExpireToken] Contêm o valor dos minutos de validade do token.
 */
var Autenticacao = function (aplicativo, bancoDados, jwt, autenticacao) {
  
  EmissorEvento.call(this);

  // Armazena a classe do banco de dados sequelize.
  this.bd = bancoDados; 
  
  // Armazena aplicativo express
  this.aplic = aplicativo;
  
  // Utilizaremos os tokens para autenticação.
  this.jsonWebToken = jwt;
  
  /* A nossa configuração da autenticação. Abaixo a lista das propriedades:
   * - autenticacao.verifyModel: Contêm o nome do modelo onde iremos buscar verificar os dados do usuário.
   * - autenticacao.accessModel: Contêm o nome do modelo onde iremos buscar verificar as bandeiras de acesso do usuário.
   * - autenticacao.superSecret: Contêm o valor da chave super secreta para codificar e decodificar os tokens.
   * - autenticacao.useSessionWithCookies: Contêm o valor que informa se vamos utilizar cookies com sessão.
   * - autenticacao.minutesToExpireToken: Contêm o valor dos minutos de validade do token.
   */
  this.autentic = autenticacao;
  this.seForUtilizarSessaoComCookie = autenticacao.useSessionWithCookies;  // Aqui a gente coloca se utilizaremos cookies seguros para a sessão.
  this.minutosParaExpirarToken = autenticacao.minutesToExpireToken; 
  
  /* Necessitamos aqui de receber as caracteristicas para utilizarmos rotas. Isto é importante para aninharmos algumas rotas.
   * Iniciamos aqui o roteador para sessões e os escopos do usuário. Note que colocamos mergeParams no roteador de escopos, porque 
   * queremos aninha-los com o roteador de sessão. @Veja http://stackoverflow.com/a/25305272/4187180
   *
   * As rotas disponíveis serão:
   * - POST /sessao/  (Para realizarmos o inicio de uma sessão).
   * - GET /sessao/  (Para validarmos uma sessão).
   * - DELETE /sessao/  (Para o usuário encerrar uma sessão já existente).
   * - GET /sessao/:identificadorDoUsuario/escopos/  (Para receber o valor dos escopos de um determinado usuário).
   * - GET /escopos/  (Para pegar o valor dos escopos de determinado usuário).
   *
   * Devemos lembrar que se estivermos utilizando cookies a sessão do usuário irá funcionar em todas as janelas de um mesmo navegador.
   */
  this.sessaoRoteador = express.Router();
  this.escoposRoteador = express.Router({mergeParams: true});
};

util.inherits(Autenticacao, EmissorEvento);

/* Nós iremos utilizar este método constantemente para realizarmos a resposta para cada uma das nossas rotas.
 *
 * @Parametro {Objeto} [resposta] Utilizado para enviar a resposta ao navegador do cliente.
 * @Parametro {Objeto} [valor] Os valores de nossa resposta.
 */
Autenticacao.prototype._responder = function(resposta, valor) {
  var dados = {
    message: valor.message,
    code: valor.code
  };
  
  // Quando o valor não constar não vamos envia-lo.
  if (valor.auth !== AUTENTICADO.NAO_CONSTA) {
    dados.auth = valor.auth;
  } 
  resposta.status(valor.status).json(dados);
};

/* Realiza a busca do token em cookies ou na requisição. Esta é a parte básica da nossa autenticação.
 * Assim que o usuário tentar acesso em qualquer das rotas nós iremos buscar inicialmente o token aqui.
 *
 * @Parametro {Objeto} [req] Contêm dados de determinada requisição.
 * @Parametro {Objeto} [req.params] Contêm dados passados nos parametros da requisição.
 * @Parametro {Texto} [req.params.token] O valor do token passado no parametro da requisição.
 * @Parametro {Objeto} [req.body] Contêm os dados passados no corpo da requisição.
 * @Parametro {Texto} [req.body.token] O valor do token passado no corpo da requisição.
 * @Parametro {Objeto} [req.session] Contêm os dados de determinada sessão.
 * @Parametro {Texto} [req.session.token] O valor do token que está na sessão armazenado em um cookie.
 * @Retorna {Texto|nulo} Em caso de sucesso retornamos o texto do token. Se por algum motivo houver falha nós retornamos nulo.
 */
Autenticacao.prototype._buscarToken = function(req) {
  var token = null;
    
  // Aqui nós tentaremos acessar um token já existente em um cookie.
  if (this.seForUtilizarSessaoComCookie && req.session && req.session.token) {
    token = req.session.token;
  } else {
    // Tentamos pegar o token informado no corpo, parametros ou no cabeçalho da requisição.
    token = (req.body && req.body.token) || (req.params && req.params.token) || req.headers['x-access-token'];
  }
  return token;
};

/* Realiza roteamento para os escopos. Note que os escopos estão aninhados com a sessão.
 * Assim, ao requisitarmos a sessão com sucesso então iremos conseguir acessar os escopos do usuário.
 * @Veja http://stackoverflow.com/a/25305272/4187180
 */
Autenticacao.prototype.carregarServicoEscopos = function() {
  var esteObjeto = this;
  
  // Aninhamos os roteadores ao acrescenta-los como ponte:
  this.sessaoRoteador.use('/:usuarioId/escopos', this.escoposRoteador);
  
  this.escoposRoteador.route('/').get(function (req, res) {
    
    var token = esteObjeto._buscarToken(req);
    
    // Aqui iremos verificar o token e depois pegar a lista de escopos deste usuário.
    if (token) {
      esteObjeto.jsonWebToken.verify(token, esteObjeto.autentic.superSecret, function (erro, decodificado) {
        if (erro) {
          var resposta = {};
          // Acabou de acontecer um erro ao tentarmos verificar o token informado.
          
          // O Token expirou, aqui informamos que tem de ser realizada nova autenticação.    
          if (erro.name && erro.name === 'TokenExpiredError') {
            resposta = new Respostas.RespostaDeErroNaoAutorizado('Você informou um token que expirou. ('+ erro.message +').', CODIGOS.INFO.TOKEN_EXPIRADO, AUTENTICADO.NAO_CONSTA);
            
            if (esteObjeto.seForUtilizarSessaoComCookie && req.session) {
              // Se existir, nós regeneramos a nossa sessão antes de responder.
              req.session.regenerate(function(err) { esteObjeto._responder(res, resposta); });
            } else {
              esteObjeto._responder(res, resposta)
            } 
          } else {
            resposta = new Respostas.RespostaDeErroNaoAutorizado('Ocorreu um erro ao tentarmos verificar seu token. ('+ erro.message +').', CODIGOS.ERRO.VERIFICACAO_TOKEN, AUTENTICADO.NAO_CONSTA);
            
            if (esteObjeto.seForUtilizarSessaoComCookie && req.session) {
              // Se existir, nós regeneramos a nossa sessão antes de responder.
              req.session.regenerate(function(err) { esteObjeto._responder(res, resposta); });
            } else {
              esteObjeto._responder(res, resposta)
            } 
          }
        } else {
          // Queremos o ID do usuário para verificarmos se ele confere com o ID que está no token.
          // <umdez> Ainda não sei se é realmente necessário realizarmos isso. Vou ter que verificar isto.
          // var usrId = req.params ? req.params.usuarioId : null;  
          
          // Quando o token for decodificado nós iremos tentar acessar o id do usuário.
          if (decodificado && decodificado.user && (decodificado.user.id > 0)) {
            // O token foi decodificado com sucesso. Aqui nós iremos procurar pelas bandeiras que este usuário possui
            // para todas as rotas que ele tem cadastro. Isso funcionará como os escopos, porque só iremos oferecer acesso
            // a certos escopos (rotas dos modelos).
            esteObjeto.bd[esteObjeto.autentic.accessModel].findAll({
              where: {
                usuario_id: decodificado.user.id
              }
            }).then(function (acessos) {
              if (!acessos) {
                // Aqui, caso o usuário não possua nenhuma bandeira, fará com que o usuário não tenha acesso as rotas 
                // que necessitem de uma bandeira de acesso. Lembre-se que as rotas de livre acesso não necessitam de nenhuma verificação.
                // Então este usuário possuirá acesso a somente as rotas de livre acesso, que geralmente são de listagem ou leitura.
              } else {
                // Nossa resposta:
                var resposta = [];
                
                // Caso tenhamos diversos acessos para diversos modelos, vamos armazena-los aqui.
                acessos.forEach(function(acesso) {
                  var escopo = {};                               // Nosso escopo de acesso as rotas de cada modelo.
                  var modelo = acesso.modelo;                    // O modelo onde verificamos a bandeira de acesso.
                  var bandeira = acesso.bandeira.toString(16);   // Salvamos a bandeira do modelo no tipo texto. Depois convertemos para hexa.                  
                  escopo['modelo'] = modelo;                     // O modelo.
                  escopo['bandeira'] = bandeira;                 // Salvamos determinada bandeira para um modelo em especifico.
                  resposta.push(escopo);
                }); 
                res.status(200).json(resposta);
              }
            });
            
          } 
           // Alguma coisa deu errado ao tentarmos decodificar o token informado.
           else {
            var resposta = {};
            resposta = new Respostas.RespostaDeErroNaoAutorizado('Você informou um token que não foi possível decodificar.', CODIGOS.ERRO.TOKEN_NAO_DECODIFICADO, AUTENTICADO.NAO_CONSTA);
            
            if (esteObjeto.seForUtilizarSessaoComCookie && req.session) {
              // Se existir, nós regeneramos a nossa sessão antes de responder.
              req.session.regenerate(function(err) { esteObjeto._responder(res, resposta); });
            } else {
              esteObjeto._responder(res, resposta);
            }
          }
        }
      });
    } else {
      var resposta = new Respostas.RespostaDeErroNaoAutorizado('Você deve nos informar um token para continuar.', CODIGOS.INFO.TOKEN_NECESSARIO, AUTENTICADO.NAO_CONSTA);
      esteObjeto._responder(res, resposta);
    }
  
  });

  // Informamos aqui um único escopo de uma sessão pelo id.
  this.escoposRoteador.route('/:escopoId').get(function (req, res) {
    var escpId = req.params.escopoId;  // Identificador deste escopo.
    var usrId = req.params.usuarioId;  // Identificador da sessão deste usuário.
    
    var resposta = new Respostas.RespostaDeErroNaoAutorizado('Acesso não autorizado. Isto ainda não foi implementado.', CODIGOS.INFO.SERVICO_NAO_DISPONIVEL, AUTENTICADO.NAO_CONSTA);
    esteObjeto._responder(res, resposta);
  });
  
};

/* Realiza o inicio do serviço de autenticação de nossos usuários.
 * @Veja http://brianmajewski.com/2015/02/25/relearning-backbone-part-9/
 */
Autenticacao.prototype.carregarServicoSessao = function () {
  var esteObjeto = this;
  
  // Obs: Se utilizar o Postman, não utilize 'application/json' no header de requisição
  // @Veja http://stackoverflow.com/a/29006928/4187180
  
  /* Aqui - em cada uma das rotas - nós também iremos retornar um código de status informando o ocorrido. Os valores de estados poderão ser:
   * - [estatus 200] Tudo certo. Estado padrão para informar que a requisição ocorreu com exito.
   * - [estatus 401] Não autorizado. Quando a autenticação é requerida e falhou ou dados necessários não foram providos.
   * - [estatus 400] Uma requisição errada. O servidor não pode ou não vai processar a requisição porque houve um erro no cliente (ex., sintaxe de requisição mau formada).
   * - [estatus 403] Acesso proibido. Retornamos este valor sempre que o acesso a uma fonte é proibida.
   * - [estatus 404] Não encontrado. A fonte requisitada não pode ser encontrada mas pode ser disponível no futuro.
   * - [estatus 500] Erro interno no servidor. Uma mensagem generica, disparada quando uma condição não esperada foi encontrada.
   *
   * @Veja https://en.wikipedia.org/wiki/List_of_HTTP_status_codes
   * @Veja http://expressjs.com/en/guide/error-handling.html
   */
      
  // Acrescentamos a nossa rota de autenticação e esperamos por requisições do tipo POST.
  this.sessaoRoteador.route('/').post(function (req, res) {
        
    // Tentamos pegar aqui o jid e senha informados no corpo, parametros ou no cabeçalho da requisição.
    var jid = (req.body && req.body.jid) || (req.params && req.params.jid) || req.headers['x-authentication-jid'];
    var senha = (req.body && req.body.senha) || (req.params && req.params.senha) || req.headers['x-authentication-senha'];
    
    if (jid) {
      // Aqui procuramos o usuário pelo jid fornecido.
      esteObjeto.bd[esteObjeto.autentic.verifyModel].findOne({
        where: {
          jid: jid
        }
      }).then(function (usuario) {
        // Se não houver um usuário, é provavel que os dados informados estejam incorretos. Informamos que o JID é incorreto.
        if (!usuario) {
          var resposta = new Respostas.RespostaDeErroNaoAutorizado('Você informou um JID que não confere.', CODIGOS.INFO.JID_INVALIDO, AUTENTICADO.NAO);
          esteObjeto._responder(res, resposta);
        } else {
          // Iremos verificar aqui se os dados informados realmente conferem com os dados que temos.
          var seConfere = senha ? usuario.verificarSenha(senha) : false;
          if (seConfere) {
            // O jid e senha conferem, agora iremos requisitar as bandeiras de acesso para cada modelo.
            var jwtDados = {};
            // Aqui nós iremos procurar pelas bandeiras que este usuário possui para todas as rotas que ele tem cadastro.
            // Isso funcionará como os escopos, porque só iremos oferecer acesso a certos escopos (rotas dos modelos).
            esteObjeto.bd[esteObjeto.autentic.accessModel].findAll({
              where: {
                usuario_id: usuario.id  // Identificador do usuário.
              }
            }).then(function (acessos) {
        
              jwtDados.id = usuario.id;
              
              // Copiamos alguns dados básicos do usuário e depois iremos codifica-los e depois retorna-los.
              jwtDados.user = {};                 // Acrescentamos todos os dados do usuário
              jwtDados.user.id = usuario.id;      // O identificador e também chave primária do nosso usuário.
              jwtDados.user.name = usuario.name;  // O nome do usuário.
              jwtDados.user.jid = usuario.jid;    // O identificador Jabber do nosso usuário. (local@dominio).
              jwtDados.user.uuid = usuario.uuid;  // O identificador único do usuário.              
              
              // Obs: Ainda não estou certo se vou continuar informando os escopos diretamente pelo JWT.
              // Pode ser que fique melhor a cada requisição que seja informado qual os escopos de acesso a cada requisição.
              if (!acessos) {
                // Aqui, caso o usuário não possua nenhuma bandeira, fará com que o usuário não tenha acesso as rotas 
                // que necessitem de uma bandeira de acesso. Lembre-se que as rotas de livre acesso não necessitam de nenhuma verificação.
                // Então este usuário possuirá acesso a somente as rotas de livre acesso, que geralmente são de listagem ou leitura.
              } else {
                // Nossos escopos de acesso as rotas de cada modelo.
                var escopos = {};
                // Caso tenhamos diversos acessos para diversos modelos, vamos armazena-los aqui.
                acessos.forEach(function(acesso) {
                  var modelo = acesso.modelo;                   // O modelo onde verificamos a bandeira de acesso.
                  var bandeira = acesso.bandeira.toString(16);  // Salvamos a bandeira do modelo no tipo texto. Depois convertemos para hexa.
                  // escopos[modelo] = bandeira;                // Salvamos determinada bandeira para um modelo em especifico.
                }); 
                jwtDados.scopes = escopos;  // Acrescentamos os escopos.
              }
              
              // Agora que tudo esta certo nós podemos criar seu token de acesso.
              var token = esteObjeto.jsonWebToken.sign(
                jwtDados,                           // Informações básicas.
                esteObjeto.autentic.superSecret, {
                expiresInMinutes: esteObjeto.minutosParaExpirarToken  // Quantidade de minutos até o token expirar.
              });

              // Criamos a nossa resposta.
              var resposta = {};
              
              /* Se nós estamos utilizando cookies seguros então não é necessário retornarmos o nosso token.
               * Faremos isso porque o token é um dado sensivel e precavemos contra o roubo dele.
               * Já se não utilizamos os cookies então iremos adicionar o nosso token na resposta.
               */
              if (!esteObjeto.seForUtilizarSessaoComCookie) {
                resposta.token = token;  // Aqui nós teremos que informar o token.
              } else {
                // Aqui nós salvamos o nosso token em um cookie seguro. É importante utilizarmos o cookie seguro,
                // Desta forma vamos nos precaver de uma tentativa de pegar os dados.
                // Lembre-se que este cookie só funcionará em conexões seguras (HTTPS).
                if (req.session) {
                  req.session.token = token;
                } else {
                  // <umdez> O que fazer aqui?
                }
              }
              resposta.code = CODIGOS.SUCESSO.USUARIO_AUTENTICADO;
              resposta.auth = true;  // Se foi autenticado.
              resposta.message = 'Autorização permitida, seu access token foi criado.';
              
              // Extendemos aqui a nossa resposta, adicionando escopos e dados do usuário.
              util._extend(resposta, jwtDados);
              
              // Informamos que houve sucesso na identificação e também retornamos o valor do token. 
              // Este token contêm informações sobre o tipo de acesso que o usuário possuirá. Isto 
              // é realizado pelo valor das bandeiras que este usuário possui.
              res.status(200).json(resposta);
            });
            
          } else {
            var resposta = new Respostas.RespostaDeErroNaoAutorizado('Você informou uma senha que não confere.', CODIGOS.INFO.SENHA_INVALIDA, AUTENTICADO.NAO);
            esteObjeto._responder(res, resposta);
          } 
        }
      });
    } 
    // Caso o jid não for informado, nós temos que avisar.
    else {
      var resposta = null;
      if(!senha) {
        // O JID e a senha não foram informados corretamente.
        resposta = new Respostas.RespostaDeErroNaoAutorizado('É necessário informar o Jid e a senha.', CODIGOS.INFO.JID_SENHA_NECESSARIOS, AUTENTICADO.NAO);
      } else {
        // Apenas o JID que não foi informado corretamente.
        resposta = new Respostas.RespostaDeErroNaoAutorizado('Você informou um JID que não confere.', CODIGOS.INFO.JID_INVALIDO, AUTENTICADO.NAO);
      }
      esteObjeto._responder(res, resposta);
    } 
  });
  
 /* Aqui iremos fazer uma coisa, primeiramente nós vamos verificar se um token foi informado. Caso o token foi informado, nós
  * iremos verificar se o token é valido e se não expirou. Assim iremos conseguir verificar o estado atual de autenticação
  * do usuário. No lado cliente, teremos a cada nova requisição, informar o token para esta rota, assim a gente consegue 
  * re-validar seu token de acesso.  
  *
  * Se houve sucesso, nós iremos informar o usuário uma mensagem de que o token não expirou.
  *
  * Caso ocorreu sucesso, o lado cliente saberá que está validado.
  * Ou se caso não haja sucesso na re-validação e ou autenticação, então o lado cliente deve manipular para que seja
  * apresentada uma visão onde o usuário posso realizar nova autenticação.
  *
  * @Veja http://www.sitepoint.com/using-json-web-tokens-node-js/
  *
  * Obs: É importante lembrar que o token permanece válido ao usuário re-iniciar a página. Assim fica necessário apenas
  * verificarmos a sessao novamente, ao invez de re-autenticar o usuário.
  */
  this.sessaoRoteador.route('/').get(function(req, res){ 
   var token = esteObjeto._buscarToken(req);
    
    if (token) {
      esteObjeto.jsonWebToken.verify(token, esteObjeto.autentic.superSecret, function (erro, decodificado) {
        if (erro) {
          var resposta = {};
                    
          // O Token expirou, aqui informamos que tem de ser realizada nova autenticação. 
          if (erro.name && erro.name === 'TokenExpiredError') {
            resposta = new Respostas.RespostaDeErroNaoAutorizado('Você informou um token que expirou. ('+ erro.message +').', CODIGOS.INFO.TOKEN_EXPIRADO, AUTENTICADO.NAO);
                        
            if (esteObjeto.seForUtilizarSessaoComCookie && req.session) {
              // Se existir, nós regeneramos a nossa sessão e depois respondemos.
              req.session.regenerate(function(err) { esteObjeto._responder(res, resposta); });
            } else {
              esteObjeto._responder(res, resposta);
            } 
          } 
           // O token parece que não está expirado, porem algum outro erro aconteceu. 
           else {
            resposta = new Respostas.RespostaDeErroNaoAutorizado('Ocorreu um erro ao tentarmos verificar seu token. ('+ erro.message +').', CODIGOS.ERRO.VERIFICACAO_TOKEN, AUTENTICADO.NAO);
                       
            if (esteObjeto.seForUtilizarSessaoComCookie && req.session) {
              // Se existir, nós regeneramos a nossa sessão e logo após isto respondemos.
              req.session.regenerate(function(err) { esteObjeto._responder(res, resposta); });
            } else {
              esteObjeto._responder(res, resposta);
            }
          }
        } else {
          var resposta = {};
            
          if (decodificado) {
            // Informamos que houve sucesso na validação do token. Este token contêm informações do nosso usuário.
            resposta.auth = true;
            resposta.message = 'Seu token foi validado com sucesso.';
            resposta.id = decodificado.id;  // O identificador do usuário. Essa é a chave primária do usuário.
            resposta.code = CODIGOS.SUCESSO.TOKEN_VALIDADO;
            res.status(200).json(resposta);
          } 
          // Alguma coisa deu errado ao tentarmos decodificar o token informado.
           else {
            resposta.auth = false;
            resposta.message = 'Você informou um token que não foi possível de se decodificar.';
            resposta.code = CODIGOS.ERRO.TOKEN_NAO_DECODIFICADO;
            
            // Se existir uma sessão, nós limpamos ela.
            if (esteObjeto.seForUtilizarSessaoComCookie && req.session) {
              req.session.regenerate(function(erro) { res.status(401).json(resposta); });
            } else {
              res.status(401).json(resposta);
            }
          }
        }
      });
    } else {
      var resposta = new Respostas.RespostaDeErroNaoAutorizado('Você deve nos informar um token para realizar a validação.', CODIGOS.INFO.TOKEN_NECESSARIO, AUTENTICADO.NAO);
      esteObjeto._responder(res, resposta);
    }
  });
  
  /* Realiza a saida do usuário. É importante notar que apesar de estarmos retornando estado 200 de sucesso,
   * não será possível que o token seja revogado. Então nós retornamos este estado mesmo que não houve um sucesso.
   *
   * @Parametro {Objeto} [req] A requisição recebida.
   * @Parametro {Objeto} [req.params] Os parametros da requisição recebida pela rota.
   * @Parametro {Número} [req.params.usuarioId] O valor do identificador do usuário. Isso geralmente será a chave primaria do registro do usuário.
   * @Parametro {Objeto} [res] Utilizado para a nossa resposta.
   * @Parametro {Função} [next] função chamada para passar a requisição para outras rotas.
   */
  this.sessaoRoteador.route('/:usuarioId').delete(function(req, res, next){  
     var usrId = req.params.usuarioId;  // <umdez> Podemos utilizar este id depois?
     var token = esteObjeto._buscarToken(req);
    
    /* Quando o usuário sair do sistema, vamos limpar sua sessão.
     * Lembre-se que se esta rota não for chamada pelo lado cliente, não temos como saber 
     * quando que o cliente saiu.
     *
     * <umdez> Existe algum método para revogar a existencia de um token?
     * Provavelmente teremos que apenas remover o token que está armazenado no lado cliente.
     * Assim o sistema não conseguirá acessar nossas fontes. Isso pode ser
     * uma alternativa.
     */ 
    var resposta = null;
    if (esteObjeto.seForUtilizarSessaoComCookie && req.session && req.session.token) {
      req.session.regenerate(function(erro) {
        // Regenerar a sessão do usuário.
        resposta = new Respostas.RespostaDeRequisisaoCompleta('Sessão regenerada porem não foi possível revogar o seu token.', CODIGOS.INFO.SESSAO_ENCERRADA, AUTENTICADO.NAO);
        esteObjeto._responder(res, resposta);
      });
    } else {
      resposta = new Respostas.RespostaDeRequisisaoCompleta('Não é possível revogar o seu token.', CODIGOS.INFO.SESSAO_ENCERRADA, AUTENTICADO.NAO); 
      esteObjeto._responder(res, resposta);
    } 
  });
  
  this.aplic.use('/sessao', this.sessaoRoteador);
};

/* Realizamos aqui o inicio do nosso serviço de sessão com autenticação e autorização.
 *
 * @Retorna {Objeto} [Promessa] Uma promessa de recusa ou de deliberação. 
 */
Autenticacao.prototype.iniciar = function () {

  registrador.debug('Iniciando serviço de Autenticacao e Autorização.');

  var esteObjeto = this;

  return new Promessa(function (deliberar, recusar) {

    // Carregamos nosso serviço de sessões.
    esteObjeto.carregarServicoSessao();
    
    // Carregamos nosso serviço de escopos.
    esteObjeto.carregarServicoEscopos();
    
    // Se tudo ocorreu bem.
    deliberar(esteObjeto);
    
  });
};

module.exports = Autenticacao;