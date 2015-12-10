'use strict'

/* @arquivo iniciar.js */

/* Versão 0.0.1-Beta
 */

var pasta = require('path');
var configuracao = require('jsconfig');
var pastaConfiguracaoPadrao = pasta.join(__dirname, "/configuracao/configuracao.js");
var express = require('express');
var http = require('http');
var morgan = require('morgan');

// Carregamos o nosso registrador
var registrador = require('./fonte/nucleo/registrador')('iniciar');

configuracao.defaults(pastaConfiguracaoPadrao);

// Parametros do ambiente
configuracao.set('env', {
  DOMAIN: 'domain',
  PORT: ['port', parseInt],
});

configuracao.cli({
  configuracao: ['c', "pasta para carregar arquivo de configuracao", 'path', pastaConfiguracaoPadrao],
  storage: ['storage', [false, "Não utilizar armazenamento"]],
  server: ['server', [false, "Não oferecer servidor express"]]
});

/* Carregamos a configuração e prosseguimos com nossos serviços.
 *
 * @Parametro {args} Argumento passados
 * @Parametro {opcs} As opções dos argumentos.
 */
configuracao.load(function (args, opcs) {

  // Carrega um arquivo de configuração pelo argv preservando o padrão
  if(args.length > 0) {
    opcs.configuracao = args[args.length - 1];
  }

  // Faz a união da configuração com os dados informados pelo usuário.
  if(opcs.configuracao !== pastaConfiguracaoPadrao) {
    configuracao.merge(require(opcs.configuracao));
  }

  // Iniciamos o servidor express
  var aplic = express();
  
  var bodyParser = require('body-parser');
  
  // Realiza a configuração do express 
  // Iremos servir as páginas do diretorio "/publico" 
  aplic.set('port', process.env.PORT || configuracao.server.port);
  aplic.use(bodyParser.json());
  aplic.use(bodyParser.urlencoded({ extended: false }));
  aplic.use(express.static(pasta.join(__dirname, 'publico')));
  aplic.use(morgan('combined'));
  
  // Chamamos o arquivo principal, ele vai carregar os outros arquivos principais do servidor.
  var sitio = require('./fonte/iniciador/principal');
  
  sitio.prosseguir(configuracao, aplic, function() {
    
    registrador.debug('Carregando servidor HTTP.');
    
    // Inicia o servidor HTTP e começa a esperar por conexões
    aplic.server = http.createServer(aplic);
    
    aplic.server.listen(aplic.get('port'), function () {
      console.log("Servidor express carregado e escutando na porta " + aplic.get('port'));
    });
    
  });
  
});