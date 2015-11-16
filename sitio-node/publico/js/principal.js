'use strict'

/* @arquivo principal.js
 *
 * @Descrição Aqui vamos adicionar as caracteristicas de trabalhar com as rotas,
 *  Carregar os arquivos de visão. 
 */

var aplicativo = null;

var RoteadorAplicativo = Backbone.Router.extend({

  seCarrosselIniciado: false,
  seQuemSomosIniciado: false,
  
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
    "infoConvenio": "infoConvenio",             // Pág. de informações de cada convênio.
     
    // O scrollSpy utiliza a mesma forma (#ancora) de navegar pelas ancoras que o backbone utiliza. 
    // então adicionamos as rotas para cada um dos items do menu vertical.
    // @AFAZER Quando usuário navegar por estas rotas abaixo, fazer com que o texto seja posicionado na ancora.
    "consAmbiental": "conscienciaAmbiental",    // Ancora consciencia ambiental
    "aEmpresa": "sobreEmpresa",                 // Ancora sobre a empresa
    "misVisVal": "missaoVisaoValores",          // Ancora para missões, visões e valores
    "gestaoQualidade": "gestaoQualidade"        // Ancora para gestão de qualidade.
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
    
    // Seleciona item inicio.
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
    
    // Inserindo conteudo da nossa página inicial.
    $('#conteudo').html(this.visaoCarrossel.el);
    
    // @AFAZER rever este código, ele simplesmente não funciona porque quando o conteudo é
    // inserido uma segunda vez, o carrossel para de funcionar.
    if (!this.seCarrosselIniciado) {
      // Iniciamos o nosso carrossel, apenas uma vez, com um intervalo de 8segundos para cada slide.
      //this.visaoCarrossel.iniciarCarrossel();
      
      this.seCarrosselIniciado = true;
    }
    
    // Selecionamos o item inicio na barra de navegação.
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
    // Inserindo conteudo dos convênios.
    $('#conteudo').html(this.visaoConvenios.el);
    
    // Selecionamos o item convênios na barra de navegação.
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
    
    // Iniciamos os eventos para o texto.
    this.visaoQuemSomos.iniciarEventosParaMenu('itemEmpresa');
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

// Carregamos o template em html de cada uma das visões.
utilitarios.carregaTemplantes(['VisaoLogoBotoes', 'VisaoBarraNavegacao', 'VisaoCarrossel', 
                               'VisaoRodape', 'VisaoExamesOrientacoes', 'VisaoCentralAtendimento', 'VisaoConvenios', 
                               'VisaoQuemSomos', 'VisaoNossaEquipe', 'VisaoNossasUnidades', 'VisaoInfoConvenio'], 
  function() {
    // Assim que todos templantes forem carregados, iniciamos as nossas rotas.
    aplicativo = new RoteadorAplicativo();
    
    // Iniciamos o histórico das rotas.
    Backbone.history.start();
});