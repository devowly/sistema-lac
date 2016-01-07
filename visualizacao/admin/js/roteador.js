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
  'controladores/escopo/escopos',
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
      // O nosso controlador de escopos.
      if (!this.ctrldrEscopos) {
        this.ctrldrEscopos = new ControladorEscopos(ModeloSessao); 
      }
      
      // Aqui verificamos se já apresentamos a visão de entrada.
      if (!this.visaoEntrada) {
        // Apresentamos a visão de entrada.
        this.visaoEntrada = new VisaoEntrada(ModeloSessao);
      }
      // Acrescentamos a nossa interface a visão de entrada.
      $('#conteudo-raiz').html(this.visaoEntrada.el);
    },
    
    inicio: function() {
      
    }
    
  });
  
  var inicializar = function() {
    var Sitio = null;
    
    /* Sempre é necessário verificar o estado da sessão do usuário. A gente confere o estado aqui,
     * porque quando o usuário recarregar a página nós iremos apresentar a visão correta.
     */
    ModeloSessao.seAutenticado(function(seValido, resposta){
      
      /* Devemos iniciar aqui o roteador porque sempre iremos apresentar a visão
       * depois de verificar a sessão do usuário.
       */
      Sitio = new SitioRoteador();
      
      // Iniciamos aqui o histórico das rotas.
      Backbone.history.start();    
    });
  };
 
  return { 
    inicializar: inicializar
  };
});