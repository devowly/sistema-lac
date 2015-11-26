'use strict'

/* @arquivo exame.js */


/* Metodos básicos dos modelos são
 *
 * fetch   (União dos dados já obtidos com os novos do banco de dados)
 * save    (Salva o modelo)
 * destroy (Deleta o modelo)
 */
Modelo.Exame = Backbone.Model.extend({

  // O endereço REST onde iremos pegar os dados.
  urlRoot: "/exames",

  initialize: function () {
    
    // Cada um dos exames possue uma orientação a ser informada.
    this.exameOrientacoes = nestCollection(this, 'exameOrientacoes', new Colecao.ExameOrientacoes(this.get('exameOrientacoes')));
    this.exameOrientacoes.url = '/exames/' + this.id + '/ExameOrientacao';
  },
  
  // Aqui os atributos padrões deste modelo de exame.
  defaults: {
    id: null,   // Identificador
    nome: ""    //Nome do exame. Exemplo: 1,25 DIHIDROXI VITAMINA D3.
  }
});

/* Metodos básicos da coleção são
 *
 * add      (Adiciona novo modelo à coleção)
 * remove   (Remove o modelo da coleção)
 * fetch    (União dos dados já obtidos dos modelos desta coleção com os novos do banco de dados) 
 */
Colecao.Exames = Backbone.Collection.extend({

  model: Modelo.Exame,
  
  // O endereço REST onde iremos pegar os dados. 
  url: "/exames"

});