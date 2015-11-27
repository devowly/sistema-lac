'use strict'

Visao.QuemSomos = Backbone.View.extend({

  initialize: function () {
    this.render();
  },

  render: function () {
    // Carrega e retorna o conteúdo da visão que será inserido.
    $(this.el).html(this.template());
    return this;
  },
  
  /* @função iniciarComponentes()
   * @descrição Iniciamos componentes para esta visão. 
   *  Os componentes podem ser do bootstrap, jQuery e outros frameworks utilizados
   */ 
  iniciarComponentes: function(){
    
    // Adicionamos o seletor e também o offset do componente scrollspy.
    $('div#' + 'textoQuemSomos').scrollspy({
      selector: 'a#rolagemId',
      offset: 30
    });
    
    // Remove seleção de qualquer item ativo
    $('#menuVertEsquerdo .nav li').removeClass('active');
    
    // Aqui nós adicionamos a seleção ao item inicial.
    $('li#' + 'itemEmpresa').addClass('active');
  },
  
  /* @função iniciarEscutaEventos()
   * @descrição Iniciamos as escutas de eventos para esta visão. 
   *  Os eventos podem ser de elementos do bootstrap, jQuery e outros frameworks utilizados
   */ 
  iniciarEscutaEventos: function() {
    
    // Adicionamos o evento de clique nos links
    $('a#rolagemId').click(function(evento){
      // Fazemos com que o link não prossiga para barra de endereços.
      // Isto é importante para que a rolagem funcione.
      evento.preventDefault();
      evento.stopPropagation();
        
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