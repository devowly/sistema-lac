'use strict'

/* @arquivo carrossel.js */

 define([
  'jquery',
  'backbone',
  'underscore',
  'modelos/carrossel/carrosselSlide'
], function($, Backbone, _, ModeloCarrosselSlide){
  
  /* Metodos básicos da coleção são
   *
   * add      (Adiciona novo modelo à coleção)
   * remove   (Remove o modelo da coleção)
   * fetch    (União dos dados já obtidos dos modelos desta coleção com os novos do banco de dados) 
   */
  var CarrosselSlides = Backbone.Collection.extend({

    model: ModeloCarrosselSlide,
    
    // O endereço REST onde iremos pegar os dados. 
    url: "/carrosselSlides"

  });
  
  return CarrosselSlides;
});