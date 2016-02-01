'use strict'

/*
 * @arquivo unidadesCriar.js
 */ 

/* Versão 0.0.1-Beta
 */
 
define([
  'jquery'
, 'backbone'
, 'underscore'
, 'controladores/eventos/eventos'
], function($, Backbone, _, ControladorEventos){
  
  /* @Variavel {Texto} [MODULO] Nome do módulo a que este sub-módulo pertence. */
  var MODULO = 'Unidades';
  
  /* @Variavel {Controlador} [ctrldrEventos].
   * Responsavel por lidar com os diversos eventos dos módulos e dos sub-módulos. */
  var ctrldrEventos = null;
  
  /* @Submodulo UnidadesCriar().
   *
   --------------------------------------------------------------------------------------*/
  var UnidadesCriar = function(Escopos) {
    
    /* @Propriedade {Classe} [escopos] Contêm métodos para lidarmos com os escopos e também
     * as bandeiras dos diversos módulos.  */
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