'use strict'

window.VisaoQuemSomos = Backbone.View.extend({

  initialize: function () {
    this.render();
  },

  render: function () {
    // Renderiza este template
    $(this.el).html(this.template());
    return this;
  },
  
  /* Aqui selecionamos um item do menu vertical */
  selecionarItemNavegacao: function(item) {
    
    // Remove seleção atual
    $('#menuVertEsquerdo .nav li').removeClass('active');
    
    // Seleciona item da barra de navegação vertical
    if (item) {
      $('#' + item).addClass('active');
    }
  }
  
});