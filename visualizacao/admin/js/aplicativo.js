'use strict'

/* @arquivo aplicativo.js */

/* Versão 0.0.1-Beta
 * - Adicionar o endereço do servidor diretamente no ajaxPrefilter. (issue #49) [FEITO]
 */

/* @Objeto Aplicativo.
 *
 * Aqui temos o nosso objeto base do nosso aplicativo com nível global. Aqui iremos acrescentar propriedades,
 * métodos, eventos e tudo mais que necessite de ser acessado globalmente.
 -----------------------------------------------------------------------------------------------------------------*/
var Aplicativo = {};

define([
  'jquery'
, 'underscore'
, 'roteador' // Requisitamos o arquivo roteador.js
, 'backbone'
, 'configuracao'
], function($, _, Roteador, Backbone, Configuracao){
  
  /* Aqui acrescentamos os eventos ao nosso objeto Aplicativo. Assim fica fácil utilizarmos eventos em diversos módulos 
   * do nosso aplicativo, porque assim não será necessário passar o seu valor para cada módulo.
   *
   * @Veja http://pragmatic-backbone.com/using-events-like-a-baws
   * @Veja https://lostechies.com/derickbailey/2012/04/03/revisiting-the-backbone-event-aggregator-lessons-learned/
   *
   * @Propriedade {Evento} [eventosGlobais] Extenção dos eventos do Backbone.
   */
  Aplicativo.eventosGlobais = _.extend({}, Backbone.Events);
  
  /* @Função inicializar().
   *
   * Responsável por inicializar o nosso roteador e também por sobrescrever o método sync() e o ajaxPrefilter().
   -------------------------------------------------------------------------------------------------------------*/
  var inicializar = function(){
    
    /* @Variavel {Método} [ponteSync] Armazena o método sync(). */
    var ponteSync = Backbone.sync;
    
    /* Sobrescreve o método sync() do Backbone com alcançe global. Estamos utilizando o serviço CORS.
     * @Veja http://naleid.com/blog/2012/10/29/overriding-backbone-js-sync-to-allow-cross-origin-resource-sharing-cors
     * Este método é utilizado para persistir o estado do modelo para o servidor. 
     *
     * @Parametro {Objeto} [metodo] O método utilizado.
     * @Parametro {Objeto} [modelo] O modelo do Backbone.
     * @Parametro {Objeto} [opcoes] Configuração de opções de requisição.
     */
    Backbone.sync = function(metodo, modelo, opcoes) {
      opcoes || (opcoes = {});
      
      // Habilitamos aqui o acesso a outros dominios.
      if (!opcoes.crossDomain) {
        opcoes.crossDomain = true;
      }
      // Agora deixamos claro a necessidade de credenciais.
      if (!opcoes.xhrFields) {
        opcoes.xhrFields = {withCredentials:true};
      }
      // Passa os argumentos novamente para o método sync.
      return ponteSync(metodo, modelo, opcoes);
    };
    
    /* Sobrescreve todas as requisições ajax do jQuery com alcançe global. Neste método é possivel customizarmos
     * as opções do ajax ou modificar as opções já existentes antes de cada requisição enviada e antes que sejam 
     * processadas pelo $.ajax(). @Veja https://api.jquery.com/jquery.ajaxprefilter/
     *
     * @Parametro {Objeto} [opcoes] As opções da requisição.
     * @Parametro {Objeto} [opcoesOriginais] São as opções não modificadas que são passadas para o $.ajax().
     * @Parametro {Objeto} [jqXHR] Objeto desta requisição.
     */
    $.ajaxPrefilter(function(opcoes, opcoesOriginais, jqXHR) {
      /* Caso queira adicionar um dominio base para o sitio. Este dominio será utilizada nas requisições ajax
       * de todas requisições deste sitio.
       */
      opcoes.url = Configuracao.cors.serverAddressSsl + opcoes.url;
      
      // Caso queira utilizar credenciais:
      opcoes.xhrFields = {
        withCredentials: true
      };
    });
    
    // Iniciamos o nosso roteador aqui.
    Roteador.inicializar();
  };

  return { 
    inicializar: inicializar
  };
});