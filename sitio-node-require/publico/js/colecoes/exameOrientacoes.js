'use strict'

/* @arquivo exameOrientacoes.js */

define([
  'jquery',
  'backbone',
  'underscore',
  'modelos/exameOrientacao'
], function($, Backbone, _, ModeloExameOrientacao){
  

  /* Metodos básicos da coleção são
   *
   * add      (Adiciona novo modelo à coleção)
   * remove   (Remove o modelo da coleção)
   * fetch    (União dos dados já obtidos dos modelos desta coleção com os novos do banco de dados) 
   */
  var ExameOrientacoes = Backbone.Collection.extend({

    model: ModeloExameOrientacao,
    
    // O endereço REST onde iremos pegar os dados. 
    // Esta url será re-escrita pelo Modelo.Exame 
    url: "/"

  });
  
  return ExameOrientacoes;
});