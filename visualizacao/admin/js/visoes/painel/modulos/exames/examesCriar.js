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
], function($, Backbone, _){
  
  /* @Propriedade {Evento} [eventos] Armazena uma extenção dos eventos do Backbone. */
  var eventos = null;
  
  /* @Classe ExamesCriar().
   *
   --------------------------------------------------------------------------------------*/
  var ExamesCriar = function(Escopos, evts) {
    
    /* @Propriedade {Classe} [escopos] Contêm métodos para lidarmos com os escopos e também
     * as bandeiras dos diversos módulos.  */
    this.escopos = Escopos;
    
    eventos = evts;
  };

  ExamesCriar.prototype.inicializar = function() {
    
  };
  
  return ExamesCriar;
});