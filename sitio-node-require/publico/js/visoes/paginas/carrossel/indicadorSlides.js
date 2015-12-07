'use strict'

/* @Arquivo indicadorSlides.js */

/* Versão 0.0.1-Beta */
 
define([
  'jquery',
  'backbone',
  'underscore',
  'bootstrap'
], function($, Backbone, _, Bootstrap){
  
  /* Responsável por adicionar cada um dos indicadores do slide.
   *
   * @Elemento: <li data-target="#oCarrossel" data-slide-to="0" class="active"></li> 
   */
  var IndicadorSlides = Backbone.View.extend({

    tagName: 'li',
    
    attributes: {
      'data-target': '#oCarrossel'
    },
    
    initialize: function () {
   
      $(this.el).attr('data-slide-to', this.model.indice);
    },

    render: function () {
      
      var modelo = this.model;
    
      // Coloca classe active no primeiro modelo.
      if (modelo.indice === 0) $(this.el).addClass('active');
       
      return this;
    }

  });
  
  return IndicadorSlides;
});