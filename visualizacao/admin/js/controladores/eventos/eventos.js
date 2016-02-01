'use strict'

/* 
 * @arquivo eventos.js
 */ 

/* Versão 0.0.1-Beta
 */
 
define([
  'jquery'
, 'backbone'
], function($, Backbone){
  
  /* @Controlador Eventos().
   *
   * Aqui acrescentamos os eventos locais para um determinado canal. Assim ficará fácil para manipular 
   * os eventos que são locais a um determinado escopo.
   *
   * @Veja http://pragmatic-backbone.com/using-events-like-a-baws
   * @Veja https://lostechies.com/derickbailey/2012/04/03/revisiting-the-backbone-event-aggregator-lessons-learned/
   *
   --------------------------------------------------------------------------------------------*/
  var Eventos = function() {
     
  };
  
  /* @Método {Publico} [adcNovoCanal].
   * Realiza a adição de eventos para determinado canal.
   *
   * @Parametro {Texto} [canal] Nome do canal
   */
  Eventos.prototype.adcNovoCanalDeEventos = function(canal) {
    if (Aplicativo['Canais'][canal] === undefined) {
      return (Aplicativo['Canais'][canal] = _.extend({}, Backbone.Events));
    }
    return Aplicativo['Canais'][canal];
  };
  
  /* @Método {Publico} [pegarUmCanalDeEventosPeloNomeDoCanal].
   * Faz o retorno de determinado canal de eventos.
   *
   * @Parametro {Texto} [canal] Nome do canal.
   * @Retorna {Evento|Nulo} Um evento relacionado a um determinado canal ou nulo.
   */
  Eventos.prototype.pegarUmCanalDeEventosPeloNomeDoCanal = function(canal) {
    return Aplicativo['Canais'][canal];
  };
  
  /* @Método {Publico} [adcEsperaPorEventoEmUmCanal].
   * Adicionamos aqui a espera por qualquer evento no canal especificado.
   * 
   * @Parametro {Texto} [canal] Nome do canal onde o evento será adicionado.
   * @Parametro {Texto} [msgDeEvento] Uma mensagem atrelada ao evento. 
   * @Parametro {Função} [fnc] A função chamada quando o evento for disparado.
   * @Retorna {Boleano} Verdadeiro em caso de sucesso, ou falso em caso de alguma coisa não funcionar.
   */
  Eventos.prototype.adcEsperaPorEventoEmUmCanal = function(canal, msgDeEvento, fnc) {
    if (Aplicativo['Canais'][canal]) {
      Aplicativo['Canais'][canal].on(msgDeEvento, fnc);
      return true;
    } 
    return false;
  };
  
  /* @Método {Publico} [dispararEventoEmUmCanal].
   * Disparamos aqui um evento em um determinado canal.
   * 
   * @Parametro {Texto} [canal] Nome do canal onde o evento será adicionado.
   * @Parametro {Texto} [msgDeEvento] Uma mensagem atrelada ao evento. 
   * @Parametro {Objeto} [dados] Um objeto JSON com dados a serem enviados.
   * @Retorna {Boleano} Verdadeiro em caso de sucesso, ou falso em caso de alguma coisa não funcionar.
   */
  Eventos.prototype.dispararEventoEmUmCanal = function(canal, msgDeEvento, dados) {
    if (Aplicativo['Canais'][canal]) {
      Aplicativo['Canais'][canal].trigger(msgDeEvento, dados);
      return true;
    } 
    return false;
  };
  
  return Eventos;
});