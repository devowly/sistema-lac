'use strict'

/* @arquivo infoConvenio.js */

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
  var InfoConvenio = Backbone.Model.extend({

    // O endereço REST onde iremos pegar os dados.
    urlRoot: "/InfoConvenio",

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