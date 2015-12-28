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
 * - Organizar melhor o nosso serviço de autenticação e autorização com Json Web Token. (issue #30) [AFAZER]
 * - Adicionar caracteristica de revogar um determinado token. (issue #29) [NAO]
 * - Criar rota no express para permitir ao cliente re-validar seu token de acesso. (issue #27) [FEITO]
 */
 
var util = require('util');
var EmissorEvento = require('events').EventEmitter;
var Promessa = require('bluebird');
var registrador = require('../nucleo/registrador')('Autenticacao');

/* Abstração da gerencia das autenticações e autorizações. 
 *
 * @Parametro {aplicativo} O nosso servidor Express.
 * @Parametro {bancoDados} Objeto do nosso banco de dados.
 * @Parametro {jwt} Módulo para tratar as requisições em Json Web Token.
 * @Parametro {autenticacao} Configuração de autenticação.
 */
var Autenticacao = function (aplicativo, bancoDados, jwt, autenticacao) {
  
  EmissorEvento.call(this);

  // Armazena a classe do banco de dados sequelize.
  this.bd = bancoDados; 
  
  // Armazena aplicativo express
  this.aplic = aplicativo;
  
  // Utilizaremos os tokens para autenticação.
  this.jsonWebToken = jwt;
  
  // A nossa configuração da autenticação. Abaixo a lista das propriedades:
  // - autenticacao.verifyModel: Contêm o nome do modelo onde iremos buscar verificar os dados do usuário.
  // - autenticacao.accessModel: Contêm o nome do modelo onde iremos buscar verificar as bandeiras de acesso do usuário.
  // - autenticacao.superSecret: Contêm o valor da chave super secreta para codificar e decodificar os tokens.
  this.autentic = autenticacao;
};

util.inherits(Autenticacao, EmissorEvento);

/* Realiza o inicio do serviço de autenticação de nossos usuários.
 * @Veja http://brianmajewski.com/2015/02/25/relearning-backbone-part-9/
 */
Autenticacao.prototype.carregarServicoSessao = function () {
  var esteObjeto = this;
  
  // Obs: Se utilizar o Postman, não utilize 'application/json' no header de requisição
  // @Veja https://stackoverflow.com/questions/29006170/error-invalid-json-with-multer-and-body-parser
  
  /* Aqui - em cada uma das rotas - nós também iremos retornar um código de status informando o ocorrido. Os valores de estados poderão ser:
   * - [status 401] Não autorizado. Quando a autenticação é requerida e falhou ou dados necessários não foram providos.
   * - [status 200] Tudo certo. Estado padrão para informar que a requisição ocorreu com exito.
   * - [status 403] Acesso proibido. Retornamos este valor sempre que o acesso a uma fonte é proibida.
   *
   * @Veja https://en.wikipedia.org/wiki/List_of_HTTP_status_codes
   * @Veja http://expressjs.com/en/guide/error-handling.html
   */
  
  // Acrescentamos a nossa rota de autenticação e esperamos por requisições do tipo POST.
  this.aplic.post('/sessao', function (req, res) {
    
    // Tentamos pegar aqui o jid e senha informados no corpo, parametros ou no cabeçalho da requisição.
    var jid = (req.body && req.body.jid) || (req.params && req.params.jid) || req.headers['x-authentication-jid'];
    var senha = (req.body && req.body.senha) || (req.params && req.params.senha) || req.headers['x-authentication-senha'];
    
    if (jid && senha) {
      // Aqui procuramos o usuário pelo jid fornecido.
      esteObjeto.bd[esteObjeto.autentic.verifyModel].findOne({
        where: {
          jid: jid
        }
      }).then(function (usuario) {
        // Se não houver um usuário, é provavel que os dados informados estejam incorretos. Informamos que o JID é incorreto.
        if (!usuario) {
          res.status(401).json({ auth: false, success: false, message: 'Você informou um JID que não confere.' });  
        } else {
          // Iremos verificar aqui se os dados informados realmente conferem com os dados que temos.
          var seConfere = usuario.verificarSenha(senha);
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
                  escopos[modelo] = bandeira;                   // Salvamos determinada bandeira para um modelo em especifico.
                }); 
                jwtDados.scopes = escopos;  // Acrescentamos os escopos.
              }
              
              // Agora que tudo esta certo nós podemos criar seu token de acesso.
              var token = esteObjeto.jsonWebToken.sign(
                jwtDados,                           // Informações básicas.
                esteObjeto.autentic.superSecret, {
                expiresInMinutes: (24 * 60)         // O token expira em 24 horas.
              });

              // Criamos a nossa resposta.
              var resposta = {
                auth: true,        // Se foi autenticado.
                success: true,     // A autenticação foi um sucesso.
                message: 'Autorização permitida, seu access token foi criado.',
                token: token
              }
              // Extendemos aqui a nossa resposta, adicionando escopos e dados do usuário.
              util._extend(resposta, jwtDados);
              
              // Informamos que houve sucesso na identificação e também retornamos o valor do token. 
              // Este token contêm informações sobre o tipo de acesso que o usuário possuirá. Isto 
              // é realizado pelo valor das bandeiras que este usuário possui.
              res.status(200).json(resposta);
            });
            
          } else {
            res.status(401).json({ auth: false, success: false, message: 'Você informou uma senha que não confere.' });
          }
        }
      });
    } 
    // Caso o jid e senha não forem informados, nós temos que avisar.
    else {
      res.status(401).json({ auth: false, success: false, message: 'Você deve informar o jid e senha.' });
    }
  });
  
 /* Aqui iremos fazer duas coisas, a primeira é verificar se um token foi informado. Caso o token foi informado, nós
  * iremos verificar se o token é valido e se não expirou. Assim iremos conseguir verificar o estado atual de autenticação
  * do usuário. No lado cliente, teremos a cada nova requisição, informar o token para esta rota, assim a gente consegue 
  * re-validar seu token de acesso.  
  *
  * A segunda coisa a fazer é se o cliente nos informou um jid e senha. Então verificamos os dados informados, e se 
  * conferir, nós iremos gerar novo token para o usuário.
  *
  * Se houve sucesso, nós iremos informar o usuário com um novo token ou uma mensagem de que o token não expirou.
  *
  * Caso o novo token foi criado com sucesso, o lado cliente deve agir de forma a mostrar o usuário uma nova visão.
  * Ou se caso não haja sucesso na re-validação e ou autenticação, então o lado cliente deve manipular para que seja
  * apresentada uma visão onde o usuário posso realizar nova autenticação.
  *
  * @Veja http://www.sitepoint.com/using-json-web-tokens-node-js/
  *
  * Obs: É importante lembrar que o token permanece válido ao usuário re-iniciar a página. Assim fica necessário apenas
  * verificarmos a sessao novamente, ao invez de re-autenticar o usuário.
  */
  this.aplic.get('/sessao', function(req, res){ 
    
    // Tentamos pegar o token informado no corpo, parametros ou no cabeçalho da requisição.
    var token = (req.body && req.body.token) || (req.params && req.params.token) || req.headers['x-access-token'];
    
    if (token) {
      esteObjeto.jsonWebToken.verify(token, esteObjeto.autentic.superSecret, function (erro, decodificado) {
        if (erro) {
          if (erro.name && erro.name === 'TokenExpiredError') {
            // O Token expirou, aqui informamos que tem de ser realizada nova autenticação.          
            res.status(401).json({ expired: true, success: false, message: 'Você informou um token que expirou. ('+ erro.message +').'});
          } else {
            // Algum outro erro aconteceu. 
            res.status(401).json({ expired: false, success: false, message: 'Ocorreu um erro ao tentarmos verificar seu token. ('+ erro.message +').'});
          }
        } else {
          if (decodificado) {
            // Informamos que houve sucesso na validação do token. 
            // Este token contêm informações do nosso usuário.
            res.status(200).json({
              expired: false,      // Informamos que o token ainda não expirou.
              success: true,       // Informamos que houve sucesso na re-validação.
              message: 'Seu token foi re-validado com sucesso.',
              id: decodificado.id  // O identificador do usuário.
            });
          } else {
            // Alguma coisa deu errado ao tentarmos decodificar o token informado.
            res.json({ expired: false, success: false, message: 'Você informou um token que não foi possível decodificar.' });
          }
        }
      });
    }
    // Se não foi informado um token, então nós iremos supor que foi informado jid e senha para autenticarmos e então gerarmos novo token.
    else {
      // Tentamos pegar aqui o jid e senha informados no corpo, parametros ou no cabeçalho da requisição.
      var jid = (req.body && req.body.jid) || (req.params && req.params.jid) || req.headers['x-authentication-jid'];
      var senha = (req.body && req.body.senha) || (req.params && req.params.senha) || req.headers['x-authentication-senha'];
      
      if (jid && senha) {
        // Aqui procuramos o usuário pelo jid fornecido.
        esteObjeto.bd[esteObjeto.autentic.verifyModel].findOne({
          where: {
            jid: jid
          }
        }).then(function (usuario) {
          // Se não houver um usuário, é provavel que os dados informados estejam incorretos. Informamos que o JID é incorreto.
          if (!usuario) {
            res.status(401).json({ auth: false, success: false, message: 'Você informou um JID que não confere.' });
          } else {
            // Iremos verificar aqui se os dados informados realmente conferem com os dados que temos.
            var seConfere = usuario.verificarSenha(senha);
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
                    escopos[modelo] = bandeira;                   // Salvamos determinada bandeira para um modelo em especifico.
                  }); 
                  jwtDados.scopes = escopos;  // Acrescentamos os escopos.
                }
                
                // Agora que tudo esta certo nós podemos criar seu token de acesso.
                var token = esteObjeto.jsonWebToken.sign(
                  jwtDados,                           // Informações básicas.
                  esteObjeto.autentic.superSecret, {
                  expiresInMinutes: (24 * 60),         // O token expira em 24 horas.
                  noTimestamp: true                    // Não utilizar timeStamp.
                });

                // Criamos a nossa resposta.
                var resposta = {
                  auth: true,        // Se foi autenticado.
                  success: true,     // A autenticação foi um sucesso.
                  message: 'Autorização permitida, seu access token foi criado.',
                  token: token
                }
                // Extendemos aqui a nossa resposta, adicionando escopos e alguns dados do usuário.
                util._extend(resposta, jwtDados);
                
                // Informamos que houve sucesso na identificação e também retornamos o valor do token. 
                // Este token contêm informações sobre o tipo de acesso que o usuário possuirá. Isto 
                // é realizado pelo valor das bandeiras que este usuário possui.
                res.status(200).json(resposta);
                
                // Lembre-se que a resposta contêm a chave exp. Esta chave contêm o valor de minutos até o token expirar.
                // Assim a gente poderia até usar isso no lado cliente para saber quando o token expirou e manipular a visão
                // de forma que seja requisitado nova autenticação pelo cliente.
                // Exemplo: resposta.exp >= (Math.floor(Date.now() / 1000) + (24*60))
                // No exemplo acima iremos verificar se o tempo de expiração ultrapassou 24 horas.
              });
              
            } else {
              res.status(401).json({ auth: false, success: false, message: 'Você informou uma senha que não confere.' });
            }
          }
        });
      } 
      // Caso o token, ou o jid e senha não forem informados, nós temos que avisar.
      else {
        res.status(401).json({ success: false, message: 'Você deve informar o token ou o jid e senha.' });
      }
    } 
  });
  
  this.aplic.delete('/sessao/', function(req, res, next){  
    // Tentamos pegar o token informado no corpo, parametros ou no cabeçalho da requisição.
    var token = (req.body && req.body.token) || (req.params && req.params.token) || req.headers['x-access-token'];
    
    // Quando o usuário sair do sistema, vamos limpar sua sessão.
    // Lembre-se que se esta rota não for chamada pelo lado cliente, não temos como saber 
    // quando que o cliente saiu, nem se é necessário a remoção do token.
    
    // <umdez> Existe algum método para revogar a existencia de um token?
    // Provavelmente teremos que apenas remover o token que está armazenado no lado cliente.
    // Assim o sistema não conseguirá acessar nossas fontes. Isso pode ser
    // uma alternativa.
    res.status(403).json({success: false, message: 'Não é possível revogar o seu token.'});    

    next();    
  });
};

/* Realizamos aqui o inicio do nosso serviço de autenticação e autorização.
 *
 * @Retorna {Promessa} Promessa de recusa ou de deliberação. 
 */
Autenticacao.prototype.iniciar = function () {

  registrador.debug('Iniciando serviço de Autenticacao e Autorização.');

  var esteObjeto = this;

  return new Promessa(function (deliberar, recusar) {

    // Carregamos nosso serviço.
    esteObjeto.carregarServicoSessao();
    
    // Se tudo ocorreu bem.
    deliberar(esteObjeto);
    
  });
};

module.exports = Autenticacao;