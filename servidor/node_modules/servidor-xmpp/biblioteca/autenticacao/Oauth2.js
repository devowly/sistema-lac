'use strict';

var util = require('util');
var Autenticador = require('./Autenticador');
var Promessa = require('bluebird');
var JID = require('node-xmpp-core').JID;
var superagent = require('superagent');
var registrador = require('../nucleo/Registrador')('AutenticadorOauth2');

/* Implementação de autenticação do tipo OAUTH2 no lado servidor.
 *
 * Atenção: Esta implementação é planejada para desenvolvimento e testes.
 * não é para ser utilizada no produto final.
 */
function OAUTH2(configuracoes) {
  this.configuracoes = configuracoes;
  this.url = configuracoes.url;
  this.contentType = configuracoes.contentType || 'application/json';
  this.tokenType = configuracoes.tokenType ||  'Bearer';
  this.uidTag = configuracoes.uidTag ||  'login';

}
util.inherits(OAUTH2, Autenticador);

OAUTH2.prototype.nome = 'OAUTH2';

OAUTH2.prototype.seCorresponder = function (metodo) {
  if (metodo === 'X-OAUTH2') {
    return true;
  }
  return false;
};

/* Realizamos a verificação do token utilizado pelo usuário. Para isso nós conectamos ao servidor OAUTH2.
 * 
 * @Parametro {nomeUsuario} O nome do usuário que fez a requisição de conexão.
 * @Parametro {oauthToken} Token informado pelo usuário.
 * @Parametro {cd} Função chamada ao ser verificado o token informado pelo usuário.
 */
OAUTH2.prototype.verificarToken = function (nomeUsuario, oauthToken, cd) {
  var esteObj = this;

  registrador.debug('oauth2 chama: ' + this.configuracoes.url);

  // Conectamos ao servidor OAUTH2 para verificarmos o token utilizado nesta autenticação.
  superagent
    .get(esteObj.url)                           // URL do servidor OAUTH2
    .send({})
    .set('content-type', esteObj.contentType)
    .set('Authorization', esteObj.tokenType + ' ' + oauthToken)
    .end(function (error, res) {
      if (error ||  res.status !== 200) {
        registrador.error(error);
        cd('autenticação oauth falhou');
      } else {
        // Sabemos que o token é valido, verificamos agora se o usuário também é valido.
        var usr = esteObj.verificarUsuario(nomeUsuario, res.body);
        // var usr = res.body;

        cd(null, usr);
      }
    });
};

/* Verificamos aqui o usuário.
 *
 * @Parametro {nomeUsuario} O nome do usuário do usuário que fez a requisição
 * @Parametro {conteudo} Objeto do usuário que faremos a verificação do token
 * @Retorna Nulo se o usuário não corresponde com o nome de usuário, ou objeto do usuário.
 */
OAUTH2.prototype.verificarUsuario = function (nomeUsuario, conteudo) {
  registrador.debug('Verificando usuário: ' + nomeUsuario + ' -> ' + conteudo[this.uidTag]);

  function comparaUsuario(nomeUsuario1, nomeUsuario2) {
    if (!nomeUsuario1 ||  !nomeUsuario2) {
      return false;
    }
    try {
      return nomeUsuario1.toString().toLowerCase() === nomeUsuario2.toString().toLowerCase();
    } catch (err) {
      return false;
    }
  }

  // Se usamos xmpp, então verificamos se o JID confere com o nome do usuário
  if (nomeUsuario && comparaUsuario(conteudo[this.uidTag], nomeUsuario)) {
    registrador.debug('O nome do usuário confere');
    conteudo.nomeUsuario = nomeUsuario;
    return conteudo;
  } // Para uma requisição no api nós temos apenas o token, mas isso já é o bastante
  else if (!nomeUsuario && conteudo[this.uidTag]) {
    registrador.debug('sem nome do usuário');
    conteudo.nomeUsuario = conteudo[this.uidTag];
    return conteudo;
  } else {
    registrador.debug('Autenticação não teve sucesso.');
    return null;
  }
};

OAUTH2.prototype.autenticar = function (opcs) {

  var nomeUsuario = null;

  // Gera nome de usuário ldap
  if (opcs.jid) {
    //registrador.debug(nomeUsuario);
    nomeUsuario = new JID(opcs.jid.toString(), false).getLocal(true);
  } else if (opcs.nomeUsuario) {
    nomeUsuario = opcs.nomeUsuario;
  }

  opcs.nomeUsuario = nomeUsuario;

  var esteObj = this;
  return new Promessa(function (deliberar, recusar) {
    registrador.info('OAUTH2 autenticação ', opcs.oauth_token); // jshint ignore:line
    esteObj.verificarToken(opcs.nomeUsuario, opcs.oauth_token, function (err, usuario) { // jshint ignore:line
      // error
      if (err) {
        recusar('OAUTH2 Não foi possível autenticar o usuário: ' + opcs.nomeUsuario);
      }
      // O token não confere com o nome de usuário.
      else if (usuario === null) {
        recusar('OAUTH2 Não foi possível autenticar o usuário: ' + opcs.nomeUsuario);
      }
      // tudo está okay!
      else {
        registrador.debug('OAUTH2: token ' + opcs.oauth_token + ' é válido ' + JSON.stringify(usuario)); // jshint ignore:line
        deliberar(usuario);
      }
    });
  });
};

module.exports = OAUTH2;
