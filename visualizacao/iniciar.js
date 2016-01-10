'use strict'

/* @arquivo iniciar.js */

/* Versão 0.0.1-Beta
 * - Como fazer para separar a parte das visões do nosso servidor rest? (issue #41) [FEITO]
 */
 
var fs = require('fs');
var pasta = require('path');
var configuracao = require('jsconfig');
var pastaConfiguracaoPadrao = pasta.join(__dirname, "/configuracao/configuracao.js");
var express = require('express');
var http = require('http');
var https = require('https');
var morgan = require('morgan');

// Parametros do ambiente
configuracao.set('env', {
  DOMAIN: 'domain',
  PORT: ['port', parseInt],
  SSLPORT: ['sslPort', parseInt]
});

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
 * @Parametro {Objeto} [args] Argumento passados
 * @Parametro {Objeto} [opcs] As opções dos argumentos.
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
  
  /* Aqui temos a nossa chave e certificado. Foi utilizado a ferramenta openssl provida pelo git. 
   * O comando para cria-los: openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout privatekey.key -out certificate.crt
   * @Veja https://stackoverflow.com/questions/2355568/create-a-openssl-certificate-on-windows
   */
  var chavePrivada  = fs.readFileSync('certificados/' + configuracao.server.certificates.privateKey, 'utf8');
  var certificado = fs.readFileSync('certificados/' + configuracao.server.certificates.certificate, 'utf8');
  var credenciais = {key: chavePrivada, cert: certificado};
  
  // Utilizamos o bodyParser para receber requisições POST ou PUT.
  // Lembre-se de manter o limit do body em 200kb para nos precaver dos ataques de negação de serviço.
  var bodyParser = require('body-parser');
  aplic.use(bodyParser.json({limit: configuracao.server.limit}));
  aplic.use(bodyParser.urlencoded({limit: configuracao.server.limit, extended: false}));
  
  // Porta ao qual iremos receber requisições http.  
  aplic.set('port', process.env.PORT || configuracao.server.port);
  
  // Porta ao qual iremos receber requisições https.  
  aplic.set('sslPort', process.env.SSLPORT || configuracao.server.sslPort);
  
  // Iremos servir as páginas do diretorio "/admin"
  aplic.use('/admin', express.static(pasta.join(__dirname, 'admin')));  
  
  // Iremos servir as páginas do diretorio "/publico"
  aplic.use('/', express.static(pasta.join(__dirname, 'publico')));
  
  // Adicionamos isso para realizar o registro de requisições.
  aplic.use(morgan('combined'));
  
  // Espera pelos eventos do sistema operacional.
  var eventosSistema = require('./utilitarios/EventosSistema');
 
  // Iniciamos aqui a escuta pelos eventos de sinalização e ou excessão.
  eventosSistema.iniciar();
  
  console.log('Carregando o servidor HTTP e HTTPS.');
  
  // Inicia o servidor HTTP e começa a esperar por conexões.
  aplic.server = http.createServer(aplic);
  aplic.server.listen(aplic.get('port'), function () {
    console.log("Servidor express carregado e escutando na porta " + aplic.get('port'));
  });
  
  // Inicia o servidor HTTPS e começa a esperar por conexões.
  aplic.serverSsl = https.createServer(credenciais, aplic);
  aplic.serverSsl.listen(aplic.get('sslPort'), function () {
    console.log("Servidor express carregado e escutando na porta " + aplic.get('sslPort'));
  });
  
});