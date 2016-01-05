'use strict'

/* @arquivo aplicativo.js */

define([
  'roteador' // Requisitamos o arquivo roteador.js
], function(Roteador){
  var inicializar = function(){
    // Iniciamos o nosso roteador aqui.
    Roteador.inicializar();
  };

  return { 
    inicializar: inicializar
  };
});