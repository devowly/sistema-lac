'use strict'

/* @arquivo carrossel.js */

// @AFAZER: Adicionar validação

window.CarrosselSlides = Backbone.Model.extend({

    urlRoot: "/carrosselSlides",

    idAttribute: "id",

    initialize: function () {
        
    },

    validateItem: function (key) {
        
    },

    validateAll: function () {

    },

    // Aqui os valores padrões deste slide.
    defaults: {
      id: null,            // Identificador
      titulo: "",          // Titulo do slide
      texto: "",           // O texto do slide
      texto_botao: "",     // O texto do botão do slide
      imagem_dir: "",      // Imagem de fundo deste slide.
      ativo: 0,            // Um dos slides tem que iniciar ativo. Os seguintes são inativos.
      endereco_botao: "#"  // Endereço da rota que o botão vai levar ao ser clicado.
    }
});

window.ColecaoCarrosselSlides = Backbone.Collection.extend({

    model: CarrosselSlides,

    url: "/carrosselSlides"

});