'use strict'

/* @arquivo exameOrientacao.js */

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
  var ExameOrientacao = Backbone.Model.extend({

    // O endereço REST onde iremos pegar os dados.
    urlRoot: "/",

    initialize: function () {
        
    },

    // Aqui os atributos padrões deste modelo de slide.
    defaults: {
      id: null,           // Identificador
      pagina_html: "",    // Página html desta orientação para exame. Exemplo: orientacao0001.html
      nome_elemento: "",  // Nome do elemento html utilizado para esta orientação. Exemplo: orientacao0001
      exame_id: ""        // Chave extrangeira do exame a que esta orientacao pertence.
    }
  });

  return ExameOrientacao;
});