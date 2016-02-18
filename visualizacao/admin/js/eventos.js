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
  
  /* @Método {Publico} adcCanal().
   * Realiza a adição de eventos para determinado canal.
   *
   * @Parametro {Texto} [canal] Nome do canal
   */
  Eventos.prototype.adcCanal = function(canal) {
    if (Aplicativo['Canais'][canal] === undefined) {
      return (Aplicativo['Canais'][canal] = _.extend({}, Backbone.Events));
    }
    return Aplicativo['Canais'][canal];
  };
  
  /* @Método {Publico} pegarUmCanal().
   * Faz o retorno de determinado canal de eventos.
   *
   * @Parametro {Texto} [canal] Nome do canal.
   * @Retorna {Evento|Nulo} Um evento relacionado a um determinado canal ou nulo.
   */
  Eventos.prototype.pegarUmCanal = function(canal) {
    return Aplicativo['Canais'][canal];
  };
  
  /* @Método {Publico} subscrever().
   * Adicionamos aqui a espera por qualquer evento no canal especificado.
   * 
   * @Parametro {Texto} [canal] Nome do canal onde o evento será adicionado.
   * @Parametro {Texto} [msg] Uma mensagem atrelada ao evento. 
   * @Parametro {Função} [fnc] A função chamada quando o evento for disparado.
   * @Retorna {Boleano} Verdadeiro em caso de sucesso, ou falso em caso de alguma coisa não funcionar.
   */
  Eventos.prototype.subscrever = function(canal, msg, tipo, fnc, obj) {
    if (Aplicativo['Canais'][canal]) {
      if (tipo === 'sempreQuandoPublicado') {
        Aplicativo['Canais'][canal].on(msg, fnc, obj);
      } else if (tipo === 'quandoPublicado') {
        Aplicativo['Canais'][canal].once(msg, fnc, obj);
      } else {
        return false;
      }
      return true;
    } 
    return false;
  };
  
  /* @Método {Publico} publicar().
   * Disparamos aqui um evento em um determinado canal.
   * 
   * @Parametro {Texto} [canal] Nome do canal onde o evento será adicionado.
   * @Parametro {Texto} [msg] Uma mensagem atrelada ao evento. 
   * @Parametro {Objeto} [dados] Um objeto JSON com dados a serem enviados.
   * @Retorna {Boleano} Verdadeiro em caso de sucesso, ou falso em caso de alguma coisa não funcionar.
   */
  Eventos.prototype.publicar = function(canal, msg, param) {
    if (Aplicativo['Canais'][canal]) {
      Aplicativo['Canais'][canal].trigger(msg, param);
      return true;
    } 
    return false;
  };
  
  return Eventos;
});