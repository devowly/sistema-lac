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
  'modelos/sessao/Sessao'
], function($, Backbone, Utilitarios, ModeloSessao){
  
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
      ModeloSessao.entrar({jid: 'raiz@localhost', senha: 'montes'}, function(seAutenticou){
        if (seAutenticou) {
          Utilitarios.carregarColecao([ModeloSessao.escopos], function(){
            for(var ca = 0; ca < ModeloSessao.escopos.length; ca++){
              console.log(ca + ': ' + ModeloSessao.escopos.models[ca].get('modelo') + ' ' + ModeloSessao.escopos.models[ca].get('bandeira'));
            }
          });
        } else {
          console.log('Não foi possível autenticar o usuário.');
        }
        
      });
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