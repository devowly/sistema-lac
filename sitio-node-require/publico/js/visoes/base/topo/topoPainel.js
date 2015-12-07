'use strict'

/* @Arquivo topoPainel.js */

/* Versão 0.0.1-Beta */
 
define([
  'jquery',
  'backbone',
  'underscore'
], function($, Backbone, _){
 
  /* @Visão TopoPainel()
   *
   * @descricao Adicionamos aqui painel do topo do sitio
   *
   * @Elemento 
   * <a class="btn btn-success btn-lg pull-right">Resultados</a>
  **/
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
    
    /* EVENTOS DA NOSSA VISÃO
    ---------------------------------------------*/
    events: {
      
    },
    
    /* @função _iniciarMeusComponentes()
     * @descrição Iniciamos componentes para esta visão. 
     *  Os componentes podem ser do bootstrap, jQuery e outros frameworks utilizados
     */ 
    _iniciarMeusComponentes: function(){
      
      
    }

  });
  
  return TopoPainel;
});