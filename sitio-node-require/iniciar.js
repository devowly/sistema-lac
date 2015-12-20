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
  
  var SAIDA_EXITO = 0, SAIDA_FRACASSO = 1; // Códigos de saida
  
  /* Função chamada antes do encerramento completo do processo. Aqui temos as rotinas a 
   * serem realizadas para um encerramento elegante.
   */
  var encerrarElegantemente = function () {
    return SAIDA_EXITO;
  };
  
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
   
  process.addListener('uncaughtException', function (erro) {
    var codigo = encerrarElegantemente();
    process.exit(codigo);
  });
  
  /* Nos sistemas compativeis com o padrão POSIX, é utilizado o padrão básico de sinais. Os sinais geralmente são pre-fixados com SIG.
   * Aqui estaremos interessados em esperar por 5 sinais, eles são: SIGINT, SIGHUP, SIGQUIT, SIGABRT e o SIGTERM. 
   *
   * Cada um deles *sinaliza* para uma condição que é enviada do Sistema Operacional para o nosso processo. 
   * Quando o sinal for recebido, geralmente iniciaremos o desligamento do nosso processo. 
   *
   * Assim que todas as rotinas necessárias para um desligamento elegante forem realizadas, nós iremos chamar o process.exit().
   * Sem o process.exit() o processo não irá desligar, portanto, é importante utilizarmos este método. Lembre-se que existem dois
   * tipos de códigos utilizados no encerramento que são o SAIDA_EXITO para informar sucesso e o SAIDA_FRACASSO para informar que houve erro.
   *
   * @Veja http://heyrod.com/snippets/node-js-process-on-sigint.html
   * @Veja https://en.wikipedia.org/wiki/Unix_signal#Handling_signals
   *
   * Obervação: Todos estes sinais farão o nosso processo ser desligado. Podemos tentar realizar então o desligamento elegante do nosso processo.
   */

  // O SIGINT é tipicamente relacionado ao uso do CTRL + C.
  process.addListener('SIGINT', function() {
    console.log('SIGNIT recebido.');
    var codigo = encerrarElegantemente();
    process.exit(codigo);
  });
  
  // O SIGHUP é tipicamente relacionado com o fechamento do terminal.
  process.addListener('SIGHUP', function() {
    console.log('SIGHUP recebido.');
    var codigo = encerrarElegantemente();
    process.exit(codigo);
  });
  
  // O SIGQUIT é enviado ao processo pelo seu terminal de controle quando o usuário requisita que seu processa saia e realize um core dump.
  process.addListener('SIGQUIT', function() {
    console.log('SIGQUIT recebido.');
    var codigo = encerrarElegantemente();
    process.exit(codigo);
  });
  
  // O SIGABRT é tipicamente enviado ao processo para ele abortar.
  process.addListener('SIGABRT', function() {
    console.log('SIGABRT recebido.');
    var codigo = encerrarElegantemente();
    process.exit(codigo);
  });

  // O SIGTERM é enviado ao processo para a requisição de seu termino. Ao contrário do SIGKILL, esse sinal pode ser manipulado
  // e interpretado ou até mesmo ser ignorado pelo processo. Aqui podemos realizar tranquilamente o termino do nosso processo. 
  process.addListener('SIGTERM', function() {
    console.log('SIGTERM recebido.');
    var codigo = encerrarElegantemente();
    process.exit(codigo);
  });
  
  // Realizamos o termino do nosso processo.
  process.addListener('exit', function(codigo) {
    console.log('Encerrando o processo com ' + (codigo === SAIDA_EXITO ? 'sucesso' : 'falha') + '.');
  });
});