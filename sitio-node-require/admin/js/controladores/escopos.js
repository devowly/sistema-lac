'use strict'

/* @arquivo roteador.js
 *
 * Aqui vamos adicionar as caracteristicas de trabalhar com as rotas, Carregar os arquivos de visão. 
 */ 

/* Versão 0.0.1-Beta
 */
 
define([
  'jquery',
  'backbone',
  'utilitarios'
], function($, Backbone, Utilitarios){
  
  var Escopos = function(ModeloSessao) {
    var esteObjeto = this;
    this.modeloSessao = ModeloSessao;
    // Espera os eventos da propriedade auth do ModeloSessao.
    this.modeloSessao.on('change:auth', function (sessao) {
      if (ModeloSessao.get('auth')) {
        esteObjeto._carregarEscopos(); 
      }
    });
  };
 
  Escopos.prototype._carregarEscopos = function() {
    var esteObjeto = this;
    
  };
  
  
  return Escopos;
});