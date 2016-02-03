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
, 'controladores/eventos/eventos'
], function($, Backbone, _, ControladorEventos){
  
  /* @Variavel {Texto} [MODULO] Nome do m�dulo a que este sub-m�dulo pertence. */
  var MODULO = 'Exames';
  
  /* @Variavel {Controlador} [ctrldrEventos].
   * Responsavel por lidar com os diversos eventos dos m�dulos e dos sub-m�dulos. */
  var ctrldrEventos = new ControladorEventos();
  
  /* @Submodulo ExamesCriar().
   *
   --------------------------------------------------------------------------------------*/
  var ExamesCriar = function(Escopos) {
    
    /* @Propriedade {Utilitario} [escopos] Cont�m m�todos para lidarmos com os escopos e tamb�m
     * as bandeiras dos diversos m�dulos.  */
    this.escopos = Escopos;
    
    ctrldrEventos.adcEsperaPorEventoEmUmCanal(MODULO, 'Okay', (function(dados) {
      console.log(dados.OK);
    }).bind(this));
    
  };

  ExamesCriar.prototype.inicializar = function() {
    
  };
  
  return ExamesCriar;
});