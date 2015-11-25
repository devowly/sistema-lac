'use strict'

/* @arquivo nossasUnidades.js */

/* Versão 0.0.1-Beta
 * - Adc caracteristicas básicas para a visão. [FEITO]
 * - Adicionar forma de realizar o re-inicio do mapa para apenas a aba que estiver aberta. (issue #1) (f43ba72653466e6a9ce7dedf4128bdc240bccb66) [FEITO]
 * - Carregar dados das unidades pelo banco de dados. (issue #2) (9e832dd11688bfd27b51ca1a22a13d675388174a) [FEITO]
 */

var UTILIZAR_BANCO_UNIDADE = true; // Se utilizar o banco os dados serão carregados pelo banco de dados. 
 
window.VisaoNossasUnidades = Backbone.View.extend({

  // União dos dados carregados do banco de dados.
  unidadeUniaoDB: [],
  
  // Aqui adicionamos os diversos mapas.
  // Lembre-se que estamos utilizando esta forma que poderia ao inves ser carregada do banco de dados.
  unidade: [{
      titulo: 'Nossa unidade do centro de Montes Claros',
      pagina_endereco: 'enderecoUnidade001.html',      // Página que contem endereço em XML
      nome_aba: 'CENTRO' // Nome da aba onde esta unidade irá ser apresentada.
    },
    {
      titulo: 'Nossa unidade do bairro Jardim Panorama de Montes Claros',
      pagina_endereco: 'enderecoUnidade002.html',      // Página que contem endereço em XML
      nome_aba: 'JARDIM PANORAMA' // Nome da aba onde esta unidade irá ser apresentada.
    },
    {
      titulo: 'Nossa unidade do bairro Todos os Santos de Montes Claros',
      pagina_endereco: 'enderecoUnidade003.html',      // Página que contem endereço em XML
      nome_aba: 'TODOS OS SANTOS' // Nome da aba onde esta unidade irá ser apresentada.
    }
  ],
  
  // Cada unidade possui uma coordenada.
  unidadeCoordenada: [{
      coordenadas: {lat: -16.7244327, lng: -43.8715339}   // Coordenadas da unidade do centro de Montes Claros
    },
    {
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
    },
    {
      mapa: null,
      zoom: 15,
      marca: null
    }
  ],
  
  unidadeVisoes: [{
      nome_elemento: 'mapaUnidade001'  // Nome do elemento onde iremos adicionar o mapa.
    },
    {
      nome_elemento: 'mapaUnidade002'  // Nome do elemento onde iremos adicionar o mapa.
    },
    {
      nome_elemento: 'mapaUnidade003'  // Nome do elemento onde iremos adicionar o mapa.
    }  
  ],
  
  // Aqui armazenamos a lista do templante que esta visão vai utilizar.
  listaTemplantes: [],
  
  quandoPronto: null,
  
  // Aqui iremos *simular* o join que iriamos fazer na database.
  unidadeUniao: [],
  
  initialize: function () {
    
    return this;
  },

  carregarTemplantes: function(cd) {
    var visoes = [];
    var quantidadeUnidades = 0;
    var esteObj = this;
    
    if (UTILIZAR_BANCO_UNIDADE) {
      
      var unidades = this.model.models;
      quantidadeUnidades = unidades.length;
      var unidadeJson = null;
      
      // Para cada uma das nossas unidades
      for (var i = 0; i < quantidadeUnidades; i++) {
        
        // Transforma em JSON para podermos manipular e acessar as propriedades do modelo.
        unidadeJson = unidades[i].toJSON();
        
        // Pegamos o nome da nossa visão
        var nomeEl = unidadeJson.nome_elemento;
        
        // Vai armazenar o nome de cada uma das visões em visoes[i].
        visoes[i] = nomeEl;
        
        // Para cada visão iremos armazenar aqui os templantes.
        this.listaTemplantes[nomeEl] = {};
        
      }
     
    } 
    // Utilizamos variaveis ao invez de modelos do banco de dados.
    else {
      quantidadeUnidades = this.unidade.length;
      
      // Faz a união dos objetos, simulando de forma bastante *simples* um JOIN na database. 
      for (var i = 0; i < quantidadeUnidades; i++) {
        if (this.unidade[i] && this.unidadeCoordenada[i] && this.unidadeMapa[i] && this.unidadeVisoes[i]) {
          
          // Faz a união da(s) unidade(s)
          this.unidadeUniao[i] = _.extend(this.unidade[i], this.unidadeCoordenada[i], this.unidadeMapa[i], this.unidadeVisoes[i]); 
          
          // Pegamos o nome da nossa visão
          var nomeEl = this.unidadeUniao[i].nome_elemento;
          
          // Vai armazenar o nome de cada uma das visões em visoes[i].
          visoes[i] = nomeEl;
          
          // Para cada visão iremos armazenar aqui os templantes.
          this.listaTemplantes[nomeEl] = {};
        }
      }
    }
    
    // Procura no diretorio pagsEnderecosUnidades os templates e os carrega, salvando-os na listaTemplantes.
    // Logo após carregados nós chamamos o método render().
    utilitarios.carregarTemplantesDinamicamente(this.listaTemplantes, 'pagsEnderecosUnidades/', visoes, function(){
      esteObj.render(cd);
    });
  },
  
  render: function (cd) {
    
    // Carrega este template. É ideal carrega-lo agora, antes das outras visões.
    $(this.el).html(this.template());
  
    var quantidadeUnidades = 0;
    var esteObj = this;
    
    if (UTILIZAR_BANCO_UNIDADE) {
      
      var unidades = this.model.models;     // Quantidade de modelos de unidades desta coleção
      quantidadeUnidades = unidades.length; //Quantidade de unidades
      var ind = 0;
      
    _.each(unidades, function(unidade) {

      // Armazenamos em JSON para podermos manipulalo e ter acesso a suas propriedades.
      var unidadeJson = unidade.toJSON();
      
      // Armazenamos o templante.
      unidadeJson.minha_visao = esteObj.listaTemplantes[unidadeJson.nome_elemento];  
      
        
       // Para cada uma dos mapas desta unidade
       _.each(unidade.unidadeMapas.models, function(unidadeMapa) {
         
         // Armazenamos em json para podermos manipula-lo e ter acesso as suas propriedades.
         var unidadeMapaJson = unidadeMapa.toJSON();
         
         // Contem a união dos dados necessarios para carregar os dados dos templantes.
         var unidadeUniaoLocal = {
           lat: parseFloat(unidadeMapaJson.lat),           // Latitude do mapa
           lng: parseFloat(unidadeMapaJson.lng),           // Longitude do mapa
           zoom: parseInt(unidadeMapaJson.zoom),           // Nivel do zoom
           titulo: unidadeJson.titulo,                     // Titulo da unidade. Exemplo: Nossa unidade do centro de Montes Claros.
           pagina_endereco: unidadeJson.pagina_endereco,   // Página que contem endereço em XML. Exemplo: enderecoUnidade002.html
           nome_elemento: unidadeJson.nome_elemento,       // Nome do elemento onde iremos adicionar o mapa. Exemplo: mapaUnidade002
           nome_aba: unidadeJson.nome_aba,                 // Cada mapa tem uma aba
           minha_visao: unidadeJson.minha_visao,
           indice: ind                                     // Indice desta unidade
         };
           
         // Armazenamos os dados ao nivel global para serem utilizados por outros métodos
         esteObj.unidadeUniaoDB.push(unidadeUniaoLocal);
           
         ind++;
           
         // Adicionamos as abas.
         $('ul.nav-tabs', esteObj.el).append(new VisaoUnidadeAba({model: unidadeUniaoLocal}).render().el); 
           
         // Adicionamos os conteúdos da aba
         $('div.tab-content', esteObj.el).append(new VisaoUnidadeAbaConteudo({model: unidadeUniaoLocal}).render().el); 
           
         });
      
      });
      
    }
    // Utilizamos variaveis ao invez de modelos do banco de dados.
    else {
      
      quantidadeUnidades = this.unidadeUniao.length;
      
      for (var i = 0; i < quantidadeUnidades; i++) {
      
        // Necessário por que vamos marcar o primeiro elemento como ativo.
        this.unidadeUniao[i].indice = i;
         
        // Armazenamos o templante.
        this.unidadeUniao[i].minha_visao = this.listaTemplantes[this.unidadeUniao[i].nome_elemento]; 
         
        if (this.unidadeUniao[i]) {
          // Adicionamos as abas.
          $('ul.nav-tabs', this.el).append(new VisaoUnidadeAba({model: this.unidadeUniao[i]}).render().el);
        
          // Adicionamos os conteúdos  
          $('div.tab-content', this.el).append(new VisaoUnidadeAbaConteudo({model: this.unidadeUniao[i]}).render().el);
        }
      }
      
    }
    
    // Quando tudo estiver pronto nós chamamos esta função.
    cd(this);
  },
  
  iniciarCadaMapa: function () {
    
    if (UTILIZAR_BANCO_UNIDADE) {
      
      _.each(this.unidadeUniaoDB, function(mapaObj) {

        // Coordenadas do centro do mapa.
        var coordenadas = {
          lat: mapaObj.lat, 
          lng: mapaObj.lng
        };
        
        // Centraliza e faz um zoom 
        mapaObj.mapa = gglMapa.centralizarMapa(coordenadas, mapaObj.zoom, $('.embed-responsive > #' + mapaObj.nome_elemento).get(0));
      
        if (mapaObj.mapa) {
          // Coloca uma marca de unidade no mapa
          mapaObj.marca = gglMapa.adcrMarcadorMapa(mapaObj.mapa, coordenadas, mapaObj.titulo);
        }
        
      }, this);         
      
    } else {
      // Para cada um dos objetos iremos iniciar o mapa e adicionar um marcador.
      _.each(this.unidadeUniao, function(mapaObj) {
        
        // Centraliza e faz um zoom 
        mapaObj.mapa = gglMapa.centralizarMapa(mapaObj.coordenadas, mapaObj.zoom, $('.embed-responsive > #' + mapaObj.nome_elemento).get(0));
      
        if (mapaObj.mapa) {
          // Coloca uma marca de unidade no mapa
          mapaObj.marca = gglMapa.adcrMarcadorMapa(mapaObj.mapa, mapaObj.coordenadas, mapaObj.titulo);
        } 
      }, this);
    }
   
  },
    
  // Faz o mapa re-iniciar
  // Sempre que houver troca de aba é necessário utilizar isso.
  // <umdez> Eu não sei ainda se essa maneira está criando novos mapas a cada vez que uma aba é clicada.
  // <umdez> Depois seria uma boa fazer o re-inicio de apenas o mapa da aba selecionada e não de todos os mapas como é feito agora.
  _reIniciarCadaMapa: function (aba) {
    
    if (UTILIZAR_BANCO_UNIDADE) {
     
      _.each(this.unidadeUniaoDB, function(mapaObj) {
        // Apenas o mapa da nova aba clicada que vai ser reiniciado
        if ('#' + mapaObj.nome_elemento === aba) {
          
          // Coordenadas do centro do mapa.
          var coordenadas = {
            lat: mapaObj.lat, 
            lng: mapaObj.lng
          };
          
          //Faz o mapa redimensionar.
          gglMapa.redimensionarMapa( mapaObj.mapa);
          
          // Centraliza e faz um zoom 
          mapaObj.mapa = gglMapa.centralizarMapa(coordenadas, mapaObj.zoom, $('.embed-responsive > #' + mapaObj.nome_elemento).get(0));
        
          if (mapaObj.mapa) {
            // Adicionamos denovo a marca
            mapaObj.marca = gglMapa.adcrMarcadorMapa(mapaObj.mapa, coordenadas, mapaObj.titulo);
          } 
        }
      }, this);
      
    } else {
      
      _.each(this.unidadeUniao, function(mapaObj) {
        
        // Apenas o mapa da nova aba clicada que vai ser reiniciado
        if ('#' + mapaObj.nome_elemento === aba) {
          //Faz o mapa redimensionar.
          gglMapa.redimensionarMapa( mapaObj.mapa);
          
          // Centraliza e faz um zoom 
          mapaObj.mapa = gglMapa.centralizarMapa(mapaObj.coordenadas, mapaObj.zoom, $('.embed-responsive > #' + mapaObj.nome_elemento).get(0));
        
          if (mapaObj.mapa) {
            // Adicionamos denovo a marca
            mapaObj.marca = gglMapa.adcrMarcadorMapa(mapaObj.mapa, mapaObj.coordenadas, mapaObj.titulo);
          } 
        }
      }, this);
     
    }
  },
  
  // Escutamos por eventos das abas.
  iniciarEventosParaAbas: function(item) {
    
    var esteObj = this;
    
    // Quando clicar em uma aba, logo após a nova aba ser aberta então o evento é disparado.
    $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
      var abaAtiva = e.target.toString() // Nova aba ativada
      
      // Pegamos apenas o que é importante, removendo o resto.
      var abaAtiva = abaAtiva.slice( abaAtiva.indexOf('#'), abaAtiva.length);
      
      // Re-iniciamos o mapa.
      esteObj._reIniciarCadaMapa(abaAtiva);
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
    
    // Coloca classe active na primeira aba.
    if (meuModelo.indice == 0) $(this.el).addClass('active');
     
    var conteudoAba = '<a href="#' + meuModelo.nome_elemento + '" aria-controls="'+ meuModelo.nome_elemento +'" role="tab" data-toggle="tab">';
    conteudoAba += meuModelo.nome_aba;
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
  
    // Coloca classe active no primeiro painel.
    if (meuModelo.indice == 0) $(this.el).addClass('active');
    
    $(this.el).attr('id', meuModelo.nome_elemento);
    
    // Carregamos o templante
    $(this.el).html(meuModelo.minha_visao.template(meuModelo));
    
    return this;
  }

});