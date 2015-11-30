'use strict'

/* @arquivo topo.js
 */
 
/* versão 0.0.1-Beta
 */

/* @Visão Topo()
 */ 
Visao.Topo = Backbone.View.extend({

  attributes: {
    
  },
  
  initialize: function () {
    this.render();
  },

  render: function () {
    
    // Renderiza este template
    $(this.el).html(this.template());
    
    // logo da nossa pagina
    var logo = { imagem: Global.utilitarios.pegarImagemB64('logo.jpg', 'IMAGEMS_LOGO') };
    
    // Adicionamos o logo ao conteudo do topo.
    $('div.row div#logotipo', this.el).append(new Visao.TopoLogo({model: logo }).render().el); 
    
    // Adicionamos o painel do topo da nossa página
    $('div.row div#paineltopo', this.el).append(new Visao.TopoPainel().render().el); 
    
    // Iniciamos aqui os nossos componentes
    this._iniciarMeusComponentes();
    
    // Iniciamos aqui a escuta pelos eventos.
    this._iniciarMinhaEscutaEventos();
    
    return this;
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

/* @Visão TopoLogo()
 *
 * @descricao Adicionamos aqui a imagem de logo do nossos sitio.
 *
 * @Elemento 
 * <img data-src="holder.js" src="<%= imagem %>"/>
**/
Visao.TopoLogo = Backbone.View.extend({

  tagName: 'img',
  
  attributes: {
    'data-src': 'holder.js'
  },
  
  initialize: function () {
    
  },

  render: function () {
    var meuModelo = this.model;
    
    $(this.el).attr('src', meuModelo.imagem);
    
    return this;
  }

});

/* @Visão TopoPainel()
 *
 * @descricao Adicionamos aqui painel do topo do sitio
 *
 * @Elemento 
 * <a class="btn btn-success btn-lg pull-right">Resultados</a>
**/
Visao.TopoPainel = Backbone.View.extend({

  tagName: 'button',
  
  attributes: {
    'class': 'btn btn-success btn-lg pull-right'
  },
  
  initialize: function () {
    
  },

  render: function () {
    
    // Coloca endereço do link
    $(this.el).attr('href', '#');

    // Adiciona texto do botão    
    $(this.el).append('Resultados');
    
    // Iniciamos os nossos componentes
    this._iniciarMeusComponentes();
    
    return this;
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
    
    
  }

});
