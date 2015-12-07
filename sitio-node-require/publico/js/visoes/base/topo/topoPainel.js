'use strict'

/* @Arquivo topoPainel.js */

/* Versão 0.0.1-Beta */
 
define([
  'jquery',
  'backbone',
  'underscore'
], function($, Backbone, _){
 
  /* Adicionamos aqui o painel do topo do sitio. O painel pode ter conteudo
   * diferente, depende de que o usuário possa estar autenticado ou não autenticado.
   *
   * @Elemento 
   * <a class="btn btn-success btn-lg pull-right">Resultados</a>
   */
  var TopoPainel = Backbone.View.extend({

    tagName: 'button',
    
    attributes: {
      'class': 'btn btn-success btn-lg pull-right'
    },
    
    initialize: function () {
      
    },

    render: function () {
      
      // Coloca endereço do link
      this.$el.attr('href', '#');

      // Adiciona texto do botão    
      this.$el.append('Resultados');
      
      // Iniciamos os nossos componentes
      this._iniciarMeusComponentes();
      
      return this;
    },
    
    /* Os eventos desta visão */
    events: {
      
    },
    
    /* Iniciamos componentes para esta visão. 
     * Os componentes podem ser do bootstrap, jQuery e outros frameworks utilizados
     */ 
    _iniciarMeusComponentes: function(){
      
      
    }

  });
  
  return TopoPainel;
});