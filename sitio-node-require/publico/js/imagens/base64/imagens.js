'use strict'

/* @arquivo imagems.js 
 * 
 * Este arquivo organiza todas imagems básicas do sitio em base64.
 */

define([ 
  'imagems/base64/logo/imagens',
  'imagems/base64/slides/imagens'
], function(logo, slides) {

  // Armazenamos as diversas imagems b64 aqui nesta variavel constante.
  var IMAGENS_BASE = [ ];
  
  IMAGENS_BASE.IMAGENS_LOGO = logo;
  IMAGENS_BASE.IMAGENS_SLIDES = slides;
  
  // Retornamos nossas imagems 
  return IMAGENS_BASE;
});
