'use strict'

/* Objeto para lidar com o mapa do google que será utilizado na página de unidades */
window.gglMapa = {
  
  /* função chamada logo após o mapa for carregado. Ela é chamada porque adicionamos como uma propriedade no endereço fonte.
   * @Veja https://maps.googleapis.com/maps/api/js?key=AIzaSyCbi1li8ie5oMqH5pjgok6Y0Xb-NUrW3ag&callback=gglMapa.carregouMapaApi */
  carregouMapaApi: function () {
    this.seMapaApiPronto = true;
  },
  
  /* Função que retorna se a API do Google Mapas está carregada. */
  seMapaPronto: function() {
    return this.seMapaApiPronto;
  }
    
}