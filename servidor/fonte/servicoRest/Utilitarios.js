'use strict'
var deasync = require('deasync');
var Bandeiras = require('./Bandeiras');
var AutenticacaoUsuario = require('./AutenticacaoUsuario');

/* Utilitarios diversos para nossas fontes REST.
 *
 * @Arquivo Utilitarios.js
 */
 
/* @Classe Utilitarios().
 *
 * Contêm utilitários diversos para as fontes Rest.
 *
 * @Parametro {Objeto} [bancoDados] O nosso banco de dados Sequelize.
 * @Parametro {Objeto} [jwt] Utilizado para tratar as requisições em Json Web Token.
 * @Parametro {Objeto} [autenticacao] Configuração de autenticação.
 --------------------------------------------------------------------------------------*/
var Utilitarios = function (bancoDados, jwt, autenticacao) {

  /* @Propriedade {Objeto} [bd] Armazena o objeto do banco de dados sequelize. */
  this.bd = bancoDados; 
  
  /* @Propriedade {Objeto} [jsonWebToken] Utilizaremos os tokens para autenticação. */
  this.jsonWebToken = jwt;
  
  /* @Propriedade {Boleano} [seForUtilizarCookie] Informa se utilizaremos cookies com sessão. */
  this.seForUtilizarCookie = autenticacao.useSessionWithCookies;
  
  /* @Propriedade {Objeto} [autenticacaoUsuario] Para realizar a autenticação dos usuários. */
  this.autenticacaoUsuario = new AutenticacaoUsuario(bancoDados, jwt, autenticacao); 
   
  /* @Propriedade {Objeto} [bandeiras] As bandeiras de acesso as rotas dos modelos. */
  this.bandeiras = new Bandeiras(); 
};

Utilitarios.prototype.inicializar = function () {
  
};

/* @Método [Público] adcUmaBandeiraParaModelo().
 *
 * Acrescenta uma bandeira na pilha do modelo. 
 *
 * @Parametro {Texto} [modelo] O nome do modelo que possui as bandeiras.
 * @Parametro {Texto} [bandeira] O nome desta bandeira.
 * @Parametro {Texto} [tipo] O tipo de acesso da bandeira. Por exemplo: 'Criar'.
 * @Parametro {Número} [valor] O valor em hexadecimal desta bandeira.
 */
Utilitarios.prototype.adcUmaBandeiraParaModelo = function(modelo, bandeira, tipo, valor) {
  this.bandeiras.adcBandeiraParaModelo(modelo, bandeira, tipo, valor);
};

/* @Método [Público] verificarSePossuiAcesso().
 *
 * Verificamos aqui as bandeiras de acesso a este determinado modelo.
 *
 * @Parametro {Texto} [modelo] O modelo que possui as bandeiras.
 * @Parametro {Pilha} [tipos] Os tipos de acesso requisitado. Por exemplo 'Listar'.
 * @Retorna {falso|verdadeiro} falso se não houver acesso, verdadeiro caso contrário.
 */
Utilitarios.prototype.verificarSePossuiAcesso = function(modelo, tipos, valor) {
  return this.bandeiras.sePossuiAcesso(modelo, tipos, parseInt(valor, 16));
};

/* @Método [Público] autenticarPeloToken(). 
 *
 * Realiza a autenticação de deteminado usuário pelo token informado.
 *
 * @Parametro {Texto} [token] Aquele token utilizado para autenticação.
 * @Parametro {Função} [cd] Será chamada após a autenticação.
 */
Utilitarios.prototype.autenticarPeloToken = function (token, cd) {
  var seTerminou = false;  // Informa quando validação estiver terminada.
  var dadosUsuario = null; // Dados do usuário.
  var seValidado = false;  // Informamos se o usuário foi validado.
  
  var ponte = function(seConfere, usuario) {
    if (seConfere) {
      // Nosso usuário foi validado com sucesso.
      dadosUsuario = usuario;
      seValidado = seConfere;
    } 
    // Quando realizado nossa verificação então continuamos a execução.
    seTerminou = true;
  }
  
  // Verificamos o token.
  this.autenticacaoUsuario.verificarUsuarioPeloToken(token, ponte);
  
  // Percorre laço enquanto não estiver realizado tudo. Infelizmente, 
  // isso é necessário porque o sequelize é assincrono.
  deasync.loopWhile(function(){
    return !seTerminou;
  });
  
  // Retornamos se o usuário foi validade com sucesso e seus dados.
  // Caso não foi validado retornamos null nos dados.
  cd(seValidado, dadosUsuario);
};

/* @Método [Público] autenticarPeloJid(). 
 * 
 * Realiza a autenticação do usuário pelo JID. Se o usuário conferir, vamos retornar suas informações com a função cd(), 
 * juntamente com o valor da sua bandeira de acesso a um determinado modelo.
 *
 * @Parametro {Texto} [modeloRota] O modelo onde iremos pegar as bandeiras de acesso do usuário.
 * @Parametro {Texto} [jid] O identificador do usuário. Composto de local@dominio.
 * @Parametro {Texto} [senha] Senha deste usuário.
 * @Parametro {Função} [cd] Será chamada assim que a verificação estiver terminada.
 */
Utilitarios.prototype.autenticarPeloJid = function(modeloRota, jid, senha, cd) { 
  var seTerminou = false;  // Informa quando validação estiver terminada.
  var dadosUsuario = null; // Dados do usuário.
  var seValidado = false;  // Informamos se o usuário foi validado.
  
  var ponte = function(seConfere, usuario) {
    if (seConfere) {
      // Nosso usuário foi validado com sucesso.
      dadosUsuario = usuario;
      seValidado = seConfere;
    } 
    // Quando realizado nossa verificação então continuamos a execução.
    seTerminou = true;
  }

  // Verificamos jid e senha.
  this.autenticacaoUsuario.verificarUsuarioPeloJid(modeloRota, jid, senha, ponte);
  
  // Percorre laço enquanto não estiver realizado tudo. Infelizmente, 
  // isso é necessário porque o sequelize é assincrono.
  deasync.loopWhile(function(){
    return !seTerminou;
  });
  
  // Retornamos se o usuário foi validade com sucesso e seus dados.
  // Caso não foi validado retornamos null nos dados.
  cd(seValidado, dadosUsuario);
};
 
/* @Método [Público] buscarUmToken(). 
 *
 * Realiza a busca do token em cookies ou na requisição.
 *
 * @Parametro {Objeto} [req] Contêm dados de determinada requisição.
 * @Parametro {Objeto} [req.params] Contêm dados passados nos parametros da requisição.
 * @Parametro {Texto} [req.params.token] O valor do token passado no parametro da requisição.
 * @Parametro {Objeto} [req.body] Contêm os dados passados no corpo da requisição.
 * @Parametro {Texto} [req.body.token] O valor do token passado no corpo da requisição.
 * @Parametro {Objeto} [req.session] Contêm os dados de determinada sessão.
 * @Parametro {Texto} [req.session.token] O valor do token que está na sessão armazenado em um cookie.
 */
Utilitarios.prototype.buscarUmToken = function(req) {
  var token = null;
    
  // Aqui nós tentaremos acessar um token já existente em um cookie.
  if (this.seForUtilizarCookie && req.session && req.session.token) {
    token = req.session.token;
  } else {
    // Tentamos pegar o token informado no corpo, parametros ou no cabeçalho da requisição.
    token = (req.body && req.body.token) || (req.params && req.params.token) || req.headers['x-access-token'];
  }
  return token;
};

module.exports = Utilitarios;