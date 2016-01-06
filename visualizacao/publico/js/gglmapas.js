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
   * @Parametro {Objeto} [coordenadas] As coordenadas de determinado ponto no mapa.
   * @Parametro {Número} [coordenadas.lat] A latitude da coordenada.
   * @Parametro {Número} [coordenadas.lng] A longitude da coordenada.
   * @Parametro {Número} [zoom] O nível de zoom que será aplicado.
   * @Parametro {Elemento} [$elemento] Um elemento na página, onde será acrescentado o mapa. (ex., uma div ou span).
   * @Retorno {Objeto|nulo} O objeto do novo mapa criado ou nulo.
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
  
  /* Responsavel por adicionar um marcador no mapa e também centraliza-lo, para ficar mais fácil de localizar o 
   * a posição onde se encontra determinado ponto  no mapa.
   *
   * @Parametro {Objeto} [mapa] O nosso mapa.
   * @Parametro {Objeto} [coordenadas] As coordenadas de determinado ponto no mapa.
   * @Parametro {Número} [coordenadas.lat] A latitude da coordenada.
   * @Parametro {Número} [coordenadas.lng] A longitude da coordenada.
   * @Parametro {Texto} [titulo] O título que ajuda a descrever determinado ponto.
   * @Retorno {Objeto|nulo} A marca do mapa que é criada ou nulo se algo dar errado.
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
   * @Parametro {Objeto} [mapa] O nosso mapa.
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