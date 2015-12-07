'use strict'

/* @arquivo imagems.js 
 * 
 * Este arquivo organiza todas imagems básicas do sitio em base64.
 */

define([ 
  'imagems/base64/logo/imagems',
  'imagems/base64/slides/imagems'
], function(logo, slides) {

  // Armazenamos as diversas imagems b64 aqui nesta variavel constante.
  var IMAGEMS_BASE = [ ];
  
  IMAGEMS_BASE.IMAGEMS_LOGO = logo;
  IMAGEMS_BASE.IMAGEMS_SLIDES = slides;
  
  // Retornamos nossas imagems 
  return IMAGEMS_BASE;
});
