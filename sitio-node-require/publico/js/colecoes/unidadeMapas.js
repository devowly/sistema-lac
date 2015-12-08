'use strict'

/* @arquivo unidadeMapa.js */

 define([
  'jquery',
  'backbone',
  'underscore',
  'modelos/unidadeMapa'
], function($, Backbone, _, ModeloUnidadeMapa){
  
  /* Metodos básicos da coleção são
   *
   * add      (Adiciona novo modelo à coleção)
   * remove   (Remove o modelo da coleção)
   * fetch    (União dos dados já obtidos dos modelos desta coleção com os novos do banco de dados) 
   */
  var UnidadeMapas = Backbone.Collection.extend({

    model: ModeloUnidadeMapa,
    
    // O endereço REST onde iremos pegar os dados. 
    // Esta url será re-escrita pelo Modelo.Unidade 
    url: "/"

  });
  
  return UnidadeMapas;
});