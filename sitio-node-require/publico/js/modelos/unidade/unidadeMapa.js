'use strict'

/* @arquivo unidadeMapa.js */

 define([
  'jquery',
  'backbone',
  'underscore'
], function($, Backbone, _){

  /* Os modelos são a parte central de um aplicativo, contendo os dados e também uma parte longa de toda logica que a cerca:
   * Conversões, validações, propriedades e controle de acesso. Um modelo possue funcionalidades básicas para a gerencia dos dados.
   *
   * Alguns dos métodos dos modelos são listados abaixo.
   *
   * fetch   (União dos dados já obtidos com os novos do banco de dados)
   * save    (Salva o modelo)
   * destroy (Deleta o modelo)
   * get     (Requisita o valor de um atributo de um modelo) 
   * sync    (Faz persistir o estado de um modelo para com o servidor. Pode ser substituido com algum método customizado) 
   *
   * @veja http://backbonejs.org/#Model
   */
  var UnidadeMapa = Backbone.Model.extend({

    // O endereço REST onde iremos pegar os dados.
    urlRoot: "/",

    initialize: function () {
        
    },

    // Aqui os atributos padrões deste modelo de unidadeMapa.
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