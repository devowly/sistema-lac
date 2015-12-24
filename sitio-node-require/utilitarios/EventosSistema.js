'use strict';

/* @arquivo eventosSistema.js 
 *
 * Realiza a espera por eventos do sistema, estes eventos podem ser de excessão não tratada
 * ou de sinais do Sistema Operacional. Para cada um dos eventos, nós iremos trata-los 
 * para fazer o encerramento elegante do sistema.
 *
 * Lembre-se que este módulo deve ser o mais simples possível. Portanto, para o registro nós utilizaremos
 * o console.log().
 */

/* Versão 0.0.1-Beta 
 * - Adicionar a caracteristica de enviar email de alerta de erro em tempo real para os desenvolvedores responsáveis pelo sistema. (issue #22) [AFAZER]
 * - Adicionar a caracteristica de armazenar os erros de uma excessão não tratada. (issue #23) [AFAZER]
 * - Adicionar a caracteristica de um encerramento elegante do sistema. (issue #24) [AFAZER]
 * - Adicionar caracteristica para tratar erros. (issue #18) [AFAZER]
 */

/* Abstração da gerencia dos eventos para encerramento elegante do sistema.
 */
var EventosSistema = function () {
  
  // Os códigos de saida para sistema POSIX. 0 para exito e 1 para fracasso.
  this.SAIDA_EXITO = 0;
  this.SAIDA_FRACASSO = 1; 
};

/* O evento de saida do processo. Antes de encerrar o processo recebemos este evento.
 * Lembre-se que este método é sincrono, e não vai funcionar se adicionarmos qualquer
 * rotina assincrona nele.
 */
EventosSistema.prototype.iniciarEsperaPorEventoSaida = function () {
  
  var esteObjeto = this;
  
  /* Realizamos o termino do nosso processo. Neste caso, apenas informamos o valor de encerramento.
   *
   * @Parametro {codigo} Contendo valor de sucesso ou fracasso.
   */
  process.addListener('exit', function(codigo) {
    console.log('Encerrando o processo com ' + (codigo === esteObjeto.SAIDA_EXITO ? 'sucesso' : 'falha') + '.');
  });
};

/* Realiza o inicio da espera pelos eventos dos sinais do sistema.
 */
EventosSistema.prototype.iniciarEsperaPorEventosSinais = function () {
  var esteObjeto =  this;
 
 /*
  * Nos sistemas compativeis com o padrão POSIX, é utilizado o padrão básico de sinais. Os sinais geralmente são pre-fixados com SIG.
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
    var codigo = esteObjeto.aoReceberSinalEncerrarElegantemente();
    process.exit(codigo);
  });
  
  // O SIGHUP é tipicamente relacionado com o fechamento do terminal.
  process.addListener('SIGHUP', function() {
    console.log('SIGHUP recebido.');
    var codigo = esteObjeto.aoReceberSinalEncerrarElegantemente();
    process.exit(codigo);
  });
  
  // O SIGQUIT é enviado ao processo pelo seu terminal de controle quando o usuário 
  // requisita que seu processa saia e realize um core dump.
  process.addListener('SIGQUIT', function() {
    console.log('SIGQUIT recebido.');
    var codigo = esteObjeto.aoReceberSinalEncerrarElegantemente();
    process.exit(codigo);
  });
  
  // O SIGABRT é tipicamente enviado ao processo para ele abortar.
  process.addListener('SIGABRT', function() {
    console.log('SIGABRT recebido.');
    var codigo = esteObjeto.aoReceberSinalEncerrarElegantemente();
    process.exit(codigo);
  });

  // O SIGTERM é enviado ao processo para a requisição de seu termino. Ao contrário do SIGKILL,
  // esse sinal pode ser manipulado e interpretado ou até mesmo ser ignorado pelo processo. 
  // Aqui podemos realizar tranquilamente o termino do nosso processo. 
  process.addListener('SIGTERM', function() {
    console.log('SIGTERM recebido.');
    var codigo = esteObjeto.aoReceberSinalEncerrarElegantemente();
    process.exit(codigo);
  });

};

/* Método chamada antes do encerramento completo do processo. Aqui temos as rotinas a 
 * serem realizadas para um encerramento elegante.
 *
 * Neste caso, temos algumas ações a serem feitas. Por exemplo:
 * - Realizamos o registro do sinal recebido e o horário. 
 * - Informar em tempo real os desenvolvedores reponsáveis que o sistema está sendo encerrado, atravéz de uma mensagem de email?
 * - Executar ações para que haja um encerramento elegante deste sistema. (Desligar os serviços, armazenamento de qualquer dados necessário etc).
 *
 * @Retorna {codigo} Após tudo estiver completo, se não houve nada de errado nós retornamos SAIDA_EXITO.
 *                   Em caso de qualquer erro nós retornamos SAIDA_FRACASSO.
 */
EventosSistema.prototype.aoReceberSinalEncerrarElegantemente = function () {
  return this.SAIDA_EXITO;
};

/* Realiza o inicio da espera pelos eventos de excessões não tratadas do nosso processo.
 */
EventosSistema.prototype.iniciarEsperaPorEventosExcessao = function () {
  var esteObjeto = this;
  
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
  * Apesar de não ser o nosso caso, mas uma forma de manter o aplicativo executando - mesmo quando ocorrer uma excessão não tratada - seria
  * a utilização do modulo cluster, assim você terá vários (usualmente o número de núcleos do CPU) processos em execução paralela, então, quando um 
  * encerrar com erro, os outros ainda estarão em execução. Mantendo assim o aplicativo em execução. @Veja https://nodejs.org/api/cluster.html
  *   
  * @Parametro {erro} Um objeto contendo informações da excessão ocorrida. Podendo ser utilizada para o registro 
  *                   do erro que aconteceu. Este objeto também possui uma propriedade (erro.stack) que é uma pilha
  *                   que pode ser utilizada para mostrar o caminho do erro que gerou esta excessão.
  */
  process.addListener('uncaughtException', function (erro) {
    // <umdez> Falta apenas realizar registro do erro. para leitura posterior. (issue #23) [AFAZER]
    
    // Neste caso, sempre retornar valor de fracasso.
    process.exit(esteObjeto.SAIDA_FRACASSO); 
  });
};

/* Realizamos aqui o inicio do nosso serviço.
 */
EventosSistema.prototype.iniciar = function () {

  console.log('Iniciando serviço espera por eventos do sistema.');

  // Iniciamos a espera pelas excessões não tratadas.
  this.iniciarEsperaPorEventosExcessao();
  
  // Iniciamos a espera pelo evento único de saida do sistema.
  this.iniciarEsperaPorEventoSaida();
  
  // Iniciamos a espera pelos eventos.
  this.iniciarEsperaPorEventosSinais();
};

module.exports = EventosSistema;