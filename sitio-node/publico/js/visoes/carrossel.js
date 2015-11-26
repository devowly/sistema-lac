'use strict'

/* @arquivo carrossel.js */

/* Versão 0.0.1-beta
 * - Remover a coluna ativo do banco de dados, passando está função para aqui. [EM ANDAMENTO]
 */

Visao.Carrossel = Backbone.View.extend({

  initialize: function () {
    // Renderizamos o html
    this.render();
  },

  render: function () {
    
    // <umdez> Eu não gostei dessa caracteristica. Acho bem mais produtivo utilizar os 
    // slides direto do arquivo .html ao invez de carrega-los do banco de dados.
    
    var slides = this.model.models;
    var quantidade = slides.length;

    // Carrega o conteúdo do carrossel.
    $(this.el).html(this.template());

    for (var i = 0; i < quantidade; i++) {
      
      // É necessário associar o indice ao modelo. E não utilizar o id do registro no banco de dados.
      slides[i].indice = i;
       
      // Adicionamos os indicadores
      $('.carousel-indicators', this.el).append(new VisaoIndicadorSlides({model: slides[i]}).render().el);
      
      // Adicionamos os items 
      $('.carousel-inner', this.el).append(new Visao.SlideItem({model: slides[i]}).render().el);
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
window.VisaoIndicadorSlides = Backbone.View.extend({

  tagName: 'li',
  
  initialize: function () {
    $(this.el).attr('data-target', '#oCarrossel');
    $(this.el).attr('data-slide-to', this.model.indice);
  },

  render: function () {
    
    var modeloJsonObj = this.model.toJSON();
  
    // Coloca classe active no modelo.
    if (modeloJsonObj.ativo) $(this.el).addClass('active');
     
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
    var modeloJsonObj = this.model.toJSON();
    
    if (modeloJsonObj.ativo) $(this.el).addClass('active');
    
    $(this.el).html(this.template(modeloJsonObj));
    return this;
  }

});