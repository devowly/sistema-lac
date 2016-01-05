'use strict';

/* @Arquivo GerenciaConexao.js
 *
 * Realiza o carregamento das conexões com base naquilo que foi configurado.
 */

var registrador = require('../nucleo/Registrador')('GerenciaConexao');
var baseBiblioteca = require('../indice');
var Promessa = require('bluebird');
var pem = require('pem');
var xmpp = require('node-xmpp-server');

function GerenciaConexao() {}

/* Carregamos aqui os certificados, serão utilizados nas conexões do tipo tcp.
 *
 * @Retorna {Promessa} De recusa ou delibaração.
 */
GerenciaConexao.prototype.carregaCertificado = function () {
  return new Promessa(function (deliberar, recusar) {
    pem.createCertificate({
      days: 1,
      selfSigned: true,
      organization: 'node-xmpp team',
      organizationUnit: 'development',
      commonName: 'node-xmpp.org'

    }, function (err, chaves) {
      if (err) {
        recusar(err);
      } else {
        deliberar(chaves);
      }
    });
  });
};

/* Nossa conexão do tipo tcp.
 *
 * @Parametro {dominio} O dominio que será utilizado por esta conexão.
 * @Parametro {chaves} As chaves do certificado.
 * @Parametro {configuracao} A nossa configuração para este tipo de conexão.
 * @Retorna Objeto deste tipo de conexão.
 */
GerenciaConexao.prototype.tcp = function (dominio, chaves, configuracao) {
  // C2S com encriptação TLS
  var cs2 = null;
  var tls = null;
  tls = {
    key: chaves.serviceKey + '\n',
    cert: chaves.certificate + '\n'
  };
  tls.ca = tls.cert;

  cs2 = new xmpp.C2SServer({
    'port': configuracao.port,
    'domain': dominio,
    'requestCert': true,
    'rejectUnauthorized': false,
    'tls': tls
  });

  cs2.nome = 'tcp + tls';
  return cs2;
};

/* Nossa conexão do tipo bosh.
 *
 * @Parametro {dominio} O dominio que será utilizado por esta conexão.
 * @Parametro {chaves} As chaves do certificado.
 * @Parametro {configuracao} A nossa configuração para este tipo de conexão.
 * @Retorna Objeto deste tipo de conexão.
 */
GerenciaConexao.prototype.bosh = function (dominio, chaves, configuracao) { // jshint ignore:line
  var configuracoesBosh = null;
  
  if (configuracao.port) {
    configuracoesBosh = {
      'port': configuracao.port,
	    'domain': dominio
    };
  } else {
    registrador.error('Não foi possivel determinar a porta para o servidor BOSH');
  }

  // Servidor BOSH 
  var bosh = new xmpp.BOSHServer(configuracoesBosh);

  bosh.nome = 'bosh';
  return bosh;
};

/* Nossa conexão do tipo websocket.
 *
 * @Parametro {dominio} O dominio que será utilizado por esta conexão.
 * @Parametro {chaves} As chaves do certificado.
 * @Parametro {configuracao} A nossa configuração para este tipo de conexão.
 * @Retorna Objeto deste tipo de conexão.
 */
GerenciaConexao.prototype.websocket = function (dominio, chaves, configuracao) {
  // Servidor Websocket
  var ws = new xmpp.WebSocketServer({
    'port': configuracao.port,
    'domain': dominio,
    'autostart': false
  });
  
  ws.nome = 'websocket';
  return ws;
};

/* Percorremos as diversas conexões disponiveis no arquivo de configuração e as carregamos.
 * Os tipos de autenticação disponiveis até o momento são: tcp, bosh e websocket.
 *
 * @Parametro {rotaConexao} Objeto que lida com as rotas de conexões.
 * @Parametro {configuração} A configuração por onde iremos pegar os tipos de conexão.
 * @Retorna {Promessa} Promessa de deliberação ou recusa.
 */
GerenciaConexao.prototype.carregar = function (rotaConexao, configuracao) {
  var esteObjeto = this;
  return new Promessa(function (deliberar, recusar) {
    
	  // Carrega configuração para a gerencia de conexão
    var gerConConfiguracao = configuracao.connection;
    
    if (gerConConfiguracao && gerConConfiguracao.length > 0) {

      esteObjeto.carregaCertificado().then(function (chaves) {

        // Percorre cada tipo de conexões
        gerConConfiguracao.forEach(function (item) {

          if (esteObjeto[item.type]) {
            var gerCon = esteObjeto[item.type](item.domain, chaves, item);
            if (gerCon) {
              // Para cada uma das conexões nós registramos os tipos de autenticação que podem ser utilizadas.
              gerCon.registerSaslMechanism(xmpp.auth.Plain);
              gerCon.registerSaslMechanism(xmpp.auth.XOAuth2);
              gerCon.registerSaslMechanism(xmpp.auth.Anonymous);
              
              // Acrescentamos este tipo de conexão a rotaConexao.
              rotaConexao.adcGerenciaConexao(gerCon);
            }
          } else {
            registrador.warn(item.type + ' não é suportado como gerencia de conexão');
          }
        });
      });
      deliberar();
    } else {
      recusar('Não possui esta gerencia de conexões definida na configuração');
    }
  });
};
module.exports = GerenciaConexao;
