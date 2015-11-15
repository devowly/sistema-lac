'use strict'

var aplicativo = null;

var RoteadorAplicativo = Backbone.Router.extend({

  /* A rotas do nosso aplicativo.
   */
  routes: {
    
    /* PAGINAS BASE DO NOSSO SITIO. */
    "": "inicio", // Caso seja a extenção inicial, adicionamos o conteúdo de início.
    "examesOrientacoes": "examesOrientacoes", // Página contendo a tabela de exames e suas orientações.
    "centralAtendimento": "centralAtendimento",
    "convenios": "convenios",
    "quemSomos": "quemSomos",
    "nossaEquipe": "nossaEquipe",
    "nossasUnidades": "nossasUnidades",
    "infoConvenio": "infoConvenio",
    
    /* O scrollSpy utiliza a mesma caracteristica do backbone, então adicionamos as rotas para
     * cada um dos items do menu vertical. */
    "consAmbiental": "conscienciaAmbiental",
    "aEmpresa": "sobreEmpresa",
    "misVisVal": "missaoVisaoValores",
    "gestaoQualidade": "gestaoQualidade"
  },

  /* @funcao initialize().
   * @descrição É chamado já na inicialização, assim adicionamos o básico (topo, barra de navegação rodape) ao nosso sitio.
   */
  initialize: function () {
    
    // Adiciona o logo e o botão de resultados
    if (!this.visaoLogoBotoes) {
      this.visaoLogoBotoes = new VisaoLogoBotoes();
    }
    $('#topo').html(this.visaoLogoBotoes.el);
    
    // Adiciona a barra de navegação
    if (!this.visaoBarraNavegacao) {
      this.visaoBarraNavegacao = new VisaoBarraNavegacao();
    }
    $('#barraNavegacao').html(this.visaoBarraNavegacao.el);
    this.visaoBarraNavegacao.selecionarItemMenu('inicio');
    
    // Adiciona o rodape
    if (!this.visaoRodape) {
      this.visaoRodape = new VisaoRodape();
    }
    $('#rodape').html(this.visaoRodape.el);
  },

  inicio: function () {
    // Aqui adicionamos o carrossel de marketing e atualizamos a barra de navegacao.
    if (!this.visaoCarrossel) {
      this.visaoCarrossel = new VisaoCarrossel();
    }
    $('#conteudo').html(this.visaoCarrossel.el);
    
    this.visaoBarraNavegacao.selecionarItemMenu('inicio');
  },
  
  examesOrientacoes: function() {
    // Aqui adicionamos a tabela de exames e orientações e atualizamos a barra de navegacao.
    if (!this.visaoExamesOrientacoes) {
      this.visaoExamesOrientacoes = new VisaoExamesOrientacoes();
    }
    $('#conteudo').html(this.visaoExamesOrientacoes.el);
    
    this.visaoBarraNavegacao.selecionarItemMenu('exames');
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
    $('#conteudo').html(this.visaoConvenios.el);
    
    this.visaoBarraNavegacao.selecionarItemMenu('convenios');
  },
  
  quemSomos: function() {
    // Aqui adicionamos o conteúdo de quem somos.
    if (!this.visaoQuemSomos) {
      this.visaoQuemSomos = new VisaoQuemSomos();
    }
    $('#conteudo').html(this.visaoQuemSomos.el);
    
    // Remove seleção de qualquer item da barra de navegacao
    this.visaoBarraNavegacao.selecionarItemMenu(null);
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
    // Aqui adicionamos o conteúdo de nossas unidades.
    if (!this.visaoNossasUnidades) {
      this.visaoNossasUnidades = new VisaoNossasUnidades();
    }
    $('#conteudo').html(this.visaoNossasUnidades.el);
    
    this.visaoBarraNavegacao.selecionarItemMenu('unidades');
    
    if (gglMapa.seMapaPronto) {
      this.visaoNossasUnidades.iniciarMapa();
    }
  },
  
  infoConvenio: function() {
    // Aqui adicionamos o conteúdo.
    if (!this.visaoInfoConvenio) {
      this.visaoInfoConvenio = new VisaoInfoConvenio();
    }
    $('#conteudo').html(this.visaoInfoConvenio.el);
    
    // Remove selecao de qualquer item da barra de navegação.
    this.visaoBarraNavegacao.selecionarItemMenu(null);
    
  },
  
  conscienciaAmbiental: function() {
    // Removemos a seleção de qualquer item na barra de navegação
    this.visaoBarraNavegacao.selecionarItemMenu(null);
    
    // Aqui adicionamos o conteúdo de quem somos.
    if (!this.visaoQuemSomos) {
      this.visaoQuemSomos = new VisaoQuemSomos();
    }
    $('#conteudo').html(this.visaoQuemSomos.el);
   
    this.visaoQuemSomos.selecionarItemNavegacao('itemConsAmb');
  },
  
  sobreEmpresa: function() {
    // Removemos a seleção de qualquer item na barra de navegação
    this.visaoBarraNavegacao.selecionarItemMenu(null);
    
    // Aqui adicionamos o conteúdo de quem somos.
    if (!this.visaoQuemSomos) {
      this.visaoQuemSomos = new VisaoQuemSomos();
    }
    $('#conteudo').html(this.visaoQuemSomos.el);
    
    this.visaoQuemSomos.selecionarItemNavegacao('itemEmpresa');
  },
  
  missaoVisaoValores: function() {
    // Removemos a seleção de qualquer item na barra de navegação
    this.visaoBarraNavegacao.selecionarItemMenu(null);
    
    // Aqui adicionamos o conteúdo de quem somos.
    if (!this.visaoQuemSomos) {
      this.visaoQuemSomos = new VisaoQuemSomos();
    }
    $('#conteudo').html(this.visaoQuemSomos.el);
    
    this.visaoQuemSomos.selecionarItemNavegacao('itemMisVisVal');
  },
  
  gestaoQualidade: function() {
    // Removemos a seleção de qualquer item na barra de navegação
    this.visaoBarraNavegacao.selecionarItemMenu(null);
    
    // Aqui adicionamos o conteúdo de quem somos.
    if (!this.visaoQuemSomos) {
      this.visaoQuemSomos = new VisaoQuemSomos();
    }
    $('#conteudo').html(this.visaoQuemSomos.el);
    
    this.visaoQuemSomos.selecionarItemNavegacao('itemGestQuali');
  }

});

/* Carregamos o template de cada um dos conteúdos do sitio. */
utilitarios.carregaTemplantes(['VisaoLogoBotoes', 'VisaoBarraNavegacao', 'VisaoCarrossel', 
                               'VisaoRodape', 'VisaoExamesOrientacoes', 'VisaoCentralAtendimento', 'VisaoConvenios', 
                               'VisaoQuemSomos', 'VisaoNossaEquipe', 'VisaoNossasUnidades', 'VisaoInfoConvenio'], function() {
  aplicativo = new RoteadorAplicativo();
  Backbone.history.start();
});