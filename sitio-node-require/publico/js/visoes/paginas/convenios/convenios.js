'use strict'

/* @arquivo convenios.js */

/* Versão 0.0.1-Beta */

define([
  'jquery',
  'backbone',
  'underscore',
  'bootstrap',
  'text!/js/templantes/paginas/convenios/Visao.Convenios.html'
], function($, Backbone, _, Bootstrap, Templante){
  

  /* Responsavel por lidar com a visão de convenios.
   */
  var Convenios = Backbone.View.extend({

    templante: _.template(Templante),
    
    attributes: {
      
    },
    
    initialize: function () {
      this.render();
    },

    render: function () {
      // Renderiza este template
      this.$el.html(this.templante());
      return this;
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
  return Convenios;
});