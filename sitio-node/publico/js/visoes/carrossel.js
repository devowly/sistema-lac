'use strict'

window.VisaoCarrossel = Backbone.View.extend({

  initialize: function () {
    this.render();
  },

  render: function () {
    var slides = this.model.models;
    var quantidade = slides.length;

    // Carrega o conteúdo do carrossel.
    $(this.el).html(this.template());

    for (var i = 0; i < quantidade; i++) {
      
      // Adicionamos os indicadores
      $('.carousel-indicators', this.el).append(new VisaoIndicadorSlides({model: slides[i]}).render().el);
      
      // Adicionamos os items 
      $('.carousel-inner', this.el).append(new VisaoSlideItem({model: slides[i]}).render().el);
    }

    return this;
  },
  
  iniciarCarrossel: function() {
    // @AFAZER este código não funciona quando o layout é re-inserido.
    
    // Iniciamos o nosso carrossel com um intervalo de 10 segundos para cada slide.
    // Isto é importante para fazer o nosso carrossel funcionar depois que o html for renderizado.
    // Sem isso o carrossel para de funcionar.
    //$('.carousel').carousel(
    //  interval: 10000
    //);
  }

});

window.VisaoIndicadorSlides = Backbone.View.extend({

  tagName: 'li',
  
  initialize: function () {

  },

  render: function () {
    
    var modeloJsonObj = this.model.toJSON();
    
    $(this.el).attr('data-target', '#oCarrossel');
    $(this.el).attr('data-slide-to', modeloJsonObj.id - 1);
    
    if (modeloJsonObj.ativo) $(this.el).addClass('active');
    
    
    return this;
  }

});

window.VisaoSlideItem = Backbone.View.extend({
  tagName: 'div',
  // className: 'item',
  
  initialize: function () {
 
  },

  render: function () {
    var modeloJsonObj = this.model.toJSON();
    
    $(this.el).addClass('item');
    if (modeloJsonObj.ativo) $(this.el).addClass('active');
    
    $(this.el).html(this.template(modeloJsonObj));
    return this;
  }

});