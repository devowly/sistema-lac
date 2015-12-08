'use strict'

/* @arquivo infoConvenios.js */

define([
  'jquery',
  'backbone',
  'underscore',
  'modelos/convenio/infoConvenio'
], function($, Backbone, _, ModeloInfoConvenio){
  

  /* Metodos básicos da coleção são
   *
   * add      (Adiciona novo modelo à coleção)
   * remove   (Remove o modelo da coleção)
   * fetch    (União dos dados já obtidos dos modelos desta coleção com os novos do banco de dados) 
   */
  var InfoConvenios = Backbone.Collection.extend({

    model: ModeloInfoConvenio,
    
    // O endereço REST onde iremos pegar os dados. 
    // Esta url será re-escrita pelo Modelo.Exame 
    url: "/"

  });
  
  return InfoConvenios;
});