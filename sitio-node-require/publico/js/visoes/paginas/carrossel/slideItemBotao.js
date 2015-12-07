'use strict'

/* @Arquivo slideItemBotao.js */

/* Versão 0.0.1-Beta */
 
define([
  'jquery',
  'backbone',
  'underscore'
], function($, Backbone, _){

  /* @Visão SlideItemBotao()
   * 
   * @descricao Botão do slide do carrossel.
   *
   * @Elemento 
   * <a class="btn btn-lg btn-success" href="examesOrientacoes.html" role="button">Ver lista de exames disponíveis</a> 
   */
  var SlideItemBotao = Backbone.View.extend({

    tagName: 'a',
    
    attributes: {
      'class': 'btn btn-lg btn-success',
      'role': 'button'
    },
    
    initialize: function () {
      
      // Coloca endereço do link
      $(this.el).attr('href', this.model.endereco_botao);
      
      // Coloca o texto do link
      $(this.el).append(this.model.texto_botao);
    },
      
    render: function () {
      var meuModelo = this.model;
      
      // Iniciamos os nossos componentes
      this._iniciarMeusComponentes(meuModelo);
      
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
    _iniciarMeusComponentes: function(meuModelo){
      
    }

  });
  
  return SlideItemBotao;
});