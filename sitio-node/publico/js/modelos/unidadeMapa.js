'use strict'

/* @arquivo unidadeMapa.js */


/* Metodos dos modelos são
 *
 * fetch   (União dos dados já obtidos com os novos do banco de dados)
 * save    (Salva o modelo)
 * destroy (Deleta o modelo)
 */
Modelo.UnidadeMapa = Backbone.Model.extend({

  // O endereço REST onde iremos pegar os dados.
  urlRoot: "/",

  initialize: function () {
      
  },

  // Aqui os atributos padrões deste modelo de slide.
  defaults: {
    id: null,      // Identificador
    lat: "",       // Latitude da coordenada do nosso mapa.
    lng: "",       // Longitude da coordenada do nosso mapa.
    zoom: "",      // Zoom realizado neste mapa
    unidade_id: "" // Chave extrangeira da unidade a que está coordenada pertence.
  }
});

/* Metodos básicos da coleção são
 *
 * add      (Adiciona novo modelo à coleção)
 * remove   (Remove o modelo da coleção)
 * fetch    (União dos dados já obtidos dos modelos desta coleção com os novos do banco de dados) 
 */
Colecao.UnidadeMapas = Backbone.Collection.extend({

  model: Modelo.UnidadeMapa,
  
  // O endereço REST onde iremos pegar os dados. 
  url: "/"

});