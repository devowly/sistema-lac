'use strict'

/* @arquivo convenio.js */

define([
  'jquery',
  'backbone',
  'nesting',
  'underscore',
  'colecoes/convenios/infoConvenios'
], function($, Backbone, Nesting, _, ColecaoInfoConvenios){
  
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
      // Aqui nós substituimos a url da ColecaoInfoConvenios
      this.infoConvenios = nestCollection(this, 'infoConvenios', new ColecaoInfoConvenios(this.get('infoConvenios')));
      this.infoConvenios.url = '/convenios/' + this.id + '/InfoConvenio';
    },
    
    // Aqui os atributos padrões deste modelo de convenio.
    defaults: {
      id: null,                                        // Identificador deste convenio.
      nome: "",                                        //Nome do convenio. Exemplo: Arcelor Mittal
      nome_elemento: "Ver as informações do convênio",
      descricao: ""                                    // Descrição do convenio. Exemplo: Arcelor Mittal - Associação beneficiente dos empregados da Arcelor Mittal Brasil.
    }
  });
  
  return Convenio;
  
});