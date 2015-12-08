'use strict'

/* @arquivo unidadeMapa.js */

 define([
  'jquery',
  'backbone',
  'underscore'
], function($, Backbone, _){

  /* Metodos dos modelos são
   *
   * fetch   (União dos dados já obtidos com os novos do banco de dados)
   * save    (Salva o modelo)
   * destroy (Deleta o modelo)
   */
  var UnidadeMapa = Backbone.Model.extend({

    // O endereço REST onde iremos pegar os dados.
    urlRoot: "/",

    initialize: function () {
        
    },

    // Aqui os atributos padrões deste modelo de slide.
    defaults: {
      id: null,      // Identificador
      lat: "",       // Latitude da coordenada do nosso mapa.
      lng: "",       // Longitude da coordenada do nosso mapa.
      zoom: "",      // Zoom realizado neste mapa
      unidade_id: "" // Chave extrangeira da unidade a que está coordenada pertence.
    }
  });

  return UnidadeMapa;
});