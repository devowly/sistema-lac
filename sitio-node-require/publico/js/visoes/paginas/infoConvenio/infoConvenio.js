'use strict'

/* @arquivo infoConvenio.js */

/* Versão 0.0.1-Beta */

define([
  'jquery',
  'backbone',
  'underscore',
  'bootstrap',
  'visoes/paginas/infoConvenio/infoConvenioTitulo',
  'text!/js/templantes/paginas/infoConvenio/Visao.InfoConvenio.html'
], function($, Backbone, _, Bootstrap, VisaoInfoConvenioTitulo, Templante){
  
  /* Responsável por aprensentar informação  do convenio.
   */
  var InfoConvenio = Backbone.View.extend({

    templante: _.template(Templante),
    
    initialize: function () {
      this.render();
    },

    render: function () {
      // Renderiza este template
      this.$el.html(this.templante());
      
      // Adicionamos o titulo.
      $('div#informacao-convenio-titulo', this.el).append(new VisaoInfoConvenioTitulo().render().el); 
      
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

  return InfoConvenio;
});
