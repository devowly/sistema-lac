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
  'modelos/sessao'
], function($, Backbone, ModeloSessao){
  
  var SitioRoteador = Backbone.Router.extend({
    
    /* ROTAS DO NOSSO APLICATIVO 
     * Aqui vão ser realizadas o roteamento das visões.
     *----------------------------------------------------*/
    routes: {
      
      /* PAGINAS BASE DO NOSSO SITIO. */
      "": "inicio"    
     
    },
    
    /* É chamado já na inicialização, assim adicionamos o básico (topo, barra de navegação rodape) ao nosso sitio.
     */
    initialize: function () {
      ModeloSessao.entrar();
      //ModeloSessao.getAuth();
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