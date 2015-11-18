window.CarrosselSlides = Backbone.Model.extend({

    urlRoot: "/carrosselSlides",

    idAttribute: "id",

    initialize: function () {
        
    },

    validateItem: function (key) {
        
    },

    validateAll: function () {

    },

    defaults: {
      id: null,
      titulo: "",
      texto: "",
      texto_botao: "",
      imagem_dir: "",
      ativo: 0,
      endereco_botao: "#"
    }
});

window.ColecaoCarrosselSlides = Backbone.Collection.extend({

    model: CarrosselSlides,

    url: "/carrosselSlides"

});