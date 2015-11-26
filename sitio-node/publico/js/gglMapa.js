'use strict'

/* Objeto para lidar com o mapa do google que será utilizado na página de unidades */
Global.gglMapa = {
  
  // Versão da API para o mapa.
  GMAPA_VERSAO: 3,
  
  seMapaApiPronto: false, 
  
  /* função chamada logo após o mapa for carregado. Ela é chamada porque adicionamos como uma propriedade no endereço fonte.
   * @Veja https://maps.googleapis.com/maps/api/js?key=API-KEY&callback=gglMapa.carregouMapaApi */
  carregouMapaApi: function () {
    this.seMapaApiPronto = true;
  },
  
  /* Função que retorna se a API do Google Mapas está carregada. */
  seMapaPronto: function() {
    return this.seMapaApiPronto;
  },

  centralizarMapa: function (coordenadas, zoom, $elemento) {
    var mapa;
    
    // Centraliza e faz um zoom 
    mapa = new google.maps.Map( $elemento , {
      center: coordenadas,
      zoom: zoom
    });
    
    return mapa;
  },
  
  adcrMarcadorMapa: function (mapa, coordenadas, titulo) {
  
    // Coloca uma marca de unidade no mapa na posição das coordenadas informadas.
    var marca = new google.maps.Marker({
      position: coordenadas,
      map: mapa,
      title: titulo
    }); 
    
    return marca;
  },
  
  redimensionarMapa: function(mapa) {
    
    if (this.GMAPA_VERSAO === 3) {
      google.maps.event.trigger(mapa, 'resize');
    } else if (this.GMAPA_VERSAO === 2) {
      mapa.checkResize();
    } else {
      console.log('Versão do mapa não disponível.');
    }
  }
}