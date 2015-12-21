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
  
  // Utilizamos isso para receber requisições POST ou PUT.
  var bodyParser = require('body-parser');
  aplic.use(bodyParser.json());
  aplic.use(bodyParser.urlencoded({ extended: false }));
  
  // Porta ao qual iremos receber conexões.  
  aplic.set('port', process.env.PORT || configuracao.server.port);
  
  // Iremos servir as páginas do diretorio "/publico"
  aplic.use(express.static(pasta.join(__dirname, 'publico')));
  
  // Adicionamos isso para realizar o registro de requisições.
  aplic.use(morgan('combined'));
  
  // Chamamos o arquivo principal, ele vai carregar os outros arquivos principais do servidor.
  var sitio = require('./fonte/iniciador/principal');
  
  sitio.prosseguir(configuracao, aplic, function() {
    
    registrador.debug('Carregando o servidor HTTP e XMPP.');
    
    // Inicia o servidor HTTP e começa a esperar por conexões
    aplic.server = http.createServer(aplic);
    aplic.server.listen(aplic.get('port'), function () {
      console.log("Servidor express carregado e escutando na porta " + aplic.get('port'));
    });
    
    // Iniciar servidor XMPP.
    ServidorXmpp.inicializar(configuracao).then(function(){
      ServidorXmpp.carregar(function() {
        console.log('Iniciou servidor xmpp com sucesso!');
      });
    });
    
  });
  
  /* Os códigos de saida para sistema POSIX. 0 para exito e 1 para fracasso.
   */
  var SAIDA_EXITO = 0, SAIDA_FRACASSO = 1; 
  
  /* Função chamada antes do encerramento completo do processo. Aqui temos as rotinas a 
   * serem realizadas para um encerramento elegante.
   *
   * Neste caso, temos algumas ações a serem feitas. Por exemplo:
   * - Realizamos o registro do sinal recebido e o horário. 
   * - Informar em tempo real os desenvolvedores reponsáveis que o sistema está sendo encerrado, atravéz de uma mensagem de email?
   * - Executar ações para que haja um encerramento elegante deste sistema. (Desligar os serviços, armazenamento de qualquer dados necessário etc).
   *
   * Após tudo estiver completo, se não houve nada de errado nós retornamos SAIDA_EXITO. Em caso de qualquer erro nós retornamos SAIDA_FRACASSO.
   */
  var aoReceberSinalEncerrarElegantemente = function () {
    return SAIDA_EXITO;
  };
  
  /* Este evento é disparado sempre que houver uma excessão que não foi possivel de ser tratada.
   * É importantissimo para descobrirmos novos erros no nosso sistema. A partir das informações que nos
   * foram informadas, podemos utilizar para a remoção de erros do sistema.
   *
   * É importante lembrar que uma vez que uma excessão não tratada aparecer, o aplicativo vai estar em um estado indefinido.
   * É possivel que aquela parte do código onde houve o erro, nunca irá completar, e seu aplicativo não vai recomeçar.
   * Também existe uma variedade de coisas estranhas que podem acontecer. (Pode ser um problema com o banco de dados? Sistema de arquivos? Memoria corrompida?).
   * Algumas destas situações podem ser incrivelmente dificeis de se diagnosticar, muito menos de se resolver. Por este motivo, 
   * é recomendado e mais seguro apenas encerrar rapidamente e re-ligar o aplicativo rapidamente.
   *
   * Aqui temos algumas ações a serem feitas. Por exemplo:
   * - Realizamos *rapidamente* o registro do erro para ser apurado mais tarde. 
   * - Desligar *rapidamente* o sistema.
   *
   * Após as ações acima serem realizadas, podemos utilizar o módulo forever. Com este módulo o sistema é
   * Automaticamente re-ligado após o encerramento do processo. @Veja https://github.com/nodejitsu/forever
   *
   * Apesar de não é o nosso caso, mas uma forma de manter o aplicativo executando - mesmo quando ocorrer uma excessão não tratada - seria
   * a utilização do modulo cluster, assim você terá vários (usualmente o número de núcleos do CPU) processos em execução paralela, então, quando um 
   * encerrar com erro, os outros ainda estarão em execução. Mantendo assim o aplicativo em execução. @Veja https://nodejs.org/api/cluster.html
   *   
   * @Parametro {erro} Um objeto contendo informações da excessão ocorrida. Podendo ser utilizada para o registro 
   *                   do erro que aconteceu. Este objeto também possui uma propriedade (erro.stack) que é uma pilha
   *                   que pode ser utilizada para mostrar o caminho do erro que gerou esta excessão.
   */
  process.addListener('uncaughtException', function (erro) {
    // <umdez> Falta apenas realizar registro do erro. para leitura posterior.
    
    // Neste caso, sempre retornar valor de fracasso.
    process.exit(SAIDA_FRACASSO); 
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
    var codigo = aoReceberSinalEncerrarElegantemente();
    process.exit(codigo);
  });
  
  // O SIGHUP é tipicamente relacionado com o fechamento do terminal.
  process.addListener('SIGHUP', function() {
    console.log('SIGHUP recebido.');
    var codigo = aoReceberSinalEncerrarElegantemente();
    process.exit(codigo);
  });
  
  // O SIGQUIT é enviado ao processo pelo seu terminal de controle quando o usuário requisita que seu processa saia e realize um core dump.
  process.addListener('SIGQUIT', function() {
    console.log('SIGQUIT recebido.');
    var codigo = aoReceberSinalEncerrarElegantemente();
    process.exit(codigo);
  });
  
  // O SIGABRT é tipicamente enviado ao processo para ele abortar.
  process.addListener('SIGABRT', function() {
    console.log('SIGABRT recebido.');
    var codigo = aoReceberSinalEncerrarElegantemente();
    process.exit(codigo);
  });

  // O SIGTERM é enviado ao processo para a requisição de seu termino. Ao contrário do SIGKILL, esse sinal pode ser manipulado
  // e interpretado ou até mesmo ser ignorado pelo processo. Aqui podemos realizar tranquilamente o termino do nosso processo. 
  process.addListener('SIGTERM', function() {
    console.log('SIGTERM recebido.');
    var codigo = aoReceberSinalEncerrarElegantemente();
    process.exit(codigo);
  });
  
  // Realizamos o termino do nosso processo. Neste caso, apenas informamos o valor de encerramento.
  process.addListener('exit', function(codigo) {
    console.log('Encerrando o processo com ' + (codigo === SAIDA_EXITO ? 'sucesso' : 'falha') + '.');
  });
});