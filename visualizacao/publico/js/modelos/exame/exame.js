'use strict'

/* @arquivo exame.js */

define([
  'jquery',
  'backbone',
  'nesting',
  'underscore',
  'configuracao',
  'colecoes/exames/exameOrientacoes'
], function($, Backbone, Nesting, _, Configuracao, ColecaoExameOrientacoes){
  
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
  var Exame = Backbone.Model.extend({

    // O endereço REST onde iremos pegar os dados.
    urlRoot: Configuracao.cors.serverAddress + "exames",

    // Isso vai ser utilizado para quando formos pegar os dados 
    // das coleções aninhadas pertecentes a este modelo.
    colecoesAninhadas: [
      'exameOrientacoes'
    ],
    
    initialize: function () {
      
      // Cada um dos exames possue uma orientação a ser informada.
      // Aqui nós substituimos a url de ColecaoExameOrientacoes.
      this.exameOrientacoes = nestCollection(this, 'exameOrientacoes', new ColecaoExameOrientacoes(this.get('exameOrientacoes')));
      this.exameOrientacoes.url = Configuracao.cors.serverAddress + 'exames/' + this.id + '/ExameOrientacao';
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