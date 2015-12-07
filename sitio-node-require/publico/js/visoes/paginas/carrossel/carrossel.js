'use strict'

/* @arquivo carrossel.js */

/* Versão 0.0.1-beta
 * - Remover a coluna ativo do banco de dados, passando está função para aqui. (c88f6ed4fcfe3d105930820adc4537f7bffb3e10) [FEITO]
 */

 define([
  'jquery',
  'backbone',
  'underscore',
  'utilitarios',
  'visoes/paginas/carrossel/indicadorSlides',
  'visoes/paginas/carrossel/slideItem',
  'text!/js/templantes/paginas/carrossel/Visao.Carrossel.html'
], function($, Backbone, _, Utilitarios, IndicadorSlides, SlideItem, Templante){
  
  /* Responsável pelos indicadores e os slides do carrossel.
   *
   * @Carrega
   * <div id="oCarrossel" class="carousel slide" data-ride="carousel">
   *   <!-- Indicators -->
   *   <ol class="carousel-indicators">
   *       
   *   </ol>
   *     
   *   <div class="carousel-inner" role="listbox">
   *       
   *   </div>
   *     
   *  <a class="left carousel-control" href="#oCarrossel" role="button" data-slide="prev">
   *     <span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>
   *     <span class="sr-only">Anterior</span>
   *   </a>
   *   <a class="right carousel-control" href="#oCarrossel" role="button" data-slide="next">
   *     <span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span>
   *     <span class="sr-only">Próximo</span>
   *   </a>
   * </div>
   */
  var Carrossel = Backbone.View.extend({

    templante: _.template(Templante),
    
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
      $(this.el).html(this.templante());
      
      for (var ca = 0; ca < quantidade; ca++) {
        
        // Pegamos o objeto em JSON para poder manipular e ter acesso a suas propriedades.
        var slideJson = slides[ca].toJSON();
        
        // É necessário associar o indice ao modelo. E não utilizar o id do registro no banco de dados.
        slideJson.indice = ca;
         
        // Adicionamos os indicadores
        $('.carousel-indicators', this.el).append(new IndicadorSlides({model: slideJson}).render().el);
        
        // Adicionamos os items 
        $('.carousel-inner', this.el).append(new SlideItem({model: slideJson}).render().el);
      }

      // Iniciamos aqui os nossos componentes
      this._iniciarMeusComponentes();
      
      // Iniciamos aqui a escuta pelos eventos.
      this._iniciarMinhaEscutaEventos();
      
      return this;
    },

    /* Iniciamos componentes para esta visão. 
     * Os componentes podem ser do bootstrap, jQuery e outros frameworks utilizados
     */ 
    _iniciarMeusComponentes: function(){
      
    },
    
    /* Iniciamos as escutas de eventos para esta visão. 
     * Os eventos podem ser de elementos do bootstrap, jQuery e outros frameworks utilizados
     */ 
    _iniciarMinhaEscutaEventos: function() {
      
    }

  });

  return Carrossel;
});