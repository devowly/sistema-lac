'use strict'

Visao.LogoBotoes = Backbone.View.extend({

  initialize: function () {
    this.render();
  },

  render: function () {
    
    // Renderiza este template
    $(this.el).html(this.template({ imagem: Global.utilitarios.pegarImagemB64('logo.jpg') }));
    return this;
  }

});