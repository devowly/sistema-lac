'use strict'

/* @arquivo barraNavegacao.js */

/* Versão 0.0.1-Beta */

define([
  'jquery',
  'backbone',
  'underscore',
  'text!/js/templantes/base/barraNavegacao/Visao.BarraNavegacao.html'
], function($, Backbone, _, Templante) {
  
  /* Responsavel por lidar e apresentar com a barra de navegação
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

    /* Realiza a seleção de um item ou a remoção de seleção de todos items do menu.
     *
     * @Parametro (itemMenu) Identificador de determinado item do meu que será selecionado.
     *                       Se for null, nenhum item ficará selecionado.
     */
    selecionarItemMenu: function (itemMenu) {
      // Remove seleção atual
      $('#navbar .nav li').removeClass('active');
      
      // Seleciona item da barra de navegação
      if (itemMenu) {
          $('#' + itemMenu).addClass('active');
      }
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

  return BarraNavegacao;
}); 