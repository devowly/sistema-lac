'use strict'

/* Objeto para lidar com o mapa do google que será utilizado na página de unidades 
 * @Veja http://blog.millermedeiros.com/requirejs-2-0-delayed-module-evaluation-and-google-maps/
 */

define([
  'gmapas'
], function(gmapa){
  
  /* A versão da API para o mapa. Neste momento, 
   * só adicionamos o suporte a apenas a versão 2 e 3 do google mapas.
   */
  var GMAPA_VERSAO = 3;   
  
  /* Responsavel por centralizar e aplicar um zoom no mapa do google.
   *
   * @Parametro {coordenadas} As coordenadas de determinado ponto no mapa.
   * @Parametro {zoom} O nível do zoom que será aplicado.
   * @Parametro {$elemento} Um elemento na página, onde será acrescentado o mapa.
   * @Retorno {mapa} O novo mapa criado.
   */
  var centralizarMapa = function (coordenadas, zoom, $elemento) {
    var mapa = null;
    
    // Centraliza e faz um zoom 
    mapa = new gmapa.Map( $elemento , {
      center: coordenadas,
      zoom: zoom
    });
    
    return mapa;
  };
  
  /* Responsavel por adicionar um marcador no mapa, para ficar mais fácil de localizar o 
   * a posição onde se encontra determinado ponto  no mapa.
   *
   * @Parametro {mapa} Objeto do mapa.
   * @Parametro {coordenada} As coordenadas de determinado ponto no mapa.
   * @Parametro {titulo} O título que ajuda a descrever determinado ponto.
   * @Retorno {marca} A marca do mapa que é criada.
   */
  var adcrMarcadorMapa = function (mapa, coordenadas, titulo) {
    var marca = null;
    
    // Coloca uma marca de unidade no mapa na posição das coordenadas informadas.
    marca = new gmapa.Marker({
      position: coordenadas,
      map: mapa,
      title: titulo
    }); 
    
    return marca;
  };
  
  /* Responsável pelo redimensionamento do mapa porque quando mudamos de visão o mapa é apagado.
   *
   * @Parametro {mapa} Objeto do mapa.
   */
  var redimensionarMapa = function(mapa) {
    
    if (GMAPA_VERSAO === 3) {
      gmapa.event.trigger(mapa, 'resize');
    } else if (GMAPA_VERSAO === 2) {
      mapa.checkResize();
    } else {
      console.log('Versão do mapa não disponível.');
    }
  };
  
  // Nós retornamos os modulos.
  return { 
    centralizarMapa: centralizarMapa,
    adcrMarcadorMapa: adcrMarcadorMapa,
    redimensionarMapa: redimensionarMapa
  };
});