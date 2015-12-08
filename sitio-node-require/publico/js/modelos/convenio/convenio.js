'use strict'

/* @arquivo convenio.js */

define([
  'jquery',
  'backbone',
  'nesting',
  'underscore',
  'colecoes/convenios/infoConvenios'
], function($, Backbone, Nesting, _, ColecaoInfoConvenios){
  
  /* Metodos básicos dos modelos são
   *
   * fetch   (União dos dados já obtidos com os novos do banco de dados)
   * save    (Salva o modelo)
   * destroy (Deleta o modelo)
   */
  var Convenio = Backbone.Model.extend({

    // O endereço REST onde iremos pegar os dados.
    urlRoot: "/convenios",

    // Isso vai ser utilizado para quando formos pegar os dados 
    // das coleções aninhadas pertecentes a este modelo.
    colecoesAninhadas: [
      'infoConvenios'
    ],
    
    initialize: function () {
      
      // Cada um dos exames possue uma orientação a ser informada.
      this.infoConvenios = nestCollection(this, 'infoConvenios', new ColecaoInfoConvenios(this.get('infoConvenios')));
      this.infoConvenios.url = '/convenios/' + this.id + '/InfoConvenio';
    },
    
    // Aqui os atributos padrões deste modelo de exame.
    defaults: {
      id: null,   // Identificador
      nome: "",    //Nome do convenio. Exemplo: Arcelor Mittal - Associação beneficiente dos empregados da Arcelor Mittal Brasil.
      nome_elemento: "Ver as informações do convênio"
    }
  });
  
  return Convenio;
  
});