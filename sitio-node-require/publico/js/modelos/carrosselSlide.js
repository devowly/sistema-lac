'use strict'

/* @arquivo carrosselSlide.js */

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
  var CarrosselSlide = Backbone.Model.extend({

    // O endereço REST onde iremos pegar os dados.
    urlRoot: "/carrosselSlides",

    initialize: function () {
        
    },

    // Aqui os atributos padrões deste modelo de slide.
    defaults: {
      id: null,            // Identificador
      titulo: "",          // Titulo do slide
      texto: "",           // O texto do slide
      texto_botao: "",     // O texto do botão do slide
      imagem_dir: "",      // Imagem de fundo deste slide.
      imagem_arquivo: "",  // Nome do arquivo da imagem deste slide.
      endereco_botao: "#"  // Endereço da rota que o botão vai levar ao ser clicado.
    }
  });
  
  return CarrosselSlide;
});