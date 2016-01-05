'use strict'

/* @arquivo infoConvenioTitulo.js */

/* Versão 0.0.1-Beta */

define([
  'jquery',
  'backbone',
  'underscore',
  'bootstrap',
  'text!/js/templantes/paginas/infoConvenio/Visao.InfoConvenioTitulo.html'
], function($, Backbone, _, Bootstrap, Templante){
  
  /* Responsável por acrescentar o título com o nome do convênio
   *
   * @Elemento <div></div>
   *
   * @Carrega 
   * <h1 class="page-header">Informações do convênio: <small> <%= nome %> </small></h1>
   */
  var InfoConvenioTitulo = Backbone.View.extend({
    
    templante: _.template(Templante),
    
    tagName: 'div',
    
    attributes: {
     
    },
    
    initialize: function () {
      
    },

    render: function () {
      var meuModelo = this.model;
      
      this.$el.html(this.templante(meuModelo));
           
      return this;
    }

  });
  
  return InfoConvenioTitulo;
});