'use strict'

/* @arquivo centralAtendimento.js */

/* Versão 0.0.1-Beta */

define([
  'jquery',
  'backbone',
  'underscore',
  'bootstrap',
  'text!/js/templantes/paginas/centralAtendimento/Visao.CentralAtendimento.html'
], function($, Backbone, _, Bootstrap, Templante){
  
  /* Responsavel por lidar com a página da central de atendimento
   */
  var CentralAtendimento = Backbone.View.extend({
    
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
  
  return CentralAtendimento;
});