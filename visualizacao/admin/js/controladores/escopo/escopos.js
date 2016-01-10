'use strict'

/* Aqui realizamos a requisição dos escopos de determinado usuário que realizou entrada.
 *
 * @arquivo escopos.js
 */ 

/* Versão 0.0.1-Beta
 * - Adc. caracteristica de apresentação das visões de admin com base no escopo. (issue #50) [AFAZER]
 */
 
define([
  'jquery'
, 'backbone'
, 'utilitarios'
], function($, Backbone, Utilitarios){
  
  /* @Classe Escopos.
   *
   * Aqui nós vamos requisitar os escopos do usuário logo que ele realizar a entrada no painel.
   * Cada rota REST possui diversas bandeiras de acesso para os escopos.
   * Assim a gente vai saber quais são as bandeiras que este usuário possui para um determinado
   * escopo.
   --------------------------------------------------------------------------------------------*/
  var Escopos = function(ModeloSessao) {
    var esteObjeto = this;
    
    /* @Propriedade {Objeto} [modeloSessao] Armazena o modelo da sessão. */
    this.modeloSessao = ModeloSessao;
    
    /* @Propriedade {Pilha} [escopos] Armazena os escopos de determinado usuário 
     * que acaba de realizar a entrada. */
    this.escopos = [];
    
    // Espera os eventos da propriedade scope do modeloSessao.
    this.modeloSessao.on('change:scope', function (sessao) {
      esteObjeto._carregarEscopos();
    });
    esteObjeto._carregarEscopos();
  };
 
  /* @Método [Privado] _carregarEscopos().
   *
   * Carregamos aqui os escopos do usuário que acabou de realizar entrada no sistema.
   */
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