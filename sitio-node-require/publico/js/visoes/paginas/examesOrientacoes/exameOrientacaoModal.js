'use strict'

define([
  'jquery',
  'backbone',
  'underscore',
  'bootstrap'
], function($, Backbone, _, Bootstrap){
  

  /* @Elemento:
   * <div class="modal fade" id="ModalExemplo1" tabindex="-1" role="dialog" aria-labelledby="ModalExemplo1Etiqueta"> </div>
   *
   * @Carrega:
   *  <div class="modal-dialog" role="document">
   *    <div class="modal-content">
   *      <div class="modal-header" style="border-color: #5cb85c; color: #5cb85c;">
   *        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
   *        <h4 class="modal-title" id="ModalExemplo1Etiqueta">Orientações para o exame</h4>
   *      </div>
   *      <div class="modal-body">
   *        <p>Material: Sangue. </p>
   *        <p>
   *          Preparo:
   *          <ul>
   *            <li> Jejum de 8 horas. </li>
   *            <li> Informar medicamentos em uso. </li>
   *          </ul>
   *        </p>
   *      </div>
   *      <div class="modal-footer" style="border-color: #5cb85c;">
   *        <button type="button" class="btn btn-success" data-dismiss="modal">Fechar</button>
   *      </div>
   *    </div>
   *  </div>
   */ 
  var ExameOrientacaoModal = Backbone.View.extend({
    tagName: 'div',
    
    attributes: {
      'class': 'modal fade',
      'role': 'dialog',
      'tabindex': '-1'
    },
    
    initialize: function () {
      
    },

    render: function () {
      var meuModelo = this.model;
    
      $(this.el).attr('id', meuModelo.nome_elemento + meuModelo.id);
      $(this.el).attr('aria-labelledby', meuModelo.nome_elemento + meuModelo.id);
    
      // Carregamos o templante
      this.$el.html(this.template(meuModelo));
      
      return this;
    }

  });
  
  return ExameOrientacaoModal;
  
});