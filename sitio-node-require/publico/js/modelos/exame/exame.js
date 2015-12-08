'use strict'

/* @arquivo exame.js */

define([
  'jquery',
  'backbone',
  'nesting',
  'underscore',
  'colecoes/exames/exameOrientacoes'
], function($, Backbone, Nesting, _, ColecaoExameOrientacoes){
  
  /* Metodos básicos dos modelos são
   *
   * fetch   (União dos dados já obtidos com os novos do banco de dados)
   * save    (Salva o modelo)
   * destroy (Deleta o modelo)
   */
  var Exame = Backbone.Model.extend({

    // O endereço REST onde iremos pegar os dados.
    urlRoot: "/exames",

    // Isso vai ser utilizado para quando formos pegar os dados 
    // das coleções aninhadas pertecentes a este modelo.
    colecoesAninhadas: [
      'exameOrientacoes'
    ],
    
    initialize: function () {
      
      // Cada um dos exames possue uma orientação a ser informada.
      this.exameOrientacoes = nestCollection(this, 'exameOrientacoes', new ColecaoExameOrientacoes(this.get('exameOrientacoes')));
      this.exameOrientacoes.url = '/exames/' + this.id + '/ExameOrientacao';
    },
    
    // Aqui os atributos padrões deste modelo de exame.
    defaults: {
      id: null,   // Identificador
      nome: "",    //Nome do exame. Exemplo: 1,25 DIHIDROXI VITAMINA D3.
      nome_elemento: "Ver instruções do exame"
    }
  });
  
  return Exame;
  
});