'use strict'

/* @arquivo carrosselSlide.js */

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