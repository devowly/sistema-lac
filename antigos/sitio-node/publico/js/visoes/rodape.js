'use strict'

/* @Arquivo rodape.js
 */

 /* Versão 0.0.1-Beta */

/* @Visão: Rodape
 *
 * @Descriçao: Responsavel pela apresentação do rodape do sitio.
 */

Visao.Rodape = Backbone.View.extend({

  initialize: function () {
    this.render();
  },

  render: function () {
    // Renderiza este template
    $(this.el).html(this.template());
    return this;
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