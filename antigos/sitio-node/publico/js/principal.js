'use strict'

/* @arquivo principal.js
 *
 * @Descrição Aqui vamos adicionar as caracteristicas de trabalhar com as rotas,
 *  Carregar os arquivos de visão. 
 */ 

/* Versão 0.0.1-Beta
 * - Resolver o problema de quando re-inserir o templante, manter os eventos da visão e também dos widgets. (issue #11) (f327b05fd021600484208996db01976beb709c9b) [FEITO]
 */
 
Roteador.Sitio = Backbone.Router.extend({
  
  /* ROTAS DO NOSSO APLICATIVO 
   * Aqui vão ser realizadas o roteamento das visões.
   *----------------------------------------------------*/
  routes: {
    
    /* PAGINAS BASE DO NOSSO SITIO. */
    "": "inicio",                               // Caso seja a extenção inicial, adicionamos o conteúdo de início.
    "examesOrientacoes": "examesOrientacoes",   // Página contendo a tabela de exames e suas orientações.
    "centralAtendimento": "centralAtendimento", // Página da central de atendimento.
    "convenios": "convenios",                   // Página dos convênios.
    "quemSomos": "quemSomos",                   // Página de quem somos.
    "nossaEquipe": "nossaEquipe",               // Página da nossa equipe.
    "nossasUnidades": "nossasUnidades",         // Página das nossas unidades.
    "infoConvenio": "infoConvenio"              // Pág. de informações de cada convênio.
  },

  /* @funcao initialize().
   * @descrição É chamado já na inicialização, assim adicionamos o básico (topo, barra de navegação rodape) ao nosso sitio.
   */
  initialize: function () {
    
    // Adiciona o logo e o botão de resultados
    if (!this.visaoTopo) {
      this.visaoTopo = new Visao.Topo();
    }
    $('#topo').html(this.visaoTopo.el);
    
    // Adiciona a barra de navegação
    if (!this.visaoBarraNavegacao) {
      this.visaoBarraNavegacao = new Visao.BarraNavegacao();
    }
    $('#barraNavegacao').html(this.visaoBarraNavegacao.el);
    
    // Seleciona item inicio.
    this.visaoBarraNavegacao.selecionarItemMenu('inicio');
    
    // Adiciona o rodape
    if (!this.visaoRodape) {
      this.visaoRodape = new Visao.Rodape();
    }
    $('#rodape').html(this.visaoRodape.el);
  },

  inicio: function () {
    var esteObj = this;
    
    if (!this.visaoCarrossel) {
      // Mantemos os conteudos desta coleção para utilizar ao re-inserir o templante.
      var colCarrosselSlides = new Colecao.CarrosselSlides();
      
      // Carregamos esta coleção de slides.
      Global.utilitarios.carregarColecao([colCarrosselSlides], function(){
        
        // Carregamos a nossa visão
        esteObj.visaoCarrossel = new Visao.Carrossel({model: colCarrosselSlides});
        
        // Inserimos a visão no conteudo.
        $("#conteudo").html(esteObj.visaoCarrossel.el);
        
      });
      
    } else {
      
      // Esta visão já foi iniciada, apenas inserimos ela na div conteudo.
      $("#conteudo").html(this.visaoCarrossel.el);
    }
    
    // Selecionamos o item inicio na barra de navegação.
    this.visaoBarraNavegacao.selecionarItemMenu('inicio');
  },
  
  examesOrientacoes: function() {
    var esteObj = this;
    
      this.colExames = new Colecao.Exames();
      
      // Carregamos esta coleção de exames e suas orientacoes. 
      // Existe um limite de registros imposto em colecao.state.pageSize.
      // Então não vai ser carregados todos os modelos desta coleção e sim o tamanho do colecao.state.pageSize.
      Global.utilitarios.carregarColecao([this.colExames], function(){
        
        // Carregamos a nossa visão
        esteObj.visaoExamesOrientacoes = new Visao.ExamesOrientacoes({model: esteObj.colExames});
        
        // Quando tudo estiver carregado, inserimos a visão no conteudo.
        $("#conteudo").html(esteObj.visaoExamesOrientacoes.el);
        
      });
  
    // Selecionamos o nosso item na barra de navegação.
    this.visaoBarraNavegacao.selecionarItemMenu('exames');
  },
  
  centralAtendimento: function() {
    // Aqui adicionamos o conteúdo da central de atendimento.
    if (!this.visaoCentralAtendimento) {
      this.visaoCentralAtendimento = new Visao.CentralAtendimento();
    }
    $('#conteudo').html(this.visaoCentralAtendimento.el);
    
    this.visaoBarraNavegacao.selecionarItemMenu('centralAtendimento');
  },
  
  convenios: function() {
    // Aqui adicionamos o conteúdo de convenios.
    if (!this.visaoConvenios) {
      this.visaoConvenios = new Visao.Convenios();
    }
    // Inserindo conteudo dos convênios.
    $('#conteudo').html(this.visaoConvenios.el);
    
    // Selecionamos o item convênios na barra de navegação.
    this.visaoBarraNavegacao.selecionarItemMenu('convenios');
  },
  
  quemSomos: function() {
    // Aqui adicionamos o conteúdo de quem somos.
    if (!this.visaoQuemSomos) {
      this.visaoQuemSomos = new Visao.QuemSomos();
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
      this.visaoNossaEquipe = new Visao.NossaEquipe();
    }
    $('#conteudo').html(this.visaoNossaEquipe.el);
    
    // Remove seleção de qualquer item da barra de navegacao
    this.visaoBarraNavegacao.selecionarItemMenu(null);
  },
  
  nossasUnidades: function() {
    var esteObj = this;
  
    if (!this.visaoNossasUnidades) {
      
      var colecaoUnidades = new Colecao.Unidades();
      
      // Carrega a coleção unidades e depois as coleções aninhadas aos modelos.
      Global.utilitarios.carregarColecao([colecaoUnidades], function() {
          
        // Inicia a visão de cada unidade sendo chamado após a coleção de modelos e de mapas estiver carregado.
        esteObj.visaoNossasUnidades = new Visao.NossasUnidades({model: colecaoUnidades});
        
        // Carregamos os templates das nossas unidades.
        esteObj.visaoNossasUnidades.carregarTemplantes( function(visNossasUnidades) {
          
          // Aqui adicionamos o conteúdo de nossas unidades.
          $('#conteudo').html(visNossasUnidades.el);
          
          // reiniciar eventos
          visNossasUnidades.reIniciarEventos();
          
          // Caso a biblioteca do google maps já estiver carregada, iniciamos o mapa de cada unidade.
          if (Global.gglMapa.seMapaPronto()) {
            visNossasUnidades.iniciarCadaMapa();
          }
          
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
  
  infoConvenio: function() {
    // Aqui adicionamos o conteúdo.
    if (!this.visaoInfoConvenio) {
      this.visaoInfoConvenio = new Visao.InfoConvenio();
    }
    $('#conteudo').html(this.visaoInfoConvenio.el);
    
    // Remove selecao de qualquer item da barra de navegação.
    this.visaoBarraNavegacao.selecionarItemMenu(null);
  }
  
});

// Carregamos o template em html de cada uma das visões.
Global.utilitarios.carregarTemplantes([
  'Topo', 'BarraNavegacao', 'Carrossel', 'SlideItem', 
  'Rodape', 'ExamesOrientacoes', 'CentralAtendimento', 'Convenios', 
  'QuemSomos', 'NossaEquipe', 'NossasUnidades', 'UnidadeAba', 'InfoConvenio'], 
  function() {
    // Assim que todos templantes forem carregados, iniciamos as nossas rotas.
    Sitio = new Roteador.Sitio();
    
    // Iniciamos o histórico das rotas.
    Backbone.history.start();  
});