'use strict'

/* @arquivo topo.js
 */
 
/* versão 0.0.1-Beta
 */

define([
  'jquery',
  'backbone',
  'underscore',
  'utilitarios',
  'visoes/base/topo/topoPainel',
  'visoes/base/topo/topoLogo',
  'text!/js/templantes/base/topo/Visao.Topo.html'
], function($, Backbone, _, Utilitarios, TopoPainel, TopoLogo, Templante) {

  /* Nossa visão do topo da página - Apresentamos aqui a visão do topo.
   * Esta visão possui mais duas outras, que são, a visão do logotipo, e a
   * visão do painel. A visão do painel pode modificar dependendo se o usuário
   * realizou autenticação ou se não realizou.
   *
   * @Elemento
   * <div> </div>
   *
   * @Carrega 
   * <h3 class="text-muted">
   *   <!-- <span style="color: green;">Laboratório</span> <span style="color: green;">Lac</span>-->
   *    <div class="row">
   *     <div class="col-md-4" id="logotipo"> 
   *       <!-- Aqui fica a nossa imagem de logo -->
   *     </div>
   *     <div class="col-md-8" id="painel-topo"> 
   *       <!--<button type="button" class="btn btn-success btn-lg pull-right">Resultados</button>-->
   *     </div>
   *   </div>
   * </h3>
   */ 
  var Topo = Backbone.View.extend({

    templante: _.template(Templante),
    
    /* Os atributos desta visão */
    attributes: {
      
    },
    
    initialize: function () {
      this.render();
    },

    render: function () {
      
      // Renderiza este template
      this.$el.html(this.templante());
       
      // A imagem de logo da nossa pagina
      var logo = { imagem: Utilitarios.pegarImagemB64('logo.jpg', 'IMAGEMS_LOGO') };
      //var logo = { imagem: '/js/imagems/logo.jpg'}; 
      
      // Adicionamos o logo ao conteudo do topo.
      $('div.row div#logotipo', this.el).append(new TopoLogo({model: logo }).render().el); 
      
      // Adicionamos o painel do topo da nossa página
      $('div.row div#painel-topo', this.el).append(new TopoPainel().render().el); 
      
      // Iniciamos aqui os nossos componentes
      this._iniciarMeusComponentes();
      
      // Iniciamos aqui a escuta pelos eventos.
      this._iniciarMinhaEscutaEventos();
      
    },

    /* Os eventos desta visão */
    events: {
      
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

  return Topo;
}); 
