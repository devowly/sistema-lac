'use strict'

/* @arquivo nossasUnidades.js */

/* Versão 0.0.1-Beta
 * - Adc caracteristicas básicas para a visão. [FEITO]
 * - Adicionar forma de realizar o re-inicio do mapa para apenas a aba que estiver aberta. (issue #1) (f43ba72653466e6a9ce7dedf4128bdc240bccb66) [FEITO]
 * - Carregar dados das unidades pelo banco de dados. (issue #2) (9e832dd11688bfd27b51ca1a22a13d675388174a) [FEITO]
 * - Para cada templante carregado dinamicamento vamos criar uma nova visão. (issue #13) (9a990371680504c44e29ee36e6f1c1c4f5fc2cc6) [FEITO]
 * - Remover conteúdo em HTML do código das visões. (issue #12) (9a990371680504c44e29ee36e6f1c1c4f5fc2cc6) [FEITO]
 */

var UTILIZAR_BANCO_UNIDADE = true; // Você quer utilizar o banco de dados? 
 
/* @Visão NossasUnidades
 *
 * @Descrição Responsável por apresentar as unidades com mapa.
 */
Visao.NossasUnidades = Backbone.View.extend({

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
      coordenadas: {lat: -16.7244327, lng: -43.8715339}   // Coordenadas do bairro Jardim Panorama de Montes Claros
    },
    {
      coordenadas: {lat: -16.7244327, lng: -43.8715339}   // Coordenadas do bairro Todos os Santos de Montes Claros
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
      for (var ca = 0; ca < quantidadeUnidades; ca++) {
        
        // Transforma em JSON para podermos manipular e acessar as propriedades do modelo.
        unidadeJson = unidades[ca].toJSON();
        
        // Pegamos o nome da nossa visão
        var nomeEl = unidadeJson.nome_elemento;
        
        // Vai armazenar o nome de cada uma das visões em visoes[ca].
        visoes[ca] = nomeEl;
        
        // Para cada visão iremos armazenar aqui os templantes.
        this.listaTemplantes[nomeEl] = {};
        
      }
     
    } 
    // Utilizamos variaveis ao invez de modelos do banco de dados.
    else {
      quantidadeUnidades = this.unidade.length;
      
      // Faz a união dos objetos, simulando de forma bastante *simples* um JOIN na database. 
      for (var ca = 0; ca < quantidadeUnidades; ca++) {
        if (this.unidade[ca] && this.unidadeCoordenada[ca] && this.unidadeMapa[ca] && this.unidadeVisoes[ca]) {
          
          // Faz a união da(s) unidade(s)
          this.unidadeUniao[ca] = _.extend(this.unidade[ca], this.unidadeCoordenada[ca], this.unidadeMapa[ca], this.unidadeVisoes[ca]); 
          
          // Pegamos o nome da nossa visão
          var nomeEl = this.unidadeUniao[ca].nome_elemento;
          
          // Vai armazenar o nome de cada uma das visões em visoes[ca].
          visoes[ca] = nomeEl;
          
          // Para cada visão iremos armazenar aqui os templantes.
          this.listaTemplantes[nomeEl] = {};
        }
      }
    }
    
    // Procura no diretorio pagsEnderecosUnidades os templates e os carrega, salvando-os na listaTemplantes.
    // Logo após carregados nós chamamos o método render().
    Global.utilitarios.carregarTemplantesExtras(this.listaTemplantes, 'pagsEnderecosUnidades/', visoes, function(){
      esteObj.render(cd);
    });
  },
  
  render: function (cd) {
    
    // Carrega este template. É ideal carrega-lo agora, antes das outras visões.
    $(this.el).html(this.template());
  
    var quantidadeUnidades = 0;
    var esteObj = this;
    
    if (UTILIZAR_BANCO_UNIDADE) {
      
      var unidades = this.model.models;     // Os modelos de unidades desta coleção
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
           coordenadas: {
             lat: parseFloat(unidadeMapaJson.lat),           // Latitude do mapa
             lng: parseFloat(unidadeMapaJson.lng),           // Longitude do mapa
           },
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
         $('ul.nav-tabs', esteObj.el).append(new Visao.UnidadeAba({model: unidadeUniaoLocal}).render().el); 
           
         // Adicionamos os conteúdos da aba
         $('div.tab-content', esteObj.el).append(new Visao.UnidadeAbaConteudo({model: unidadeUniaoLocal}).render().el); 
           
         });
      
      });
      
    }
    // Utilizamos variaveis ao invez de modelos do banco de dados.
    else {
      
      quantidadeUnidades = this.unidadeUniao.length;
      
      for (var ca = 0; ca < quantidadeUnidades; ca++) {
      
        // Necessário por que vamos marcar o primeiro elemento como ativo.
        this.unidadeUniao[ca].indice = i;
         
        // Armazenamos o templante.
        this.unidadeUniao[ca].minha_visao = this.listaTemplantes[this.unidadeUniao[ca].nome_elemento]; 
         
        if (this.unidadeUniao[ca]) {
          // Adicionamos as abas.
          $('ul.nav-tabs', this.el).append(new Visao.UnidadeAba({model: this.unidadeUniao[ca]}).render().el);
        
          // Adicionamos os conteúdos  
          $('div.tab-content', this.el).append(new Visao.UnidadeAbaConteudo({model: this.unidadeUniao[ca]}).render().el);
        }
      }
      
    }
    
    // iniciar os componentes
    this._iniciarMeusComponentes();
    
    // Adicionamos escuta para os eventos.
    // Isto é necessário por causa do mapa que precisa receber resize.
    this._iniciarMinhaEscutaEventos();
    
    // Quando tudo estiver pronto nós chamamos esta função.
    cd(this);
  },
  
  iniciarCadaMapa: function () {
    
    if (UTILIZAR_BANCO_UNIDADE) {
      
      _.each(this.unidadeUniaoDB, function(mapaObj) {
        
        // Centraliza e faz um zoom 
        mapaObj.mapa = Global.gglMapa.centralizarMapa(mapaObj.coordenadas, mapaObj.zoom, $('.embed-responsive > #' + mapaObj.nome_elemento).get(0));
      
        if (mapaObj.mapa) {
          // Coloca uma marca de unidade no mapa
          mapaObj.marca = Global.gglMapa.adcrMarcadorMapa(mapaObj.mapa, mapaObj.coordenadas, mapaObj.titulo);
        }
        
      }, this);         
      
    } else {
      // Para cada um dos objetos iremos iniciar o mapa e adicionar um marcador.
      _.each(this.unidadeUniao, function(mapaObj) {
        
        // Centraliza e faz um zoom 
        mapaObj.mapa = Global.gglMapa.centralizarMapa(mapaObj.coordenadas, mapaObj.zoom, $('.embed-responsive > #' + mapaObj.nome_elemento).get(0));
      
        if (mapaObj.mapa) {
          // Coloca uma marca de unidade no mapa
          mapaObj.marca = Global.gglMapa.adcrMarcadorMapa(mapaObj.mapa, mapaObj.coordenadas, mapaObj.titulo);
        } 
      }, this);
    }
   
  },
    
  // Faz o mapa re-iniciar
  // Sempre que houver troca de aba é necessário utilizar isso.
  // <umdez> Eu não sei ainda se essa maneira está criando novos mapas a cada vez que uma aba é clicada.
  _reIniciarCadaMapa: function (aba) {
    
    if (UTILIZAR_BANCO_UNIDADE) {
     
      _.each(this.unidadeUniaoDB, function(mapaObj) {
        // Apenas o mapa da nova aba clicada que vai ser reiniciado
        if ('#' + mapaObj.nome_elemento === aba) {
          
          //Faz o mapa redimensionar.
          Global.gglMapa.redimensionarMapa( mapaObj.mapa);
          
          // Centraliza e faz um zoom 
          mapaObj.mapa = Global.gglMapa.centralizarMapa(mapaObj.coordenadas, mapaObj.zoom, $('.embed-responsive > #' + mapaObj.nome_elemento).get(0));
        
          if (mapaObj.mapa) {
            // Adicionamos denovo a marca
            mapaObj.marca = Global.gglMapa.adcrMarcadorMapa(mapaObj.mapa, mapaObj.coordenadas, mapaObj.titulo);
          } 
        }
      }, this);
      
    } else {
      
      _.each(this.unidadeUniao, function(mapaObj) {
        
        // Apenas o mapa da nova aba clicada que vai ser reiniciado
        if ('#' + mapaObj.nome_elemento === aba) {
          //Faz o mapa redimensionar.
          Global.gglMapa.redimensionarMapa( mapaObj.mapa);
          
          // Centraliza e faz um zoom 
          mapaObj.mapa = Global.gglMapa.centralizarMapa(mapaObj.coordenadas, mapaObj.zoom, $('.embed-responsive > #' + mapaObj.nome_elemento).get(0));
        
          if (mapaObj.mapa) {
            // Adicionamos denovo a marca
            mapaObj.marca = Global.gglMapa.adcrMarcadorMapa(mapaObj.mapa, mapaObj.coordenadas, mapaObj.titulo);
          } 
        }
      }, this);
     
    }
  },
  
  /* @função _iniciarMeusComponentes()
   * @descrição Iniciamos componentes para esta visão. 
   *  Os componentes podem ser do bootstrap, jQuery e outros frameworks utilizados
   */ 
  _iniciarMeusComponentes: function(){
    
  },
  
  /* @função _iniciarMinhaEscutaEventos()
   * @descrição Iniciamos as escutas de eventos para esta visão. 
   *  Os eventos podem ser de elementos do bootstrap, jQuery e outros frameworks utilizados
   */ 
  _iniciarMinhaEscutaEventos: function() {
    
    var esteObj = this;
    
    // Quando clicar em uma aba, logo após a nova aba ser aberta então o evento é disparado.
    $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
      var abaAtiva = e.target.toString() // Nova aba ativada
      
      // Pegamos apenas o que é importante, removendo o resto.
      var abaAtiva = abaAtiva.slice( abaAtiva.indexOf('#'), abaAtiva.length);
      
      // Re-iniciamos o mapa.
      esteObj._reIniciarCadaMapa(abaAtiva);
    })
    
  },
  
  reIniciarEventos: function() {
    this._iniciarMinhaEscutaEventos();
  }

});

/* @Visão UnidadeAba
 *
 * @Elemento 
 * <li role="presentation" class="active"> </li> 
 *
 * @Carrega:
 *   <a href="#Unidade1" aria-controls="Unidade1" role="tab" data-toggle="tab">
 *     CENTRO 
 *     <span class="fa fa-map-marker fa-1x" aria-hidden="true"></span>
 *   </a>
 * 
**/
Visao.UnidadeAba = Backbone.View.extend({

  tagName: 'li',
  
  attributes: {
    'id': 'aba',
    'role': 'presentation'
  },
  
  initialize: function () {
    
  },

  render: function () {
    var meuModelo = this.model;
    
    // Coloca classe active na primeira aba.
    if (meuModelo.indice == 0) $(this.el).addClass('active');
    
    $(this.el).html(this.template(meuModelo));
     
    return this;
  }

});

/* @Visão UnidadeAbaConteudo
 *
 * @Elemento:
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
Visao.UnidadeAbaConteudo = Backbone.View.extend({
  tagName: 'div',
  
  attributes: {
    'class': 'tab-pane',
    'role': 'tabpanel'
  },
  
  initialize: function () {
    
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