'use strict'

/* @Arquivo slideItem.js */

/* Versão 0.0.1-Beta */
 
define([
  'jquery',
  'backbone',
  'underscore'
], function($, Backbone, _){
  
  /* @Visão: SlideItem
   *
   * @Descrição: para cada um dos indicadores nós temos um item do carrossel. 
   * Este item contem a imagem de slide, titulo, sub-titulo e botão. 
   *
   * @Elemento: <div class="item active"> </div>
   *
   * @Carrega:
   * <img class="first-slide" alt="Exames laboratoriais" data-src="holder.js" src="imagem.jpg"/>
   * <div class="container">
   *   <div class="carousel-caption">
   *     <h1>Vários exames laboratoriais</h1>
   *     <h2>Mais de 50 tipos de exames laboratoriais.</h2>
   *     <p><!-- Botão de slide aqui--></p>
   *   </div>
   * </div> 
   */ 
  var SlideItem = Backbone.View.extend({
    
    tagName: 'div',
    
    attributes: {
      'class': 'item'
    },
    
    initialize: function () {
      
    },

    render: function () {
      var modelo = this.model;
      
      if (modelo.indice === 0) $(this.el).addClass('active');
      
      // pegamos a imagem na base 64.
      modelo.imagem_b64 = Global.utilitarios.pegarImagemB64(modelo.imagem_arquivo, 'IMAGEMS_SLIDES');
      
      $(this.el).html(this.template(modelo));
      
      // Adicionamos o botão
      $('div.carousel-caption p', this.el).append(new Visao.SlideItemBotao({model: modelo}).render().el);
        
      return this;
    },
    
    /* EVENTOS DA NOSSA VISÃO
    ---------------------------------------------*/
    events: {
      
    },
    
    /* @função _iniciarMeusComponentes()
     *
     * @descrição Iniciamos componentes para esta visão. 
     *  Os componentes podem ser do bootstrap, jQuery e outros frameworks utilizados
     */ 
    _iniciarMeusComponentes: function(){
      
    },
    
    /* @função _iniciarMinhaEscutaEventos()
     *
     * @descrição Iniciamos as escutas de eventos para esta visão. 
     *  Os eventos podem ser de elementos do bootstrap, jQuery e outros frameworks utilizados
     */ 
    _iniciarMinhaEscutaEventos: function() {
      
    }

  });

  return SlideItem;
});