// Convertemos o google mapa em AMD.
define('gmapas', ['async!https://maps.google.com/maps/api/js?v=3&key=AIzaSyCbi1li8ie5oMqH5pjgok6Y0Xb-NUrW3ag&sensor=false'],
function(){
  // Retornamos o namespace do google mapas para facilitar.
  return window.google.maps;
});
