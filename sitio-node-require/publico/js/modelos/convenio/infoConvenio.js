'use strict'

/* @arquivo infoConvenio.js */

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
  var InfoConvenio = Backbone.Model.extend({

    // O endereço REST onde iremos pegar os dados.
    urlRoot: "/",

    initialize: function () {
        
    },

    // Aqui os atributos padrões deste modelo de slide.
    defaults: {
      id: null,           // Identificador
      pagina_html: "",    // Página html desta informação para o convenio. Exemplo: infoconvenio0001.html
      nome_elemento: "",  // Nome do elemento html utilizado para esta informação. Exemplo: infoconvenio0001
      imagem: "",         // Nome do arquivo que contêm a imagem do convênio. Exemplo: imgConvenio0001.jpeg
      convenio_id: ""    // Chave extrangeira do convenio a que esta informação pertence.
    }
  });

  return InfoConvenio;
});