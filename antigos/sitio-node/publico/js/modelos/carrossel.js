'use strict'

/* @arquivo carrossel.js */


/* Metodos dos modelos são
 *
 * fetch   (União dos dados já obtidos com os novos do banco de dados)
 * save    (Salva o modelo)
 * destroy (Deleta o modelo)
 */
Modelo.CarrosselSlide = Backbone.Model.extend({

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

/* Metodos básicos da coleção são
 *
 * add      (Adiciona novo modelo à coleção)
 * remove   (Remove o modelo da coleção)
 * fetch    (União dos dados já obtidos dos modelos desta coleção com os novos do banco de dados) 
 */
Colecao.CarrosselSlides = Backbone.Collection.extend({

  model: Modelo.CarrosselSlide,
  
  // O endereço REST onde iremos pegar os dados. 
  url: "/carrosselSlides"

});