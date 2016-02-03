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
, 'controladores/eventos/eventos'
], function($, Backbone, _, ControladorEventos){
  
  /* @Variavel {Texto} [MODULO] Nome do módulo a que este sub-módulo pertence. */
  var MODULO = 'Exames';
  
  /* @Variavel {Controlador} [ctrldrEventos].
   * Responsavel por lidar com os diversos eventos dos módulos e dos sub-módulos. */
  var ctrldrEventos = new ControladorEventos();
  
  /* @Submodulo ExamesCriar().
   *
   --------------------------------------------------------------------------------------*/
  var ExamesCriar = function(Escopos) {
    
    /* @Propriedade {Utilitario} [escopos] Contêm métodos para lidarmos com os escopos e também
     * as bandeiras dos diversos módulos.  */
    this.escopos = Escopos;
    
    ctrldrEventos.adcEsperaPorEventoEmUmCanal(MODULO, 'Okay', (function(dados) {
      console.log(dados.OK);
    }).bind(this));
    
  };

  ExamesCriar.prototype.inicializar = function() {
    
  };
  
  return ExamesCriar;
});