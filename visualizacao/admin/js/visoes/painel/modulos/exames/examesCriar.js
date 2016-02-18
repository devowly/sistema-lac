'use strict'

/*
 * @arquivo examesCriar.js
 */ 

/* Vers�o 0.0.1-Beta
 */
 
define([
  'jquery'
, 'backbone'
, 'underscore'
, 'eventos'
], function($, Backbone, _, Eventos){
  
  /* @Variavel {Texto} [MODULO] Nome do m�dulo a que este sub-m�dulo pertence. */
  var MODULO = 'Exames';
  var SUB_MODULO = 'ExamesCriar';
  var CANAL = 'modulo:exames';
  var MODELO = 'Exame';
  
  /* @Variavel {Utilitario} [evts].
   * Responsavel por lidar com os diversos eventos dos m�dulos e dos sub-m�dulos. */
  var evts = new Eventos();
  
  /* @Submodulo ExamesCriar().
   *
   --------------------------------------------------------------------------------------*/
  var ExamesCriar = function(Escopos) {
    
    /* @Propriedade {Utilitario} [escopos] Cont�m m�todos para lidarmos com os escopos e tamb�m
     * as bandeiras dos diversos m�dulos.  */
    this.escopos = Escopos;
    
    evts.subscrever(CANAL, 'Okay', 'sempreQuandoPublicado', function(dados) {
      console.log(dados.OK);
    }, this);
    
  };

  ExamesCriar.prototype.inicializar = function() {
    
  };
  
  return ExamesCriar;
});