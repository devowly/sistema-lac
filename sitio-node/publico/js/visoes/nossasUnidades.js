'use strict'

/* @arquivo nossasUnidades.js */

// Como adicionar forma de carregar vários mapas atraves deste código? digo, sem utilizar modelos.

window.VisaoNossasUnidades = Backbone.View.extend({

  // Aqui adicionamos os diversos mapas.
  // Lembre-se que estamos utilizando esta forma que poderia ao inves ser carregada do banco de dados.
  unidade: [{
      nomeElemento: 'mapaUnidade001',                      // Nome do elemento onde iremos adicionar o mapa.
      titulo: 'Nossa unidade do centro de Montes Claros',
      pagEndereco: 'enderecoUnidade001.html',      // Página que contem endereço em XML
      nomeAba: 'CENTRO' // Nome da aba onde esta unidade irá ser apresentada.
    }
  ],
  
  // Cada unidade possui uma coordenada.
  unidadeCoordenada: [{
      coordenadas: {lat: -16.7244327, lng: -43.8715339}   // Coordenadas da unidade do centro de Montes Claros
    }
  ],
  
  // Apenas para armazenar. Não iria estar no banco de dados.
  unidadeMapa: [{
      mapa: null,
      zoom: 15,
      marca: null
    }
  ],
  
  // Aqui iremos *simular* o join que iriamos fazer na database.
  unidadeUniao: [],
  
  initialize: function () {
 
    var quantidade = this.unidade.length;
    
    // Faz a união dos objetos, simulando de forma bastante *simples* um JOIN na database. 
    for (var i = 0; i < quantidade; i++) {
      if (this.unidade[i] && this.unidadeCoordenada[i] && this.unidadeMapa[i]) {
        this.unidadeUniao[i] = _.extend(this.unidade[i], this.unidadeCoordenada[i], this.unidadeMapa[i]); 
      }
    }
    
    this.render();
  },

  render: function () {
  
    // Carrega este template
    $(this.el).html(this.template());
    
    var quantidade = this.unidadeUniao.length;
    
    for (var i = 0; i < quantidade; i++) {
      
      // Necessário por que vamos marcar o primeiro elemento como ativo.
      this.unidadeUniao[i].indice = i;
       
      if (this.unidadeUniao[i]) {
        // Adicionamos as abas.
        $('ul.nav-tabs', this.el).append(new VisaoUnidadeAba({model: this.unidadeUniao[i]}).render().el);
      
        // Adicionamos os conteúdos  
        $('div.tab-content', this.el).append(new VisaoUnidadeAbaConteudo({model: this.unidadeUniao[i]}).render().el);
      }
     
    }
    
    return this;
  },
  
  iniciarCadaMapa: function () {
    
    // Para cada um dos objetos iremos iniciar o mapa e adicionar um marcador.
    _.each(this.unidadeUniao, function(mapaObj) {
      
      // Centraliza e dá um zoom 
      mapaObj.mapa = this.centralizarMapa(mapaObj.coordenadas, mapaObj.zoom, mapaObj.nomeElemento);
    
      if (mapaObj.mapa) {
        // Coloca uma marca de unidade no mapa
        mapaObj.marca = this.adcrMarcadorMapa(mapaObj.mapa, mapaObj.coordenadas, mapaObj.titulo);
      } 
    }, this);
   
  },
  
  centralizarMapa: function (coordenadas, nivelZoom, nomeElem) {
    var mapa;
    
    // Centraliza e faz um zoom 
    mapa = new google.maps.Map( $('#' + nomeElem).get(0), {
      center: coordenadas,
      zoom: nivelZoom
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
  }

});

/* @Elemento 
 * <li role="presentation" class="active"> 
 *   <a href="#Unidade1" aria-controls="Unidade1" role="tab" data-toggle="tab">
 *     CENTRO 
 *     <span class="fa fa-map-marker fa-1x" aria-hidden="true"></span>
 *   </a>
 * </li> 
**/
window.VisaoUnidadeAba = Backbone.View.extend({

  tagName: 'li',
  
  initialize: function () {
    $(this.el).attr('role', 'presentation');
  },

  render: function () {
    var meuModelo = this.model;
    
    // meuModelo = meuModelo.toJSON(); Descomentar isto se for utilizado coleção ou modelo
    
    // Coloca classe active na primeira aba.
    if (meuModelo.indice == 0) $(this.el).addClass('active');
     
    var conteudoAba = '<a href="#' + meuModelo.nomeElemento + '" aria-controls="'+ meuModelo.nomeElemento +'" role="tab" data-toggle="tab">';
    conteudoAba += meuModelo.nomeAba;
    conteudoAba += ' <span class="fa fa-map-marker fa-1x" aria-hidden="true"></span></a>';
    
    $(this.el).append(conteudoAba);
     
    return this;
  }

});

/* @Elemento:
 * <div class="tab-content"></div>
**/ 
window.VisaoUnidadeAbaConteudo = Backbone.View.extend({
  tagName: 'div',
  
  initialize: function () {
    $(this.el).addClass('tab-content');
  },

  render: function () {
    var meuModelo = this.model;
    
    // meuModelo = meuModelo.toJSON(); Descomentar isto se for utilizado coleção ou modelo
    
    
    //$(this.el).html(this.template(modeloJsonObj));
    return this;
  }

});