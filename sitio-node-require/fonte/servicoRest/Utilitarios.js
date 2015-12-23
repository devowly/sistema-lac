'use strict'
var deasync = require('deasync');
var Bandeiras = require('./Bandeiras');
var AutenticacaoUsuario = require('./AutenticacaoUsuario');

/* Utilitarios diversos para nossas fontes REST.
 *
 * @Arquivo Utilitarios.js
 */
 
/* Utilitários diversos para as fontes Rest.
 *
 * @Parametro {bancoDados} Objeto do nosso banco de dados.
 * @Parametro {jwt} Nosso módulo Json Web Token.
 * @Parametro {autenticacao} Dados para autenticação.
 */
var Utilitarios = function (bancoDados, jwt, autenticacao) {

  // Armazena a classe do banco de dados sequelize.
  this.bd = bancoDados; 
  
  // Utilizaremos os tokens para autenticação.
  this.jsonWebToken = jwt;
  
  // Configuração da autenticação.
  this.autentic = autenticacao;
  
  this.autenticacaoUsuario = new AutenticacaoUsuario(bancoDados, jwt, autenticacao); 
  
  this.bandeiras = new Bandeiras(); 
};

Utilitarios.prototype.inicializar = function () {
  
};

/* Acrescenta uma bandeira na lista. 
 *
 * @Parametro {modelo} O modelo que possui as bandeiras.
 * @Parametro {bandeira} O nome desta bandeira.
 * @Parametro {tipo} O tipo de acesso da bandeira. Por exemplo: 'Criar'.
 * @Parametro {valor} O valor em hexadecimal desta bandeira.
 */
Utilitarios.prototype.adcUmaBandeiraParaModelo = function(modelo, bandeira, tipo, valor) {
  this.bandeiras.adcBandeiraParaModelo(modelo, bandeira, tipo, valor);
};

/* Verificamos aqui as bandeiras de acesso a este determinado modelo.
 *
 * @Parametro {modelo} O modelo que possui as bandeiras.
 * @Parametro {tipos} Os tipos de acesso requisitado. Por exemplo 'Listar'.
 * @Retorna falso se não houver acesso, verdadeiro caso contrário.
 */
Utilitarios.prototype.verificarSePossuiAcesso = function(modelo, tipos, valor) {
  return this.bandeiras.sePossuiAcesso(modelo, tipos, valor);
};

/* Realiza a autenticação de deteminado usuário pelo token informado.
 *
 * @Parametro {token} Aquele token utilizado para autenticação.
 * @Parametro {modeloRota} Cada modelo possuirá bandeiras de acesso e nós iremos acessar o valor das bandeiras de determinado modelo.
 * @Parametro {cd} A função chamada após a autenticação.
 */
Utilitarios.prototype.autenticarPeloToken = function (token, modeloRota, cd) {
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
  this.autenticacaoUsuario.verificarUsuarioPeloToken(token, modeloRota, ponte);
  
  // Percorre laço enquanto não estiver realizado tudo. Infelizmente, 
  // isso é necessário porque o sequelize é assincrono.
  deasync.loopWhile(function(){
    return !seTerminou;
  });
  
  cd(seValidado, dadosUsuario);
};

/* Realiza a autenticação do usuário pelo JID. Se o usuário conferir, vamos retornar suas informações com a função cd(), 
 * juntamente com o valor da sua bandeira de acesso a um determinado modelo.
 *
 * @Parametro {modeloRota} O modelo onde iremos pegar as bandeiras de acesso do usuário.
 * @Parametro {usrjid} O identificador do usuário. Composto de local@dominio.
 * @Parametro {senha} A senha deste usuário.
 * @Parametro {cd} Função que será chamada assim que a verificação estiver terminada.
 */
Utilitarios.prototype.autenticarPeloJid = function(modeloRota, usrjid, senha, cd) { 
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
  this.verificarUsuarioPeloJid(modeloRota, usrjid, senha, ponte);
  
  // Percorre laço enquanto não estiver realizado tudo. Infelizmente, 
  // isso é necessário porque o sequelize é assincrono.
  deasync.loopWhile(function(){
    return !seTerminou;
  });
  
  cd(seValidado, dadosUsuario);
};

module.exports = Utilitarios;