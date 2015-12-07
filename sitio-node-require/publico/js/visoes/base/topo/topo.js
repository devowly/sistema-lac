'use strict'

/* @arquivo topo.js
 */
 
/* versão 0.0.1-Beta
 */

define([
  'jquery',
  'backbone',
  'underscore',
  'visoes/base/topo/topoPainel',
  'visoes/base/topo/topoLogo',
  'text!/js/templantes/base/topo/Visao.Topo.html'
], function($, Backbone, _, TopoPainel, TopoLogo, Templante) {

  /* @Visão Topo()
   */ 
  var Topo = Backbone.View.extend({

    templante: _.template(Templante),
    
    attributes: {
      
    },
    
    initialize: function () {
      this.render();
    },

    render: function () {
      
      // Renderiza este template
      this.$el.html(this.templante());
       
      // logo da nossa pagina
      //var logo = { imagem: Global.utilitarios.pegarImagemB64('logo.jpg', 'IMAGEMS_LOGO') };
      var logo = { imagem: '/js/imagems/logo.jpg'}; 
      
      // Adicionamos o logo ao conteudo do topo.
      $('div.row div#logotipo', this.el).append(new TopoLogo({model: logo }).render().el); 
      
      // Adicionamos o painel do topo da nossa página
      $('div.row div#paineltopo', this.el).append(new TopoPainel().render().el); 
      
      // Iniciamos aqui os nossos componentes
      this._iniciarMeusComponentes();
      
      // Iniciamos aqui a escuta pelos eventos.
      this._iniciarMinhaEscutaEventos();
      
    },

    /* EVENTOS DA NOSSA VISÃO
    ---------------------------------------------*/
    events: {
      
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

  return Topo;
}); 
