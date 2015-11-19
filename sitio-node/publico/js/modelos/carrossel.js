'use strict'

/* @arquivo carrossel.js */

// @AFAZER: Adicionar validação

/* Metodos dos modelos são
 *
 * fetch   (União dos dados já obtidos com os novos do banco de dados)
 * save    (Salva o modelo)
 * destroy (Deleta o modelo)
 */
window.CarrosselSlides = Backbone.Model.extend({

  // O endereço REST onde iremos pegar os dados.
  urlRoot: "/carrosselSlides",

  idAttribute: "id",

  initialize: function () {
      
  },

  // Aqui os atributos padrões deste modelo de slide.
  defaults: {
    id: null,            // Identificador
    titulo: "",          // Titulo do slide
    texto: "",           // O texto do slide
    texto_botao: "",     // O texto do botão do slide
    imagem_dir: "",      // Imagem de fundo deste slide.
    ativo: false,        // Um dos slides tem que iniciar ativo. Os seguintes são inativos.
    endereco_botao: "#"  // Endereço da rota que o botão vai levar ao ser clicado.
  }
});

/* Metodos básicos da coleção são
 *
 * add      (Adiciona novo modelo à coleção)
 * remove   (Remove o modelo da coleção)
 * fetch    (União dos dados já obtidos dos modelos desta coleção com os novos do banco de dados) 
 */
window.ColecaoCarrosselSlides = Backbone.Collection.extend({

  model: CarrosselSlides,
  
  // O endereço REST onde iremos pegar os dados. 
  url: "/carrosselSlides"

});