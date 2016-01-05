'use strict'

/* @arquivo unidadeAbaConteudo.js */

/* Versão 0.0.1-Beta */

define([
  'jquery',
  'backbone',
  'underscore',
  'bootstrap'
], function($, Backbone, _, Bootstrap){
  
  /* Acrescenta o conteudo de uma aba de uma unidade.
   *
   * @Elemento:
   * <div role="tabpanel" class="tab-pane active" id="Unidade1"> </div>
   *
   * @Carrega:
   * 
   *  <div class="col-md-3">
   *    <address>
   *      <strong>Laboratorio LAC</strong><br>
   *      Rua Coronel Spyer, Nº 509 - Centro<br>
   *      Montes Claros, MG. 39400-115<br>
   *      <abbr title="Phone">Fone:</abbr> (38) 3223-7636
   *    </address>
   *    <a href="mailto:#">lablac@laboratoriolac.com.br</a>
   *  </div>
   *  
   *  <div class="col-md-9">
   *    <div class="embed-responsive">
   *      <div id="mapaUnidade001" class="embed-responsive-item"></div>
   *    </div> 
   *  </div>
   *     
   */ 
  var UnidadeAbaConteudo = Backbone.View.extend({
    
    tagName: 'div',
    
    attributes: {
      'class': 'tab-pane',
      'role': 'tabpanel'
    },
    
    initialize: function () {
      
    },

    render: function () {
      var meuModelo = this.model;
    
      // Coloca classe active no primeiro painel.
      if (meuModelo.indice == 0) $(this.el).addClass('active');
      
      this.$el.attr('id', meuModelo.nome_elemento);
      
      // Carregamos o templante
      this.$el.html(meuModelo.minha_visao.template(meuModelo));
      
      return this;
    }

  });
  
  return UnidadeAbaConteudo;
});