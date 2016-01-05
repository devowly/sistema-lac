'use strict'

/* @Arquivo quemSomos.js
 */

 /* Versão 0.0.1-Beta */

define([
  'jquery',
  'backbone',
  'underscore',
  'bootstrap',
  'jquery.scrollTo',
  'text!/js/templantes/paginas/quemSomos/Visao.QuemSomos.html'
], function($, Backbone, _, Bootstrap, scrollTo, Templante){
  
  /* Responsavel pela apresentação do texto que descreve as diversas informações da empresa.
   */
  var QuemSomos = Backbone.View.extend({
    
    templante: _.template(Templante),
    
    initialize: function () {
      this.render();
    },

    render: function () {
      // Carrega e retorna o conteúdo da visão que será inserido.
      this.$el.html(this.templante());
      return this;
    },
    
    /* Iniciamos os componentes para esta visão. 
     * Os componentes podem ser do bootstrap, jQuery e outros frameworks utilizados
     */ 
    _iniciarMeusComponentes: function(){
      
      // Adicionamos o seletor e também o offset do componente scrollspy.
      $('div#' + 'texto-quem-somos').scrollspy({
        selector: 'a#rolagem-identificador',
        offset: 30
      });
      
      // Remove seleção de qualquer item ativo
      $('#menu-vertical-esquerdo .nav li').removeClass('active');
      
      // Aqui nós adicionamos a seleção ao item inicial.
      $('li#' + 'item-empresa').addClass('active');
    },
    
    /* Iniciamos aqui as escutas de eventos para esta visão. 
     * Os eventos podem ser de elementos do bootstrap, jQuery e outros frameworks utilizados
     */ 
    _iniciarMinhaEscutaEventos: function() {
      
      // Adicionamos o evento de clique nos links
      $('a#rolagem-identificador').click(function(evento){
        // Fazemos com que o link não prossiga para barra de endereços.
        // Isto é importante para que a rolagem funcione.
        evento.preventDefault();
        evento.stopPropagation();
          
        // Remove seleção atual
        $('#menu-vertical-esquerdo .nav li').removeClass('active');
      
        // Pegamos o elemento que miramos.
        var mira = $(this).attr('mira');
        
        // É importante utilizarmos este método porque não podemos
        // fazer a rolagem utilizando o método do scrollspy.
        $('div#' + 'texto-quem-somos').scrollTo(
          mira, 
          {duration: 500, offset: -30}
        );
        
      });
    },
    
    // reiniciar eventos e os componentes desta visão
    reIniciarEventosComponentes: function (){
      this._iniciarMeusComponentes();
      this._iniciarMinhaEscutaEventos();
    }
    
  });
  
  return QuemSomos;
});