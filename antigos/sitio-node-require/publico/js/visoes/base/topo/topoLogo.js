'use strict'

/* @Arquivo topoLogo.js */

/* Versão 0.0.1-Beta */

define([
  'jquery',
  'backbone',
  'underscore'
], function($, Backbone, _){
  
  /* Adicionamos aqui a imagem de logo do nossos sitio.
   *
   * @Elemento 
   * <img data-src="holder.js" src="<%= imagem %>"/>
  **/
  var TopoLogo = Backbone.View.extend({

    tagName: 'img',
    
    attributes: {
      'data-src': 'holder.js',
      'class': 'pull-left'
    },
    
    initialize: function () {
      
    },

    render: function () {
      var meuModelo = this.model;
      
      $(this.el).attr('src', meuModelo.imagem);
      
      return this;
    }

  });
  
  return TopoLogo;
});