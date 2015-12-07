'use strict'

/* @arquivo roteador.js
 *
 * Aqui vamos adicionar as caracteristicas de trabalhar com as rotas, Carregar os arquivos de visão. 
 */ 

/* Versão 0.0.1-Beta
 * - Resolver o problema de quando re-inserir o templante, manter os eventos da visão e também dos widgets. (issue #11) (f327b05fd021600484208996db01976beb709c9b) [FEITO]
 */
 
define([
  'jquery',
  'backbone',
  'utilitarios',
  'visoes/base/rodape/rodape',
  'visoes/base/barraNavegacao/barraNavegacao',
  'visoes/base/topo/topo'//,
 // 'visoes/paginas/carrossel/carrossel'
], function($, Backbone, Utilitarios, Rodape, BarraNavegacao, Topo/*, Carrossel*/){
  
  var SitioRoteador = Backbone.Router.extend({
    
    /* ROTAS DO NOSSO APLICATIVO 
     * Aqui vão ser realizadas o roteamento das visões.
     *----------------------------------------------------*/
    routes: {
      
      /* PAGINAS BASE DO NOSSO SITIO. */
      "": "inicio"                               // Caso seja a extenção inicial, adicionamos o conteúdo de início.
    },
    
    /* É chamado já na inicialização, assim adicionamos o básico (topo, barra de navegação rodape) ao nosso sitio.
     */
    initialize: function () {
      
      // Adiciona o logo e o botão de resultados
      if (!this.visaoTopo) {
        this.visaoTopo = new Topo();
      }
      $('#topo').html(this.visaoTopo.el);
      
      // Adiciona a barra de navegação
      if (!this.visaoBarraNavegacao) {
        this.visaoBarraNavegacao = new BarraNavegacao();
      }
      $('#barra-navegacao').html(this.visaoBarraNavegacao.el);
      
      // Adiciona o rodape
      if (!this.visaoRodape) {
        this.visaoRodape = new Rodape();
      }
      $('#rodape').html(this.visaoRodape.el);
      
    },
    
    inicio: function() {
      
      // Selecionamos o item inicio na barra de navegação.
      this.visaoBarraNavegacao.selecionarItemMenu('inicio');
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