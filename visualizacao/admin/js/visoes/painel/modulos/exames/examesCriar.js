'use strict'

/*
 * @arquivo examesCriar.js
 */ 

/* Versão 0.0.1-Beta
 */
 
define([
  'jquery'
, 'backbone'
, 'underscore'
, 'eventos'
], function($, Backbone, _, Eventos){
  
  /* @Variavel {Texto} [MODULO] Nome do módulo a que este sub-módulo pertence. */
  var MODULO = 'Exames';
  var SUB_MODULO = 'ExamesCriar';
  var CANAL = 'modulo:exames';
  var MODELO = 'Exame';
  
  /* @Variavel {Utilitario} [evts].
   * Responsavel por lidar com os diversos eventos dos módulos e dos sub-módulos. */
  var evts = new Eventos();
  
  /* @Submodulo ExamesCriar().
   *
   --------------------------------------------------------------------------------------*/
  var ExamesCriar = function(Escopos) {
    
    /* @Propriedade {Utilitario} [escopos] Contêm métodos para lidarmos com os escopos e também
     * as bandeiras dos diversos módulos.  */
    this.escopos = Escopos;
    
    evts.subscrever(CANAL, 'Okay', 'sempreQuandoPublicado', function(dados) {
      console.log(dados.OK);
    }, this);
    
  };

  ExamesCriar.prototype.inicializar = function() {
    
  };
  
  return ExamesCriar;
});