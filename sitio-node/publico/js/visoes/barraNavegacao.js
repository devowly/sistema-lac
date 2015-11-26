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
  }

});