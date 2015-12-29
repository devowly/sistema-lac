'use strict'

/* @arquivo iniciar.js */

/* Versão 0.0.1-Beta
 * - Adicionar caracteristica de adicionar https quando realizar login. (issue #32) [AFAZER]
 * - Adicionar caracteristica de aceitar determinadas origens utilizando o módulo cors. (issue #26) [FEITO] 
 * - Procurar maneira ideal de interação deste serviço com os serviços providos pelo servidor-xmpp. (issue #21) [AFAZER]
 * - Servir as páginas do painel de administração utilizando o Express. (issue #19) [FEITO]
 */

var fs = require('fs');
var pasta = require('path');
var configuracao = require('jsconfig');
var pastaConfiguracaoPadrao = pasta.join(__dirname, "/configuracao/configuracao.js");
var express = require('express');
var sessao = require('express-session');
var http = require('http');
var https = require('https');
var morgan = require('morgan');
var ServidorXmpp = require('servidor-xmpp');
var jwt = require('jsonwebtoken');

// Carregamos o nosso registrador
var registrador = require('./fonte/nucleo/registrador')('iniciar');

// Parametros do ambiente
configuracao.set('env', {
  DOMAIN: 'domain',
  PORT: ['port', parseInt],
});

/* Aqui temos a nossa chave e certificado. Foi utilizado a ferramenta openssl provida pelo git. 
 * O comando para cria-los: openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout privatekey.key -out certificate.crt
 * @Veja https://stackoverflow.com/questions/2355568/create-a-openssl-certificate-on-windows
 */
var chavePrivada  = fs.readFileSync('certificados/servidorHttp.key', 'utf8');
var certificado = fs.readFileSync('certificados/servidorHttp.crt', 'utf8');
var credenciais = {key: chavePrivada, cert: certificado};

/* Nossas opções para configuração pela linha de comando. 
 */
configuracao.cli({
  configuracao: ['c', "pasta de onde iremos carregar o arquivo de configuracao", 'path', pastaConfiguracaoPadrao],
  porta: ['server.port', ['p', "porta do servidor http", 'int']]
});

// Aqui carregamos o arquivo de configuração
configuracao.defaults(pastaConfiguracaoPadrao);

/* Carregamos a assincronamente a nossa configuração e prosseguimos com nossos serviços.
 *
 * @Parametro {args} Argumento passados
 * @Parametro {opcs} As opções dos argumentos.
 */
configuracao.load(function (args, opcs) {

  // Carrega um arquivo de configuração pelos argumentos.
  if(args.length > 0) {
    opcs.configuracao = args[args.length - 1];
  }

  // Faz a união ou substituição da configuração com os dados informados pelo usuário.
  if(opcs.configuracao !== pastaConfiguracaoPadrao) {
    configuracao.merge(require(opcs.configuracao));
  }

  // Iniciamos o servidor express
  var aplic = express();
  
  // Necessário usar isto para a aceitação de requisições das origens permitidas. @Veja https://www.npmjs.com/package/cors
  var cors = require('cors');
  aplic.use(cors({
    origin: configuracao.server.cors.origin  // Origens aceitas por este servidor express.
  , methods:  ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS']  // Métodos aceitos.
  , allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token', 'X-Requested-With', 'Accept', 'Accept-Version', 'Content-Length', 'Content-MD5', 'Date', 'X-Api-Version']
  , credentials: true
  }));
  
  // Necessário utilizarmos sessão. @Veja https://github.com/expressjs/session
  aplic.use(sessao({
    secret: 'MySuperSessionSecret',
    cookie: {
      httpOnly: true,  // A presença desta bandeira vai pedir com que o navegador não permita que um script do lado cliente acesse e manipule este cookie.
      secure: true  // Informa para o navegador para somente enviar este cookie em requisições que utilizam https.
    }
  }));
  
  // Utilizamos o bodyParser para receber requisições POST ou PUT.
  // Lembre-se de manter o limit do body em 200kb para nos precaver dos ataques de negação de serviço.
  var bodyParser = require('body-parser');
  aplic.use(bodyParser.json({limit: configuracao.server.limit}));
  aplic.use(bodyParser.urlencoded({limit: configuracao.server.limit, extended: false}));
  
  // Porta ao qual iremos receber conexões.  
  aplic.set('port', process.env.PORT || configuracao.server.port);
  
  // Iremos servir as páginas do diretorio "/admin"
  aplic.use('/admin', express.static(pasta.join(__dirname, 'admin')));  
  
  // Iremos servir as páginas do diretorio "/publico"
  aplic.use('/', express.static(pasta.join(__dirname, 'publico')));
  
  // Adicionamos isso para realizar o registro de requisições.
  aplic.use(morgan('combined'));
  
  // Espera pelos eventos do sistema operacional.
  var eventosSistema = require('./utilitarios/EventosSistema');
  
  // Chamamos o arquivo principal, ele vai carregar os outros arquivos principais do servidor.
  var sitio = require('./fonte/iniciador/principal');
  
  sitio.prosseguir(configuracao, aplic, jwt, function() {
    
    // Iniciamos aqui a escuta pelos eventos de sinalização e ou excessão.
    eventosSistema.iniciar();
    
    registrador.debug('Carregando o servidor HTTP, HTTPS e XMPP.');
    
    // Inicia o servidor HTTP e começa a esperar por conexões.
    aplic.server = http.createServer(aplic);
    aplic.server.listen(aplic.get('port'), function () {
      registrador.debug("Servidor express carregado e escutando na porta " + aplic.get('port'));
    });
    
    // Inicia o servidor HTTPS e começa a esperar por conexões.
    aplic.serverSsl = https.createServer(credenciais, aplic);
    aplic.serverSsl.listen(443, function () {
      registrador.debug("Servidor express carregado e escutando na porta " + 443);
    });
    
    // Iniciar servidor XMPP.
    ServidorXmpp.inicializar(configuracao).then(function(){
      ServidorXmpp.carregar(function() {
        registrador.debug('Iniciou servidor xmpp com sucesso!');
      });
    });
    
  });
  
});