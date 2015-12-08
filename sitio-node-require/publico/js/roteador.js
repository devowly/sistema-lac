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
  'visoes/base/topo/topo',
  'visoes/paginas/carrossel/carrossel',
  'visoes/paginas/quemSomos/quemSomos',
  'visoes/paginas/nossaEquipe/nossaEquipe',
  'visoes/paginas/nossasUnidades/nossasUnidades',
  'visoes/paginas/centralAtendimento/centralAtendimento',
  'visoes/paginas/convenios/convenios',
  'colecoes/carrosselSlides',
  'colecoes/unidades'
], function($, Backbone, Utilitarios, VisaoRodape, 
  VisaoBarraNavegacao, VisaoTopo, VisaoCarrossel, VisaoQuemSomos, VisaoNossaEquipe, 
  VisaoNossasUnidades, VisaoCentralAtendimento, VisaoConvenios,
  ColecaoCarrosselSlides, ColecaoUnidades){
  
  var SitioRoteador = Backbone.Router.extend({
    
    /* ROTAS DO NOSSO APLICATIVO 
     * Aqui vão ser realizadas o roteamento das visões.
     *----------------------------------------------------*/
    routes: {
      
      /* PAGINAS BASE DO NOSSO SITIO. */
      "": "inicio",                                 // Caso seja a extenção inicial, adicionamos o conteúdo de início.
      "quemSomos": "quemSomos",                     // Página de quem somos.
      "nossaEquipe": "nossaEquipe",                 // Página da nossa equipe.
      "nossasUnidades": "nossasUnidades",           // Página das nossas unidades.
      "centralAtendimento": "centralAtendimento",   // Página da central de atendimento.
      "convenios": "convenios"                      // Página dos convênios.
    },
    
    /* É chamado já na inicialização, assim adicionamos o básico (topo, barra de navegação rodape) ao nosso sitio.
     */
    initialize: function () {
      
      // Adiciona o logo e o botão de resultados
      if (!this.visaoTopo) {
        this.visaoTopo = new VisaoTopo();
      }
      $('#topo').html(this.visaoTopo.el);
      
      // Adiciona a barra de navegação
      if (!this.visaoBarraNavegacao) {
        this.visaoBarraNavegacao = new VisaoBarraNavegacao();
      }
      $('#barra-navegacao').html(this.visaoBarraNavegacao.el);
      
      // Adiciona o rodape
      if (!this.visaoRodape) {
        this.visaoRodape = new VisaoRodape();
      }
      $('#rodape').html(this.visaoRodape.el);
      
    },
    
    inicio: function() {
      var esteObj = this;
    
      if (!this.visaoCarrossel) {
        
        // Pegamos o conteudo da coleção do carrossel.
        var colCarrosselSlides = new ColecaoCarrosselSlides();
        
        // Carregamos esta coleção de slides.
        Utilitarios.carregarColecao([colCarrosselSlides], function(){
          
          // Carregamos a nossa visão
          esteObj.visaoCarrossel = new VisaoCarrossel({model: colCarrosselSlides});
          
          // Inserimos a visão no conteudo.
          $("#conteudo").html(esteObj.visaoCarrossel.el);
          
        });
        
      } else {
        
        // Esta visão já foi iniciada, apenas re-inserimos ela na div conteudo.
        $("#conteudo").html(this.visaoCarrossel.el);
      }
      // Selecionamos o item inicio na barra de navegação.
      this.visaoBarraNavegacao.selecionarItemMenu('inicio');
    },
  
    quemSomos: function() {
      // Aqui adicionamos o conteúdo de quem somos.
      if (!this.visaoQuemSomos) {
        this.visaoQuemSomos = new VisaoQuemSomos();
      }
      $('#conteudo').html(this.visaoQuemSomos.el);
      
      // Remove seleção de qualquer item da barra de navegacao
      this.visaoBarraNavegacao.selecionarItemMenu(null);
      
      // reiniciar eventos e os componentes desta visão
      this.visaoQuemSomos.reIniciarEventosComponentes();
      
    },
  
    nossaEquipe: function() {
      // Aqui adicionamos o conteúdo de nossa equipe.
      if (!this.visaoNossaEquipe) {
        this.visaoNossaEquipe = new VisaoNossaEquipe();
      }
      $('#conteudo').html(this.visaoNossaEquipe.el);
      
      // Remove seleção de qualquer item da barra de navegacao
      this.visaoBarraNavegacao.selecionarItemMenu(null);
    },
  
    nossasUnidades: function() {
      var esteObj = this;
    
      if (!this.visaoNossasUnidades) {
        
        var colecaoUnidades = new ColecaoUnidades();
        
        // Carrega a coleção unidades e depois as coleções aninhadas aos modelos.
        Utilitarios.carregarColecao([colecaoUnidades], function() {
            
          // Inicia a visão de cada unidade sendo chamado após a coleção de modelos e de mapas estiver carregado.
          esteObj.visaoNossasUnidades = new VisaoNossasUnidades({model: colecaoUnidades});
          
          // Carregamos os templates das nossas unidades.
          esteObj.visaoNossasUnidades.carregarTemplantes( function(visNossasUnidades) {
            
            // Aqui adicionamos o conteúdo de nossas unidades.
            $('#conteudo').html(visNossasUnidades.el);
            
            // reiniciar eventos
            visNossasUnidades.reIniciarEventos();
            
            // Aqui nós iniciamos o mapa de cada unidade.
            visNossasUnidades.iniciarCadaMapa();
             
          });
        });
        
      } else {
        
        // Aqui adicionamos o conteúdo de nossas unidades.
        $('#conteudo').html(this.visaoNossasUnidades.el);
        
        // reiniciar eventos
        this.visaoNossasUnidades.reIniciarEventos();
      }
      
      // Selecionamos o item unidades na barra de navegação
      this.visaoBarraNavegacao.selecionarItemMenu('unidades');
    },
    
    centralAtendimento: function() {
      // Aqui adicionamos o conteúdo da central de atendimento.
      if (!this.visaoCentralAtendimento) {
        this.visaoCentralAtendimento = new VisaoCentralAtendimento();
      }
      $('#conteudo').html(this.visaoCentralAtendimento.el);
      
      this.visaoBarraNavegacao.selecionarItemMenu('centralAtendimento');
    },
    
    convenios: function() {
      // Aqui adicionamos o conteúdo de convenios.
      if (!this.visaoConvenios) {
        this.visaoConvenios = new VisaoConvenios();
      }
      // Inserindo conteudo dos convênios.
      $('#conteudo').html(this.visaoConvenios.el);
      
      // Selecionamos o item convênios na barra de navegação.
      this.visaoBarraNavegacao.selecionarItemMenu('convenios');
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