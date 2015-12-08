'use strict'

/* @arquivo unidadeAba.js */

/* Versão 0.0.1-Beta */

define([
  'jquery',
  'backbone',
  'underscore',
  'bootstrap',
  'text!/js/templantes/paginas/unidades/Visao.UnidadeAba.html'
], function($, Backbone, _, Bootstrap, Templante){
  
  /* Responsável por acrescentar a aba da unidade.
   *
   * @Elemento 
   * <li role="presentation" class="active"> </li> 
   *
   * @Carrega:
   *   <a href="#Unidade1" aria-controls="Unidade1" role="tab" data-toggle="tab">
   *     CENTRO 
   *     <span class="fa fa-map-marker fa-1x" aria-hidden="true"></span>
   *   </a>
   * 
   */
  var UnidadeAba = Backbone.View.extend({
    
    templante: _.template(Templante),
    
    tagName: 'li',
    
    attributes: {
      'id': 'aba',
      'role': 'presentation'
    },
    
    initialize: function () {
      
    },

    render: function () {
      var meuModelo = this.model;
      
      // Coloca classe active na primeira aba.
      if (meuModelo.indice == 0) $(this.el).addClass('active');
      
      this.$el.html(this.templante(meuModelo));
       
      return this;
    }

  });
  
  return UnidadeAba;
});