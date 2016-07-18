/* @arquivo unidadesCriar.js */

/* Vers�o 0.0.1-Beta
 */
 
define([
  'jquery'
, 'backbone'
, 'underscore'
, 'eventos'
], function($, Backbone, _, Eventos){
  'use strict';
  
  /* @Variavel {Texto} [MODULO] Nome do m�dulo a que este sub-m�dulo pertence. */
  var MODULO = 'Unidades';
  
  /* @Variavel {Controlador} [ctrldrEventos].
   * Responsavel por lidar com os diversos eventos dos m�dulos e dos sub-m�dulos. */
  // var ctrldrEventos = new ControladorEventos();
  var evts = new Eventos();
  
  /* @Submodulo UnidadesCriar().
   *
   --------------------------------------------------------------------------------------*/
  var UnidadesCriar = function(Escopos) {
    
    /* @Propriedade {Utilitario} [escopos] Cont�m m�todos para lidarmos com os escopos e tamb�m
     * as bandeiras dos diversos m�dulos.  */
    this.escopos = Escopos;
    
    evts.subscrever(MODULO, 'Okay', 'sempreQuandoPublicado', function(dados) {
      console.log(dados.OK);
    }, this);
    
  };

  UnidadesCriar.prototype.inicializar = function() {
    
  };
  
  return UnidadesCriar;
});