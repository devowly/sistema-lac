'use strict'

/* @arquivo iniciar.js */

/* Versão 0.0.1-Beta
 * - Procurar maneira ideal de interação deste serviço com os serviços providos pelo servidor-xmpp. (issue #21) [AFAZER]
 * - Servir as páginas do painel de administração utilizando o Express. (issue #19) [FEITO]
 */

var pasta = require('path');
var configuracao = require('jsconfig');
var pastaConfiguracaoPadrao = pasta.join(__dirname, "/configuracao/configuracao.js");
var express = require('express');
var http = require('http');
var morgan = require('morgan');
var ServidorXmpp = require('servidor-xmpp');
var jwt = require('jsonwebtoken');
var EventosSistema = require('./utilitarios/EventosSistema');

// Carregamos o nosso registrador
var registrador = require('./fonte/nucleo/registrador')('iniciar');

// Parametros do ambiente
configuracao.set('env', {
  DOMAIN: 'domain',
  PORT: ['port', parseInt],
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
  
  // Utilizamos o bodyParser para receber requisições POST ou PUT.
  // Lembre-se de manter o limit do body em 100kb para nos precaver dos ataques de negação de serviço.
  var bodyParser = require('body-parser');
  aplic.use(bodyParser.json({limit: '100kb'}));
  aplic.use(bodyParser.urlencoded({limit: '100kb', extended: false}));
  
  // Porta ao qual iremos receber conexões.  
  aplic.set('port', process.env.PORT || configuracao.server.port);
  
  // Iremos servir as páginas do diretorio "/admin"
  aplic.use('/admin', express.static(pasta.join(__dirname, 'admin')));  
  
  // Iremos servir as páginas do diretorio "/publico"
  aplic.use('/', express.static(pasta.join(__dirname, 'publico')));
  
  // Adicionamos isso para realizar o registro de requisições.
  aplic.use(morgan('combined'));
  
  // Espera pelos eventos do sistema operacional.
  var eventosSistema = new EventosSistema();
  
  // Chamamos o arquivo principal, ele vai carregar os outros arquivos principais do servidor.
  var sitio = require('./fonte/iniciador/principal');
  
  sitio.prosseguir(configuracao, aplic, jwt, function() {
    
    // Iniciamos aqui a escuta pelos eventos de sinalização e ou excessão.
    eventosSistema.iniciar();
    
    registrador.debug('Carregando o servidor HTTP e XMPP.');
    
    // Inicia o servidor HTTP e começa a esperar por conexões
    aplic.server = http.createServer(aplic);
    aplic.server.listen(aplic.get('port'), function () {
      registrador.debug("Servidor express carregado e escutando na porta " + aplic.get('port'));
    });
    
    // Iniciar servidor XMPP.
    ServidorXmpp.inicializar(configuracao).then(function(){
      ServidorXmpp.carregar(function() {
        registrador.debug('Iniciou servidor xmpp com sucesso!');
      });
    });
    
  });
  
});