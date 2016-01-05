'use strict'

/* @arquivo aplicativo.js */

define([
  'jquery',
  'roteador',  // Requisitamos o arquivo roteador.js
  'backbone'
], function($, Roteador, Backbone){
  var inicializar = function(){
    
    var ponteSync = Backbone.sync;
    
    // Sobrescreve o método sync com alcançe global. @Veja http://naleid.com/blog/2012/10/29/overriding-backbone-js-sync-to-allow-cross-origin-resource-sharing-cors
    Backbone.sync = function(metodo, modelo, opcoes) {
      opcoes || (opcoes = {});
      
      // Habilitamos aqui o acesso a outros dominios.
      if (!opcoes.crossDomain) {
        opcoes.crossDomain = true;
      }
      
      // Agora deixamos claro a necessidade de credenciais.
      if (!opcoes.xhrFields) {
        opcoes.xhrFields = {withCredentials:true};
      }
      // Passa os argumentos novamente para o método sync.
      return ponteSync(metodo, modelo, opcoes);
    };
    
    // Sobrescreve parte das requisições ajax com alcançe global.
    $.ajaxPrefilter( function( options, originalOptions, jqXHR ) {
      // Caso queira adicionar um dominio base para o sitio:
      // options.url = 'http://localhost:81' + options.url;
      
      // Caso queira utilizar credenciais:
      options.xhrFields = {
        withCredentials: true
      };
    });
    
    // Iniciamos o nosso roteador aqui.
    Roteador.inicializar();
 
  };

  return { 
    inicializar: inicializar
  };
});