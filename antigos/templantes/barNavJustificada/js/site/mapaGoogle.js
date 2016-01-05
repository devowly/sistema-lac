'use strict'

/* Afazer: Adicionar forma de carregar diversos mapas, cada um com coordenadas diferentes.
 */
function centralizaMapa (coordenadas, nivelZoom, nomeElemDom) {
  
  var mapa;
  // Centraliza e dá um zoom de 15
  mapa = new google.maps.Map(document.getElementById(nomeElemDom), {
    center: coordenadas,
    zoom: nivelZoom
  });
  
  return mapa;
}

function adcMarcadorMapa(mapa, coordenadas, titulo) {
  
  // Coloca uma marca de unidade no mapa
  var marca = new google.maps.Marker({
    position: coordenadas,
    map: mapa,
    title: titulo
  }); 
  
  return marca;
}

/* função chamada logo após o mapa for carregado. Ela é chamada porque adicionamos como uma propriedade no endereço fonte.
 * @Veja https://maps.googleapis.com/maps/api/js?key=AIzaSyCbi1li8ie5oMqH5pjgok6Y0Xb-NUrW3ag&callback=iniciarMapa
 */
function iniciarMapa() {
  var coordenadas = [];
  var nivelZoom = 15;
  var nomeElemDom = 'mapa';
  var mapa = null;
  var marca = null;
  
  // Coordenadas da unidade 
  coordenadas['#mapa'] = {lat: -16.7244327, lng: -43.8715339};
  
  mapa = centralizaMapa(coordenadas['#mapa'], nivelZoom, nomeElemDom);
  
  if (mapa) {
    marca = adcMarcadorMapa(mapa, coordenadas['#mapa'], 'Unidade título');
  } 
}