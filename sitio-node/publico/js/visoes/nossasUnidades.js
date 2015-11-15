'use strict'

window.VisaoNossasUnidades = Backbone.View.extend({

  initialize: function () {
    this.render();
  },

  render: function () {
    // Renderiza este template
    $(this.el).html(this.template());
    return this;
  },
  
  iniciarMapa: function () {
    
    // Afazer: Adicionar forma de carregar diversos mapas, cada um com coordenadas diferentes.
    
    var coordenadas = [];
    var nivelZoom = 15;
    var nomeElem = 'mapaUnidade001';
    var mapa = null;
    var marca = null;
    
    // Coordenadas da unidade do centro de Montes Claros
    coordenadas['#mapaUnidade001'] = {lat: -16.7244327, lng: -43.8715339};
    
    mapa = this.centralizaMapa(coordenadas['#mapaUnidade001'], nivelZoom, nomeElem);

    if (mapa) {
      marca = this.adcMarcadorMapa(mapa, coordenadas['#mapaUnidade001'], 'Nossa unidade do centro de Montes Claros');
    } 
    
  },
  
  centralizaMapa: function (coordenadas, nivelZoom, nomeElem) {
    var mapa;
    // Centraliza e dá um zoom de 15
    mapa = new google.maps.Map( $('#' + nomeElem).get(0), {
      center: coordenadas,
      zoom: nivelZoom
    });
    
    return mapa;
  },
  
  adcMarcadorMapa: function (mapa, coordenadas, titulo) {
  
    // Coloca uma marca de unidade no mapa
    var marca = new google.maps.Marker({
      position: coordenadas,
      map: mapa,
      title: titulo
    }); 
    
    return marca;
  }

});


