'use strict'

/*
 * @arquivo unidadesCriar.js
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
  var MODULO = 'Unidades';
  
  /* @Variavel {Controlador} [ctrldrEventos].
   * Responsavel por lidar com os diversos eventos dos m�dulos e dos sub-m�dulos. */
  var ctrldrEventos = null;
  
  /* @Submodulo UnidadesCriar().
   *
   --------------------------------------------------------------------------------------*/
  var UnidadesCriar = function(Escopos) {
    
    /* @Propriedade {Classe} [escopos] Cont�m m�todos para lidarmos com os escopos e tamb�m
     * as bandeiras dos diversos m�dulos.  */
    this.escopos = Escopos;
    
    ctrldrEventos = new ControladorEventos();
    ctrldrEventos.adcEsperaPorEventoEmUmCanal(MODULO, 'Okay', (function(dados){
      console.log(dados.OK);
    }).bind(this));
    
  };

  UnidadesCriar.prototype.inicializar = function() {
    
  };
  
  return UnidadesCriar;
});