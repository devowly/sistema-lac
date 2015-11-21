'use strict'

/* @arquivo nossasUnidades.js */

var GMAPA_VERSAO = 3;

window.VisaoNossasUnidades = Backbone.View.extend({

  // Aqui adicionamos os diversos mapas.
  // Lembre-se que estamos utilizando esta forma que poderia ao inves ser carregada do banco de dados.
  unidade: [{
      titulo: 'Nossa unidade do centro de Montes Claros',
      pagEndereco: 'enderecoUnidade001.html',      // Página que contem endereço em XML
      nomeAba: 'CENTRO' // Nome da aba onde esta unidade irá ser apresentada.
    },
    {
      titulo: 'Nossa unidade do bairro Jardim Panorama de Montes Claros',
      pagEndereco: 'enderecoUnidade002.html',      // Página que contem endereço em XML
      nomeAba: 'JARDIM PANORAMA' // Nome da aba onde esta unidade irá ser apresentada.
    }
  ],
  
  // Cada unidade possui uma coordenada.
  unidadeCoordenada: [{
      coordenadas: {lat: -16.7244327, lng: -43.8715339}   // Coordenadas da unidade do centro de Montes Claros
    },
    {
      coordenadas: {lat: -16.7244327, lng: -43.8715339}   // Coordenadas da unidade do centro de Montes Claros
    }
  ],
  
  // Apenas para armazenar. Não iria estar no banco de dados.
  unidadeMapa: [{
      mapa: null,
      zoom: 15,
      marca: null
    },
    {
      mapa: null,
      zoom: 15,
      marca: null
    }
  ],
  
  unidadeVisoes: [{
      nomeElemento: 'mapaUnidade001'  // Nome do elemento onde iremos adicionar o mapa.
    },
    {
      nomeElemento: 'mapaUnidade002'  // Nome do elemento onde iremos adicionar o mapa.
    } 
  ],
  
  // Aqui armazenamos a lista das visões que esta visão vai utilizar.
  listaVisoes: [],
  
  quandoPronto: null,
  
  // Aqui iremos *simular* o join que iriamos fazer na database.
  unidadeUniao: [],
  
  initialize: function (cd) {
    var visoes = [];
    var quantidade = this.unidade.length;
    
    // Faz a união dos objetos, simulando de forma bastante *simples* um JOIN na database. 
    for (var i = 0; i < quantidade; i++) {
      if (this.unidade[i] && this.unidadeCoordenada[i] && this.unidadeMapa[i] && this.unidadeVisoes[i]) {
        this.unidadeUniao[i] = _.extend(this.unidade[i], this.unidadeCoordenada[i], this.unidadeMapa[i], this.unidadeVisoes[i]); 
        
        var nomeEl = this.unidadeUniao[i].nomeElemento;
        visoes[i] = nomeEl;
        this.listaVisoes[nomeEl] = {};
      }
    }
    
    this.quandoPronto = cd;
    
    // Procura no diretorio pagsEnderecosUnidades os templates e os carrega, salvando-os na lista.
    utilitarios.carregarTemplantesVisao(this.listaVisoes, 'pagsEnderecosUnidades/', visoes, this.render.bind(this));
    
    return this;
  },

  render: function () {
    // Carrega este template. É ideal carrega-lo agora, antes das outras visões.
    $(this.el).html(this.template());
  
    var quantidade = this.unidadeUniao.length;
    
    for (var i = 0; i < quantidade; i++) {
      
      // Necessário por que vamos marcar o primeiro elemento como ativo.
      this.unidadeUniao[i].indice = i;
       
      this.unidadeUniao[i].minhaVisao = this.listaVisoes[this.unidadeUniao[i].nomeElemento]; 
       
      if (this.unidadeUniao[i]) {
        // Adicionamos as abas.
        $('ul.nav-tabs', this.el).append(new VisaoUnidadeAba({model: this.unidadeUniao[i]}).render().el);
      
        // Adicionamos os conteúdos  
        $('div.tab-content', this.el).append(new VisaoUnidadeAbaConteudo({model: this.unidadeUniao[i]}).render().el);
      }
    }
    
    this.quandoPronto(this);
    
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
    mapa = new google.maps.Map( $('.embed-responsive > #' + nomeElem).get(0), {
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
  },
  
  // Faz o mapa re-aparecer
  // Sempre que houver troca de aba é necessário utilizar isso.
  // Eu não sei ainda se essa maneira está criando novos mapas a cada vez que uma aba é clicada.
  reiniciarMapa: function () {
    
    _.each(this.unidadeUniao, function(mapaObj) {
      
      if (GMAPA_VERSAO === 3) {
        google.maps.event.trigger(mapaObj.mapa, 'resize');
      } else if (GMAPA_VERSAO === 2) {
        mapaObj.mapa.checkResize()
      } else {
        console.log('Versão do mapa não disponível.');
      }
      
      // Centraliza e faz um zoom 
      mapaObj.mapa = this.centralizarMapa(mapaObj.coordenadas, mapaObj.zoom, mapaObj.nomeElemento);
    
      if (mapaObj.mapa) {
        // Adicionamos denovo a marca
        mapaObj.marca = this.adcrMarcadorMapa(mapaObj.mapa, mapaObj.coordenadas, mapaObj.titulo);
      } 
      
    }, this);
    
  },
  
  // Escutamos por eventos das abas.
  iniciarEventosParaAbas: function(item) {
    
    var esteObj = this;
    
    $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
      e.target // Nova aba ativada
      e.relatedTarget // aba previamente ativa.
      
      // Re-iniciamos o mapa.
      esteObj.reiniciarMapa();
    })
    
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
    $(this.el).attr('id', 'aba');
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
 * <div role="tabpanel" class="tab-pane active" id="Unidade1"> </div>
 *
 * @Carrega:
 * 
 *  <div class="col-md-3">
 *    <address>
 *      <strong>Laboratorio LAC</strong><br>
 *      Rua Coronel Spyer, Nº 509 - Centro<br>
 *      Montes Claros, MG. 39400-115<br>
 *      <abbr title="Phone">Fone:</abbr> (38) 3223-7636
 *    </address>
 *    <a href="mailto:#">lablac@laboratoriolac.com.br</a>
 *  </div>
 *  
 *  <div class="col-md-9">
 *    <div class="embed-responsive">
 *      <div id="mapaUnidade001" class="embed-responsive-item"></div>
 *    </div> 
 *  </div>
 *     
**/ 
window.VisaoUnidadeAbaConteudo = Backbone.View.extend({
  tagName: 'div',
  
  initialize: function () {
    $(this.el).addClass('tab-pane'); 
    $(this.el).attr('role', 'tabpanel');
  },

  render: function () {
    var meuModelo = this.model;
    
    // meuModelo = meuModelo.toJSON(); Descomentar isto se for utilizado coleção ou modelo
    
    // Coloca classe active no primeiro painel.
    if (meuModelo.indice == 0) $(this.el).addClass('active');
    
    $(this.el).attr('id', meuModelo.nomeElemento);
    
    $(this.el).html(meuModelo.minhaVisao.template(meuModelo));
    
    return this;
  }

});