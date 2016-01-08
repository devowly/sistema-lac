'use strict'

/* @arquivo escopo.js */

 define([
  'jquery'
, 'backbone'
, 'underscore'
], function($, Backbone, _){

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
   
  /* @Modelo Escopo().
   *
   * Responsável por armazenar os valores dos modelos de escopo.
   ---------------------------------------------------------------------*/
  var Escopo = Backbone.Model.extend({

    /* @Propriedade {Texto} [urlRoot] O endereço REST onde iremos pegar os dados. 
     */
    urlRoot: 'escopos',

    /* @Construtor initialize().
     *
     * Aqui realizamos o inicio do nosso modelo. 
     */
    initialize: function () {
        
    },

    /* @Propriedade {Objeto} [defaults] Contêm os atributos padrões deste modelo de escopo.
     * Lembre-se que estes atributos podem *não* estar armazenados no modelo do banco de dados.
     * Eu utilizo alguns destes atributos fora do modelo para utilizar os eventos.     
     */
    defaults: {
      model: null  // O modelo 
    , flag: null   // Bandeira com valores de acesso.
    }
  });

  return Escopo;
});