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
], function($, Backbone, _){
  
  /* @Propriedade {Evento} [eventos] Armazena uma exten��o dos eventos do Backbone. */
  var eventos = null;
  
  /* @Classe ExamesCriar().
   *
   --------------------------------------------------------------------------------------*/
  var ExamesCriar = function(Escopos, evts) {
    
    /* @Propriedade {Classe} [escopos] Cont�m m�todos para lidarmos com os escopos e tamb�m
     * as bandeiras dos diversos m�dulos.  */
    this.escopos = Escopos;
    
    eventos = evts;
  };

  ExamesCriar.prototype.inicializar = function() {
    
  };
  
  return ExamesCriar;
});