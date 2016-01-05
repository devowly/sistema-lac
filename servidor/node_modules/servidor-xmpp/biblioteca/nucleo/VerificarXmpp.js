'use strict';

var Registrador = require('./Registrador')('VerificarXmpp');
var JID = require('node-xmpp-core').JID;

var VerificarXmpp = function () {};

VerificarXmpp.prototype = {

  /* Realiza verificação do remetente, faz uma comparação do JID remetente com o JID real.
   * Assim se descobre se ele for válido ou inválido.  
   * @veja http://tools.ietf.org/html/rfc3920#section-4.7.3 <invalid-from/>
   *
   * @Parametro {stream} Um stream do node-xmpp.
   * @Parametro {stanza} Uma stanze em XML do node-xmpp.
   * @Retorna um erro do tipo xmpp.
   */
  remetenteInvalido: function (stream, stanza) {
    var remetenteJID = new JID(stanza.attrs.from);
    var streamJID = stream.jid;

    Registrador.debug('Verificação do remetente JID ' + remetenteJID + ' com JID de cliente ' + streamJID);

    if (!streamJID.equals(remetenteJID)) {
      Registrador.error('Verificação dos JIDs falhou');
      return 'invalid-from';
    } else {
      return null;
    }
  }
};

module.exports = new VerificarXmpp();
