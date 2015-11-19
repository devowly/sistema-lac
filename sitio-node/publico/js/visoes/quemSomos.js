'use strict'

window.VisaoQuemSomos = Backbone.View.extend({

  initialize: function () {
    this.render();
  },

  render: function () {
    // Carrega e retorna o conteúdo da visão que será inserido.
    $(this.el).html(this.template());
    return this;
  },
  
  /* Aqui selecionamos um item do menu vertical */
  iniciarEventosParaMenu: function(item) {
    
    // Adicionamos o seletor e também o offset.
    $('div#' + 'textoQuemSomos').scrollspy({
      selector: 'a#rolagemId',
      offset: 30
    });
    
    // Remove seleção atual
    $('#menuVertEsquerdo .nav li').removeClass('active');
    
    // Aqui nós adicionamos a seleção ao item inicial.
    $('li#' + item).addClass('active');
    
    // Adicionamos o evento de clique nos links
    $('a#rolagemId').click(function(evento){
      // Fazemos com que o link não prossiga para barra de endereços.
      // Isto é importante para que a rolagem funcione.
      evento.preventDefault();
      
      // Remove seleção atual
      $('#menuVertEsquerdo .nav li').removeClass('active');
    
      // Pegamos o elemento que miramos.
      var mira = $(this).attr('mira');
      
      // É importante utilizarmos este método porque não podemos
      // fazer a rolagem utilizando o método do scrollspy.
      $('div#' + 'textoQuemSomos').scrollTo(
        mira, 
        {duration: 500, offset: -30}
      );
      
    });
    
  }
  
});