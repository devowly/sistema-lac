'use strict'

/* Aqui realizamos o controle dos escopos.
 *
 * @arquivo escopos.js
 */ 

/* Versão 0.0.1-Beta
 * - Adc. caracteristica de apresentação das visões de admin com base no escopo. (issue #50) [AFAZER]
 */
 
define([
  'jquery',
  'backbone',
  'utilitarios'
], function($, Backbone, Utilitarios){
  
  var Escopos = function(ModeloSessao) {
    var esteObjeto = this;
    this.modeloSessao = ModeloSessao;
    this.escopos = [];
    
    // Espera os eventos da propriedade scope do modeloSessao.
    this.modeloSessao.on('change:scope', function (sessao) {
      esteObjeto._carregarEscopos();
    });
    esteObjeto._carregarEscopos();
  };
 
  Escopos.prototype._carregarEscopos = function() {
    var esteObjeto = this;
    
    if (this.modeloSessao.get('scope')) {
      // Caso tudo ocorra bem, então, nós iremos acessar a coleção de escopos.
      Utilitarios.carregarColecao([esteObjeto.modeloSessao.escopos], function(){
        
        for(var ca = 0; ca < esteObjeto.modeloSessao.escopos.length; ca++){ 
          // Veja que cada modelo de escopo possui o nome do modelo (tabela) no banco de dados e também o valor da bandeira de acesso.
          // Com estes valores em mãos nós podemos *montar* aqui a nossa interface do usuário.
          var escopo = {
            modelo: esteObjeto.modeloSessao.escopos.models[ca].get('model')
          , bandeira: esteObjeto.modeloSessao.escopos.models[ca].get('flag')
          };
          esteObjeto.escopos.push(escopo);
        }
      }); 
    }
  };
  
  return Escopos;
});