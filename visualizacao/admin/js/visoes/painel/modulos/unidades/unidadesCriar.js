/* @arquivo unidadesCriar.js */

/* Versão 0.0.1-Beta
 */
 
define([
  'jquery'
, 'backbone'
, 'underscore'
, 'eventos'
], function($, Backbone, _, Eventos){
  'use strict';
  
  /* @Variavel {Texto} [MODULO] Nome do módulo a que este sub-módulo pertence. */
  var MODULO = 'Unidades';
  
  /* @Variavel {Controlador} [ctrldrEventos].
   * Responsavel por lidar com os diversos eventos dos módulos e dos sub-módulos. */
  // var ctrldrEventos = new ControladorEventos();
  var evts = new Eventos();
  
  /* @Submodulo UnidadesCriar().
   *
   --------------------------------------------------------------------------------------*/
  var UnidadesCriar = function(Escopos) {
    
    /* @Propriedade {Utilitario} [escopos] Contêm métodos para lidarmos com os escopos e também
     * as bandeiras dos diversos módulos.  */
    this.escopos = Escopos;
    
    evts.subscrever(MODULO, 'Okay', 'sempreQuandoPublicado', function(dados) {
      console.log(dados.OK);
    }, this);
    
  };

  UnidadesCriar.prototype.inicializar = function() {
    
  };
  
  return UnidadesCriar;
});