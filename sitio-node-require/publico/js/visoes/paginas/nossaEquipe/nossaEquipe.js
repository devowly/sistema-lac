'use strict'

/* @arquivo nossaEquipe.js */

/* Versão 0.0.1-Beta */

define([
  'jquery',
  'backbone',
  'underscore',
  'bootstrap',
  'text!/js/templantes/paginas/nossaEquipe/Visao.NossaEquipe.html'
], function($, Backbone, _, Bootstrap, Templante){
  

  /* Responsável por apresentar lista dos funcionários.
   */
  var NossaEquipe = Backbone.View.extend({

    templante: _.template(Templante),
    
    initialize: function () {
      this.render();
    },

    render: function () {
      // Renderiza este template
      this.$el.html(this.templante());
      
      // Iniciamos aqui os nossos componentes
      this._iniciarMeusComponentes();
      
      // Iniciamos aqui a escuta pelos eventos.
      this._iniciarMinhaEscutaEventos();
      
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

  return NossaEquipe;

});