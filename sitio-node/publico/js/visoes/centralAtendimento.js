'use strict'

Visao.CentralAtendimento = Backbone.View.extend({

  initialize: function () {
    this.render();
  },

  render: function () {
    // Renderiza este template
    $(this.el).html(this.template());
    return this;
  },

  /* @função iniciarComponentes()
   * @descrição Iniciamos componentes para esta visão. 
   *  Os componentes podem ser do bootstrap, jQuery e outros frameworks utilizados
   */ 
  iniciarComponentes: function(){
    
  },
  
  /* @função iniciarEscutaEventos()
   * @descrição Iniciamos as escutas de eventos para esta visão. 
   *  Os eventos podem ser de elementos do bootstrap, jQuery e outros frameworks utilizados
   */ 
  iniciarEscutaEventos: function() {
    
  }

});