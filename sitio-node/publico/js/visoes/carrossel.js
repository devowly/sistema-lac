'use strict'

/* @arquivo carrossel.js */

/* Versão 0.0.1-beta
 * - Remover a coluna ativo do banco de dados, passando está função para aqui. (c88f6ed4fcfe3d105930820adc4537f7bffb3e10) [FEITO]
 */

/* @Visão: Visao.Carrossel
 *
 * @Descriçao: Responsável por os indicadores e slides do carrossel.
 */
Visao.Carrossel = Backbone.View.extend({

  attributes: {
    
  },
  
  initialize: function () {
    // Renderizamos o html
    this.render();
  },

  render: function () {
    
    // <umdez> Eu não gostei dessa caracteristica. Acho bem mais produtivo utilizar os 
    // slides direto do arquivo .html ao invez de carrega-los do banco de dados.
    // Essa ideia já é bem discutida @veja http://backbonejs.org/#FAQ-bootstrap
    
    var slides = this.model.models;
    var quantidade = slides.length;

    // Carrega o conteúdo do carrossel.
    $(this.el).html(this.template());
    this.$el.html(this.template());
    
    for (var ca = 0; ca < quantidade; ca++) {
      
      // Pegamos o objeto em JSON para poder manipular e ter acesso a suas propriedades.
      var slideJson = slides[ca].toJSON();
      
      // É necessário associar o indice ao modelo. E não utilizar o id do registro no banco de dados.
      slideJson.indice = ca;
       
      // Adicionamos os indicadores
      $('.carousel-indicators', this.el).append(new Visao.IndicadorSlides({model: slideJson}).render().el);
      
      // Adicionamos os items 
      $('.carousel-inner', this.el).append(new Visao.SlideItem({model: slideJson}).render().el);
    }

    // Iniciamos aqui os nossos componentes
    this._iniciarMeusComponentes();
    
    // Iniciamos aqui a escuta pelos eventos.
    this._iniciarMinhaEscutaEventos();
    
    return this;
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
    
  }

});

/* @Visão: IndicadorSlides
 *
 * @Descrição: Responsável por adicionar cada um dos indicadores do slide.
 *
 * @Elemento: <li data-target="#oCarrossel" data-slide-to="0" class="active"></li> 
 */
Visao.IndicadorSlides = Backbone.View.extend({

  tagName: 'li',
  
  attributes: {
    'data-target': '#oCarrossel'
  },
  
  initialize: function () {
 
    $(this.el).attr('data-slide-to', this.model.indice);
  },

  render: function () {
    
    var modelo = this.model;
  
    // Coloca classe active no primeiro modelo.
    if (modelo.indice === 0) $(this.el).addClass('active');
     
    return this;
  }

});

/* @Visão: SlideItem
 *
 * @Descrição: para cada um dos indicadores nós temos um item do carrossel. 
 * Este item contem a imagem de slide, titulo, sub-titulo e botão. 
 *
 * @Elemento: <div class="item active"> </div>
 *
 * @Carrega:
 * <img class="first-slide" alt="Exames laboratoriais" data-src="holder.js" src="imagem.jpg"/>
 * <div class="container">
 *   <div class="carousel-caption">
 *     <h1>Vários exames laboratoriais</h1>
 *     <h2>Mais de 50 tipos de exames laboratoriais.</h2>
 *     <p><!-- Botão de slide aqui--></p>
 *   </div>
 * </div> 
 */ 
Visao.SlideItem = Backbone.View.extend({
  tagName: 'div',
  
  attributes: {
    'class': 'item'
  },
  
  initialize: function () {
    
  },

  render: function () {
    var modelo = this.model;
    
    if (modelo.indice === 0) $(this.el).addClass('active');
    
    // pegamos a imagem na base 64.
    modelo.imagem_b64 = Global.utilitarios.pegarImagemB64(modelo.imagem_arquivo, 'IMAGEMS_SLIDES');
    
    $(this.el).html(this.template(modelo));
    
    // Adicionamos o botão
    $('div.carousel-caption p', this.el).append(new Visao.SlideItemBotao({model: modelo}).render().el);
      
    return this;
  },
  
  /* EVENTOS DA NOSSA VISÃO
  ---------------------------------------------*/
  events: {
    
  },
  
  /* @função _iniciarMeusComponentes()
   *
   * @descrição Iniciamos componentes para esta visão. 
   *  Os componentes podem ser do bootstrap, jQuery e outros frameworks utilizados
   */ 
  _iniciarMeusComponentes: function(){
    
  },
  
  /* @função _iniciarMinhaEscutaEventos()
   *
   * @descrição Iniciamos as escutas de eventos para esta visão. 
   *  Os eventos podem ser de elementos do bootstrap, jQuery e outros frameworks utilizados
   */ 
  _iniciarMinhaEscutaEventos: function() {
    
  }

});

/* @descricao Botão do slide do carrossel.
 *
 * @Elemento 
 * <button>texto_botao</button>
 */
Visao.SlideItemBotao = Backbone.View.extend({

  tagName: 'button',
  
  attributes: {
    
  },
  
  initialize: function () {
    
  },
    
  render: function () {
    var meuModelo = this.model;
    
    // Iniciamos os nossos componentes
    this._iniciarMeusComponentes(meuModelo);
    
    return this;
  },
  
  /* EVENTOS DA NOSSA VISÃO
  ---------------------------------------------*/
  events: {
    "click": "_aoReceberClique"  // Clique neste elemento.
  },
  
  /* @funcao _aoReceberClique()
   * @descricao funcao chamada logo após ser disparado o evento de clique nesta visão. */
  _aoReceberClique: function() {
    alert(this.model.texto_botao);
  },
  
  /* @função _iniciarMeusComponentes()
   * @descrição Iniciamos componentes para esta visão. 
   *  Os componentes podem ser do bootstrap, jQuery e outros frameworks utilizados
   */ 
  _iniciarMeusComponentes: function(meuModelo){
    
    this.$el.button({
      label: this.model.texto_botao 
    });
  }

});
