'use strict'

/* @arquivo principal.js 
 *
 * Arquivo de configuração da biblioteca require.js.
 */

/* Versão 0.0.1-Beta */

// O require.js nos habilita a realizar uma configuração dos atalhos dos modulos.
// Também é responsável pelo carregamento ordenado dos módulos utilizando dependencias.
require.config({
  
  // Base de onde os scripts serão requisitados.
  baseUrl: "/js",
  
  // Quantidade de segundos para desistir de carregar um módulo.
  waitSeconds: 7,
  
  // Os caminhos de cada um dos nossos modulos.
  paths: {
    
    'async': '../bibliotecas/async/async',
    'gmapas': '../bibliotecas/async/gmapas',  // @veja http://blog.millermedeiros.com/requirejs-2-0-delayed-module-evaluation-and-google-maps/
    
    'text': '../bibliotecas/text',
    
    'underscore': '../bibliotecas/underscore',
    
    // Backbone e suas extenções
    'backbone': '../bibliotecas/backbone',
    'backbone.paginator': '../bibliotecas/backbone.paginator',
    'nesting': '../bibliotecas/nesting',
    
    // Backgrid e suas extenções e dependencias.
    'backgrid': '../bibliotecas/backgrid',
    'backgrid-filter': '../bibliotecas/backgrid-filter',
    'backgrid-paginator': '../bibliotecas/backgrid-paginator',
    'lunr': '../bibliotecas/lunr',
    
    // BootStrap e suas extenções
    'bootstrap': '../bibliotecas/bootstrap',
    'bootstrap-widgets': '../bibliotecas/bootstrap-widgets',
    'button.6619238bf476cc3999511336bc046bfa': '../bibliotecas/button.6619238bf476cc3999511336bc046bfa',
    'ie10-viewport-bug-workaround': '../bibliotecas/ie10-viewport-bug-workaround',
    'ie-emulation-modes-warning': '../bibliotecas/ie-emulation-modes-warning',
    
    // jQuery e suas extenções.
    'jquery': '../bibliotecas/jquery',
    'jquery-ui': '../bibliotecas/jquery-ui',
    'jquery.scrollTo': '../bibliotecas/jquery.scrollTo',
    
    // Pasta dos nossos templantes
    'templantes': '../templantes'
  },
  
  // Lembre-se: Somente usar o shim para aqueles scripts que não são AMD.
  // Shim não vai funcionar corretamente se informado um script AMD.
  shim: {
    
    'backbone': {
      deps: ['underscore', 'jquery'], // Estas dependencias devem ser carregadas antes de carregar o backbone.js
      exports: 'Backbone'             // Ao ser carregado, use a variavel global 'Backbone' como valor do modulo.
    },
    
    // Extenção do backbone, não exporta.
    'backbone.paginator': ['backbone'],
    
    // Extenção para o backbone, não exporta.
    'nesting': ['backbone'],
    
    'underscore': {
      exports: '_'
    },
    
    // Vamos utilizar o backgrid estensivamente neste projeto.
    // Ele é responsável pela criação de tabelas.
    'backgrid': {
      deps: ['backbone', 'jquery'], // Estas dependencias devem ser carregadas antes de carregar o backgrid.js
      exports: 'Backgrid'           // Ao ser carregado, use a variavel global 'Backgrid' como valor do modulo.
    },
    'backgrid-filter': ['backgrid', 'lunr'], // Extenção para o backgrid, não exporta.
    'backgrid-paginator': ['backgrid'],      // Extenção para o backgrid, não exporta.
    
    // O backbone-filter necessita disso.
    'lunr': { },
    
    // O bootstrap e jQuery UI possuem métodos que se colidem, por isso,
    // vou manter o jquery UI como uma dependencia, ele será carregado antes do bootstrap.
    // Sendo assim, os métodos do bootstrap irão prevalecer.
    'bootstrap': {
      deps: ['jquery', 'jquery-ui'],
    },
    
    'jquery-ui': ['jquery'], // Extenção para o jQuery, não exporta.
    'jquery.scrollTo': ['jquery'], // Extenção para o jQuery, não exporta.
   
     // Utilitários do bootstrap. Não exportam.
    'bootstrap-widgets': ['bootstrap'],
    'button.6619238bf476cc3999511336bc046bfa': ['bootstrap'],
    'ie10-viewport-bug-workaround': ['bootstrap'],             // IE10 viewport hack for Surface/desktop Windows 8 bug.
    'ie-emulation-modes-warning': ['bootstrap']                // Por causa do navegador Internet Explorer 
  }

});

require([
  // Carrega o modulo do aplicativo e o passa para nossa função de definição
  'aplicativo'
], function(Aplicativo) {
  
  // A dependencia 'aplicativo' é passada como Aplicativo
  // Iniciamos aqui nosso aplicativo.
  Aplicativo.inicializar();
});