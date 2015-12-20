'use strict'

/* @arquivo iniciar.js */

/* Versão 0.0.1-Beta
 * - Procurar maneira ideal de interação deste serviço com os serviços providos pelo servidor-xmpp. (issue #21) [AFAZER]
 * - Servir as páginas do painel de administração utilizando o Express. (issue #19) [AFAZER]
 * - Adicionar caracteristica para tratar erros. (issue #18) [AFAZER]
 */

var pasta = require('path');
var configuracao = require('jsconfig');
var pastaConfiguracaoPadrao = pasta.join(__dirname, "/configuracao/configuracao.js");
var express = require('express');
var http = require('http');
var morgan = require('morgan');
var ServidorXmpp = require('servidor-xmpp');

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
    
    ServidorXmpp.inicializar(configuracao).then(function(){
      ServidorXmpp.carregar(function() {
        console.log('Iniciou servidor xmpp com sucesso!');
      });
    });
    
  });
  
  /* Este evento é disparado sempre que houver uma excessão que não foi possivel de ser tratada.
   * É importantissimo para descobrirmos novos erros no nosso sistema. A partir das informações que nos
   * foram informadas, podemos utilizar para a remoção de erros do sistema.
   *
   * Aqui temos algumas ações a serem feitas. Por exemplo:
   * - Realizamos o registro do erro para ser apurado mais tarde.
   * - Informar em tempo real os desenvolvedores reponsáveis o erro ocorrido, atravéz de uma mensagem de email?
   * - Executar ações para que haja um encerramento elegante deste sistema.
   *
   * Após as ações acima serem realizadas, podemos utilizar o módulo forever. Com este módulo o sistema é
   * Automaticamente re-ligado após o encerramento elegante. @Veja https://github.com/nodejitsu/forever
   *
   * @Parametro {erro} Um objeto contendo informações da excessão ocorrida. Podendo ser utilizada para o registro 
   *                   do erro que aconteceu. Este objeto também possui uma propriedade (erro.stack) que é uma pilha
   *                   que pode ser utilizada para mostrar o caminho do erro que gerou esta excessão.
   */
  process.addListener("uncaughtException", function (erro) {
    
  });
  
});