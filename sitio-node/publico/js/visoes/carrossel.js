'use strict'

/* @arquivo carrossel.js */

/* Versão 0.0.1-beta
 * - Remover a coluna ativo do banco de dados, passando está função para aqui. (c88f6ed4fcfe3d105930820adc4537f7bffb3e10) [FEITO]
 */

Visao.Carrossel = Backbone.View.extend({

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

    return this;
  },
  
  iniciarCarrossel: function() {
    // @AFAZER este código não funciona quando o layout é re-inserido.
    
    // Iniciamos o nosso carrossel com um intervalo de 10 segundos para cada slide.
    // Isto é importante para fazer o nosso carrossel funcionar depois que o html for renderizado.
    // Sem isso o carrossel para de funcionar.
    //$('.carousel').carousel(
    //  interval: 10000 // 10 segundos.
    //);
  }

});

// @Elemento <li data-target="#oCarrossel" data-slide-to="0" class="active"></li>
Visao.IndicadorSlides = Backbone.View.extend({

  tagName: 'li',
  
  initialize: function () {
    $(this.el).attr('data-target', '#oCarrossel');
    $(this.el).attr('data-slide-to', this.model.indice);
  },

  render: function () {
    
    var modelo = this.model;
  
    // Coloca classe active no primeiro modelo.
    if (modelo.indice === 0) $(this.el).addClass('active');
     
    return this;
  }

});

/* @Elemento:
 *  <div class="item active">  
 *    <img class="first-slide" alt="Exames laboratoriais" data-src="holder.js" src="imagem.jpg"/>
 *    <div class="container">
 *      <div class="carousel-caption">
 *        <h1>Vários exames laboratoriais</h1>
 *        <h2>Mais de 50 tipos de exames laboratoriais.</h2>
 *        <p><a class="btn btn-lg btn-success" href="examesOrientacoes.html" role="button">Ver lista de exames disponíveis</a></p>
 *      </div>
 *    </div>
 *  </div>
*/ 
Visao.SlideItem = Backbone.View.extend({
  tagName: 'div',
  // className: 'item',
  
  initialize: function () {
    $(this.el).addClass('item');
  },

  render: function () {
    var modelo = this.model;
    
    if (modelo.indice === 0) $(this.el).addClass('active');
    
    // pegamos a imagem na base 64.
    modelo.imagem_b64 = Global.utilitarios.pegarImagemB64(modelo.imagem_arquivo, 'IMAGEMS_SLIDES');
    
    $(this.el).html(this.template(modelo));
    return this;
  }

});