'use strict';

/* @Arquivo RegistradorEventos.js
 * 
 * Aqui faremos o registro para cada um dos eventos dos objetos relacionados a determinado 
 * gerente de conexões, incluindo as rotas, gerenciamento de sessão, rotas S2S, as conexões etc.
 * @veja http://xmpp.org/extensions/xep-0160.html
 */

var registrador = require('./Registrador')('RegistradorEventos');

function RegistradorEventos() {
  this.seLigar = true; // <umdez> Deveria haver uma forma de pegar este valor no arquivo de configurações.
}

/* Se for ligado irá fazer o registro dos eventos para um dado servidor.
 *
 * @Parametro {GerenConex} O determinado gerenciador de conexões em que iremos registrar os eventos
 */
RegistradorEventos.prototype.adcRegistroEventosPara = function (GerenConex) {
  
  if (!this.seLigar) {
    return;
  }
  
  var formatarRegistro = function(stream, mensagem) {
    return [ stream.streamId, mensagem].join(' '); 
  }  
	  
  GerenConex.on('connect', function(stream) {
    registrador.debug(formatarRegistro(stream, 'Conectado'));

    stream.on('online', function() {
      registrador.debug(formatarRegistro(stream, 'online ' + stream.jid));
    });

    // Evento disparado quando stream realizar conexão
    stream.on('connect', function () {
      registrador.debug(formatarRegistro(stream, 'online ' + stream.jid) ); 
    });
	
    // Evento disparado quando stream realiza autenticação.
    stream.on('authenticate', function(opcs, chamarDepois) {
      registrador.debug('Autenticação do stream.');
    });
	
    // Evento disparado quando o stream requisita registro para determinado JID
    stream.on('register', function(opcs, chamarDepois) {
      registrador.debug('Registro requisitado pelo stream.');
    });
	
    // Evento disparado quando stream desconecta do servidor
    stream.on('disconnect', function () {
      console.log('Stream desconectado');
    });

    // Evento disparado quando conexão do stream for finalizada
    stream.on('end', function () {
      // A conexão é finalizada e então fechada.
      // @veja http://nodejs.org/api/net.html#net_event_end
      registrador.debug('Conexão do stream fechada');
    });

    // Evento disparado quando stream está online.
    stream.on('online', function () {
      registrador.debug('Stream online: ' + stream.jid.toString());
    });

    // Evento disparado quando a conexão do stream foi fechada
    stream.on('close', function () {
      registrador.debug('Stream fechou conexão');
    });

    // Evento disparado quando chega uma mensagem enviada pelo stream remetente
    stream.on('stanza', function (stanza) {
      registrador.debug('mensagem recebida : ' + stanza.toString());
    });
  });

  GerenConex.on('s2sReady', function(s2s) {
    // console.log("S2S ready");
    // s2s.on("newStream", function(stream) {
    // console.log("New Stream");
    // });
	// <umdez> evento obsoleto?
  });

  GerenConex.on('c2sRoutersReady', function(router) {
    // <umdez> Evento Obsoleto?
  })

  // Evento ao desconectar, quando um stream desconecta.
  GerenConex.on('disconnect', function() {
    // <umdez> Este evento está obsoleto?
    registrador.debug('Stream desconectado');
  });
};

module.exports = RegistradorEventos;
