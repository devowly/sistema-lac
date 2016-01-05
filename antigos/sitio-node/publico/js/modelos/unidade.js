'use strict'

/* @arquivo unidade.js */


/* Metodos básicos dos modelos são
 *
 * fetch   (União dos dados já obtidos com os novos do banco de dados)
 * save    (Salva o modelo)
 * destroy (Deleta o modelo)
 */
Modelo.Unidade = Backbone.Model.extend({

  // O endereço REST onde iremos pegar os dados.
  urlRoot: "/unidades",

  // Isso vai ser utilizado para quando formos pegar os dados 
  // das coleções aninhadas pertecentes a este modelo.
  colecoesAninhadas: [
    'unidadeMapas'
  ], 
  
  initialize: function () {
    
    // Cada uma das unidades possue um zoom e coordenadas para o mapa
    this.unidadeMapas = nestCollection(this, 'unidadeMapas', new Colecao.UnidadeMapas(this.get('unidadeMapas')));
    this.unidadeMapas.url = '/unidades/' + this.id + '/UnidadeMapa';
  },
  
  // Aqui os atributos padrões deste modelo de slide.
  defaults: {
    id: null,            // Identificador
    titulo: "",          // Titulo da unidade. Exemplo: Nossa unidade do centro de Montes Claros.
    pagina_endereco: "", // Página que contem endereço em XML. Exemplo: enderecoUnidade002.html
    nome_elemento: "",   // Nome do elemento onde iremos adicionar o mapa. Exemplo: mapaUnidade002
    nome_aba: ""         // Nome da aba onde esta unidade irá ser apresentada. Exemplo: JARDIM PANORAMA.
  }
});

/* Metodos básicos da coleção são
 *
 * add      (Adiciona novo modelo à coleção)
 * remove   (Remove o modelo da coleção)
 * fetch    (União dos dados já obtidos dos modelos desta coleção com os novos do banco de dados) 
 */
Colecao.Unidades = Backbone.Collection.extend({

  model: Modelo.Unidade,
  
  // O endereço REST onde iremos pegar os dados. 
  url: "/unidades"

});