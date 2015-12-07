'use strict'

/* @arquivo barraNavegacao.js */

/* Versão 0.0.1-Beta */

define([
  'jquery',
  'backbone',
  'underscore',
  'text!/js/templantes/base/barraNavegacao/Visao.BarraNavegacao.html'
], function($, Backbone, _, Templante) {
  
  /* @Visão BarraNavegacao
   *
   * @Descriçao Responsavel por lidar com a barra de navegação
   */
  var BarraNavegacao = Backbone.View.extend({

    templante: _.template(Templante),
     
    initialize: function () {
      this.render();
    },

    render: function () {
      
      // Renderiza este templante
      this.$el.html(this.templante());
    },

    selecionarItemMenu: function (itemMenu) {
      // Remove seleção atual
      $('#navbar .nav li').removeClass('active');
      
      // Seleciona item da barra de navegação
      if (itemMenu) {
          $('#' + itemMenu).addClass('active');
      }
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

  return BarraNavegacao;
}); 