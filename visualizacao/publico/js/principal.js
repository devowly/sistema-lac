'use strict'

/* @arquivo principal.js 
 *
 * Arquivo de configuração da biblioteca require.js.
 */

/* Versão 0.0.1-Beta */

/* O require.js nos habilita a realizar uma configuração dos atalhos dos modulos.
 * Também é responsável pelo carregamento ordenado dos módulos utilizando dependencias.
 *
 * @Diretiva {baseUrl} O caminho base onde os scripts serão requisitados.
 * @Diretiva {waitSeconds} Limite em segundos do total de segundos que serão 
 *                         esperados para o carregamento total de determinado script.
 * @Diretiva {paths} O caminho onde determinado módulo se encontra.
 * @Diretiva {shim} Realizamos o carregamento de scripts que não são compativeis com o padrão AMD.
 */
require.config({
  
  // Base de onde os scripts serão requisitados.
  baseUrl: "/js",
  
  // Quantidade de segundos para desistir de carregar um módulo.
  waitSeconds: 7,
  
  // Os caminhos de cada um dos nossos modulos.
  paths: {
    
    'async': '/bibliotecas/async/async',    // Para carregar scripts assincronamente.
    'gmapas': '/bibliotecas/async/gmapas',  // Mapa do Google. @veja http://blog.millermedeiros.com/requirejs-2-0-delayed-module-evaluation-and-google-maps/
    
    'text': '/bibliotecas/text', // Para carregamento de arquivos em texto. por exemplo, arquivos .html.
    
    'underscore': '/bibliotecas/underscore',
    
    // Backbone e suas extenções
    'backbone': '/bibliotecas/backbone',
    'backbone.paginator': '/bibliotecas/backbone.paginator',  // Adicionar paginação ao BackBone. @veja https://github.com/backbone-paginator/backbone.paginator
    'nesting': '/bibliotecas/nesting',   // Para utilizarmos nos modelos. @veja https://gist.github.com/geddski/1610397
    
    // Backgrid e suas extenções e dependencias.
    'backgrid': '/bibliotecas/backgrid',  // backgrid @veja http://backgridjs.com/
    'backgrid-filter': '/bibliotecas/backgrid-filter',  // Oferece filtro para o BackGrid.  @veja https://github.com/wyuenho/backgrid-filter
    'backgrid-automaticfilter': '/bibliotecas/backgrid-automaticfilter',  // Extenção para o backgrid e para o backgrid-filter.
    'backgrid-paginator': '/bibliotecas/backgrid-paginator', // Oferece paginação ao BackGrid. @veja https://github.com/wyuenho/backgrid-paginator
    'backgrid-cellbuttons': '/bibliotecas/backgrid-cellbuttons', // Oferece células de botões ao BackGrid. 
    'lunr': '/bibliotecas/lunr',  // lunr. @veja http://lunrjs.com/
    
    // BootStrap e suas extenções
    'bootstrap': '/bibliotecas/bootstrap',
    'bootstrap-widgets': '/bibliotecas/bootstrap-widgets',
    'button.6619238bf476cc3999511336bc046bfa': '/bibliotecas/button.6619238bf476cc3999511336bc046bfa',
    'ie10-viewport-bug-workaround': '/bibliotecas/ie10-viewport-bug-workaround',
    'ie-emulation-modes-warning': '/bibliotecas/ie-emulation-modes-warning',
    
    // jQuery e suas extenções.
    'jquery': '/bibliotecas/jquery',
    'jquery-ui': '/bibliotecas/jquery-ui',
    'jquery.scrollTo': '/bibliotecas/jquery.scrollTo',
    
    // Pasta dos nossos templantes
    'templantes': '../templantes',
    
    'domReady': '/bibliotecas/domReady'
  },
  
  // Lembre-se: Somente usar o shim para aqueles scripts que não são AMD.
  // Shim não vai funcionar corretamente se informado um script AMD.
  shim: {
    
    'backbone': {
      deps: ['underscore', 'jquery'], // Estas dependencias devem ser carregadas antes de carregar o backbone.js
      exports: 'Backbone'             // Ao ser carregado, use a variavel global 'Backbone' como valor do modulo.
    },
    
    // Extenção para o backbone, não exporta.
    'nesting': ['backbone'],
    
    'underscore': {
      exports: '_'  // exporta _
    },
    
    // O bootstrap e jQuery UI possuem métodos que se colidem, por isso,
    // vou manter o jquery UI como uma dependencia, ele será carregado antes do bootstrap.
    // Sendo assim, os métodos do bootstrap irão prevalecer.
    // @veja https://github.com/twbs/bootstrap/issues/6094
    // Lembre-se que o bootstrap não exporta.
    'bootstrap': {
      deps: ['jquery', 'jquery-ui'],
    },
    
    'jquery-ui': ['jquery'], // Extenção para o jQuery, não exporta.
    'jquery.scrollTo': ['jquery'], // Extenção para o jQuery, não exporta.
   
     // Utilitários do bootstrap. Não exportam.
    'bootstrap-widgets': ['bootstrap'],
    'button.6619238bf476cc3999511336bc046bfa': ['bootstrap', 'ie10-viewport-bug-workaround'],
    'ie10-viewport-bug-workaround': ['bootstrap', 'ie-emulation-modes-warning'],  // IE10 viewport hack for Surface/desktop Windows 8 bug.
    'ie-emulation-modes-warning': ['bootstrap']                                   // Por causa do navegador Internet Explorer 
  }

});

require([
  'aplicativo',  // Carrega o modulo do aplicativo e o passa para nossa função de definição
  'domReady',    // Vamos esperar o DOM estiver apresentado e carregado.
  
  /* Abaixo nós carregamos o bootstrap e algumas extenções necessárias.
   * Isto é bastante necessário para o funcionamento correto do sitio.
   * Não remova as dependencias abaixo.
   */
  'bootstrap',
  'bootstrap-widgets',
  'button.6619238bf476cc3999511336bc046bfa',
  'ie10-viewport-bug-workaround',
  'ie-emulation-modes-warning'
], function(Aplicativo, DomReady, Bootstrap) {
  
  DomReady(function () {  // Esta função é chamada após a página estiver toda carregada e apresentada.
    
    // Logo após nós iniciamos aqui nosso aplicativo.
    Aplicativo.inicializar();
  });
});