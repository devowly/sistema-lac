'use strict'

/* Aqui vamos adicionar as caracteristicas de trabalhar com as rotas, Carregar os arquivos de visão.  
 * 
 * @arquivo roteador.js
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
  
  /* @Roteador SitioRoteador().
   *
   * Aqui temos as propriedades e métodos do nosso roteador. O roteador, como o nome já indica,
   * realiza a apresentação das visões para cada cada rota acessada.
   -------------------------------------------------------------------------------------------*/
  var SitioRoteador = Backbone.Router.extend({
    
    /* @Propriedade {Objeto} [routes] Contêm as nossas rotas. 
     */
    routes: {
      "": "inicio"
    },
    
    /* @Construtor initialize().
     *
     * Aqui realizamos o inicio do nosso roteador. 
     */
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
    
   /* @Método inicio().
    *
    * Esta é a rota sempre apresentada inicialmente.
    */
    inicio: function() {
      
    }
    
  });
  
  /* @Função inicializar().
   *
   * Responsável por verificar o estado de autenticação do usuário e também por
   * iniciar o nosso roteador e o histório de rotas.
   ----------------------------------------------------------------------------*/
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