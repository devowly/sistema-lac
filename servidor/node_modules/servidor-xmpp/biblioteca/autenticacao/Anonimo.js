'use strict';

var util = require('util');
var Autenticador = require('./Autenticador');
var JID = require('node-xmpp-core').JID;
var Promessa = require('bluebird');
var registrador = require('../nucleo/Registrador')('AutenticadorAnonimo');

/* Implementação da autenticação no lado servidor utilizando método ANONYMOUS. 
 *
 * Atenção: Esta implementação é planejada para desenvolvimento e testes.
 * não é para ser utilizada no produto final.
 */
function Anonimo() {}
util.inherits(Anonimo, Autenticador);

Anonimo.prototype.nome = 'Anonimo';

Anonimo.prototype.seCorresponder = function (metodo) {
  if (metodo === 'ANONYMOUS') {
    return true;
  }
  return false;
};

Anonimo.prototype.autenticar = function (opcs) {
  registrador.debug('Autenticar');
  var esteObj = this;

  return new Promessa(function (deliberar, recusar) {

    var nomeUsuario = null;

    // pegamos o nome de usuário
    if (opcs.jid) {
      nomeUsuario = new JID(opcs.jid.toString()).getLocal();
    } else if (opcs.username) {
      nomeUsuario = opcs.username;
    }

    // Não é necessário verificar senha neste caso, pois o usuário é anonimo
    if (nomeUsuario) {
      deliberar(opcs); 
    }
    // error
    else {
      recusar('é necessário ao menos nome ou jid de usuário');
    }
  });
};

module.exports = Anonimo;
