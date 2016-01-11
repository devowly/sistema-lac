'use strict'

/* @arquivo escopos.js */

 define([
  'jquery'
, 'backbone'
, 'underscore'
, 'modelos/escopo/escopo'
], function($, Backbone, _, ModeloEscopo){
  
  /* A coleção tem como objetivo contem um conjunto de modelos. Estes modelos compartilham
   * mesma propriedades. Além disso, a coleção possui vários métodos para gerencia destes modelos.
   * Alguns dos metodos básicos de uma coleção são:
   *
   * add      (Adiciona novo modelo à coleção)
   * remove   (Remove o modelo da coleção)
   * fetch    (União dos dados já obtidos dos modelos desta coleção com os novos do banco de dados) 
   * sync     (Faz persistir o estado de uma coleção com o servidor. Pode ser substituido por uma customização)
   * toJSON   (Retorna uma pilha contendo os atributos de cada modelo no estilo hash) 
   * reset    (Adiciona e remove os modelos um de cada vez, isso faz com que uma coleção nova de modelos seja atribuida à coleção)
   * set      (Este método realiza uma atualização da coleção com a lista de modelos informada)
   * get      (Requesita um modelo desta coleção, especificado por um id ou cid ou passando um modelo) 
   *
   * @veja http://backbonejs.org/#Collection
   */
   
  /* @Coleção Escopos().
   *
   * A coleção dos escopos.
   ---------------------------------------------------------------*/
  var Escopos = Backbone.Collection.extend({

    /* @Propriedade {Objeto} [model] O modelo desta coleção. */
    model: ModeloEscopo,
    
    /* @Propriedade {Texto} [url] O endereço REST onde iremos pegar os dados. 
     * Obs: Esta url será substituida pelo Modelo.Sessao */ 
    url: 'escopos'

  });
  
  return Escopos;
});