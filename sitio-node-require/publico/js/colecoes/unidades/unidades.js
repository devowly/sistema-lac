'use strict'

/* @arquivo unidades.js */

 define([
  'jquery',
  'backbone',
  'underscore',
  'modelos/unidade/unidade'
], function($, Backbone, _, ModeloUnidade){
  
  /* Metodos básicos da coleção são
   *
   * add      (Adiciona novo modelo à coleção)
   * remove   (Remove o modelo da coleção)
   * fetch    (União dos dados já obtidos dos modelos desta coleção com os novos do banco de dados) 
   */
  var Unidades = Backbone.Collection.extend({

    model: ModeloUnidade,
    
    // O endereço REST onde iremos pegar os dados. 
    url: "/unidades"

  });
  
  return Unidades;
});