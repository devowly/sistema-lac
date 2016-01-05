'use strict'

/* @Arquivo rodape.js
 */

/* Versão 0.0.1-Beta */

define([
  'jquery',
  'backbone',
  'underscore',
  'text!/js/templantes/base/rodape/Visao.Rodape.html'
], function($, Backbone, _, Templante){
  
  /* Responsavel pela apresentação do rodape do sitio.
   */
  var Rodape = Backbone.View.extend({
    
    templante: _.template(Templante),
  
    initialize: function () {
      this.render();
    },

    render: function () {
      // Renderiza este templante
      this.$el.html(this.templante());
    },

    /* Iniciamos componentes para esta visão. 
     * Os componentes podem ser do bootstrap, jQuery e outros frameworks utilizados
     */ 
    _iniciarMeusComponentes: function(){
      
    },

    /* Iniciamos as escutas de eventos para esta visão. 
     * Os eventos podem ser de elementos do bootstrap, jQuery e outros frameworks utilizados
     */ 
    _iniciarMinhaEscutaEventos: function() {
      
    }

  });
  
  return Rodape;
  
});