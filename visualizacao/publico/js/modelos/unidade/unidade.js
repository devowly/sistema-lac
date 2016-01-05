'use strict'

/* @arquivo unidade.js */

 define([
  'jquery',
  'backbone',
  'nesting',
  'underscore',
  'configuracao',
  'colecoes/unidades/unidadeMapas'
], function($, Backbone, nesting, _, Configuracao, ColecaoUnidadeMapas){
 
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
  var Unidade = Backbone.Model.extend({

    // O endereço REST onde iremos pegar os dados.
    urlRoot: Configuracao.cors.serverAddressSsl + "unidades",

    // Isso vai ser utilizado para quando formos pegar os dados 
    // das coleções aninhadas pertecentes a este modelo.
    colecoesAninhadas: [
      'unidadeMapas'
    ], 
    
    initialize: function () {
      
      // Cada uma das unidades possue um zoom e coordenadas para o mapa
      // Aqui nós substituimos a url de ColecaoUnidadeMapas.
      this.unidadeMapas = nestCollection(this, 'unidadeMapas', new ColecaoUnidadeMapas(this.get('unidadeMapas')));
      this.unidadeMapas.url = Configuracao.cors.serverAddressSsl + 'unidades/' + this.id + '/UnidadeMapa';
    },
    
    // Aqui os atributos padrões deste modelo de unidade.
    defaults: {
      id: null,            // Identificador
      titulo: "",          // Titulo da unidade. Exemplo: Nossa unidade do centro de Montes Claros.
      pagina_endereco: "", // Página que contem endereço em XML. Exemplo: enderecoUnidade002.html
      nome_elemento: "",   // Nome do elemento onde iremos adicionar o mapa. Exemplo: mapaUnidade002
      nome_aba: ""         // Nome da aba onde esta unidade irá ser apresentada. Exemplo: JARDIM PANORAMA.
    }
  });

  return Unidade;
});