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
  'controladores/escopos',
  'visoes/paginas/entrada/entrada',
  'modelos/sessao/sessao'
], function($, Backbone, Utilitarios, ControladorEscopos, VisaoEntrada, ModeloSessao){
  
  var SitioRoteador = Backbone.Router.extend({
    
    /* AS ROTAS DO NOSSO APLICATIVO 
     *----------------------------------------------------*/
    routes: {
      "": "inicio"
    },
    
    initialize: function () {
      var ctrldrEscopos = new ControladorEscopos(ModeloSessao);
      
      // Aqui verificamos se já apresentamos a visão de entrada.
      if (!this.visaoEntrada) {
        // Apresentamos a visão de entrada.
        this.visaoEntrada = new VisaoEntrada(ModeloSessao);
      }
      // Acrescentamos a nossa interface a visão de entrada.
      $('#conteudo').html(this.visaoEntrada.el);
    },
    
    inicio: function() {
      
    }
    
  });
  
  var inicializar = function() {
    var Sitio = new SitioRoteador();
    
    // Aqui verificamos o estado da sessão do usuário. Isso faz com que se o usuário
    // recarregar a página nós vamos verificar se ele já se autenticou.
    ModeloSessao.seAutenticado(function(seValido, resposta){
      // Iniciamos aqui o histórico das rotas.
      Backbone.history.start();    
    });
  };
 
  return { 
    inicializar: inicializar
  };
});