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
  'utilitarios',
  'visoes/paginas/entrada/entrada',
  'modelos/sessao/Sessao'
], function($, Backbone, Utilitarios, VisaoEntrada, ModeloSessao){
  
  var SitioRoteador = Backbone.Router.extend({
    
    /* AS ROTAS DO NOSSO APLICATIVO 
     *----------------------------------------------------*/
    routes: {
      "": "inicio"
    },
    
    initialize: function () {
      
      if (!this.visaoEntrada) {
        this.visaoEntrada = new VisaoEntrada(ModeloSessao);
      }
      $('#conteudo').html(this.visaoEntrada.el);
    },
    
    inicio: function() {
      
    }
    
  });
  
  var inicializar = function() {
    var Sitio = new SitioRoteador();
    
    // Iniciamos o histórico das rotas.
    Backbone.history.start();  
  };
 
  return { 
    inicializar: inicializar
  };
});