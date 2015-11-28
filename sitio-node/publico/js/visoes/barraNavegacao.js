'use strict'

Visao.BarraNavegacao = Backbone.View.extend({

  initialize: function () {
    this.render();
  },

  render: function () {
    // Renderiza este template
    $(this.el).html(this.template());
    return this;
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