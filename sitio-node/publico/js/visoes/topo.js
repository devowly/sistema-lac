'use strict'

/* @arquivo topo.js
 */
 
/* versão 0.0.1-Beta
 */

Visao.Topo = Backbone.View.extend({

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
    this._iniciarComponentes();
    
    // Iniciamos aqui a escuta pelos eventos.
    this._iniciarEscutaEventos();
    
    return this;
  },

  /* EVENTOS DA NOSSA VISÃO
  ---------------------------------------------*/
  events: {
    
  },
  
  /* @função iniciarComponentes()
   * @descrição Iniciamos componentes para esta visão. 
   *  Os componentes podem ser do bootstrap, jQuery e outros frameworks utilizados
   */ 
  _iniciarComponentes: function(){
    
  },
  
  /* @função iniciarEscutaEventos()
   * @descrição Iniciamos as escutas de eventos para esta visão. 
   *  Os eventos podem ser de elementos do bootstrap, jQuery e outros frameworks utilizados
   */ 
  _iniciarEscutaEventos: function() {
    
  }

});

/* @descricao Adicionamos aqui a imagem de logo do nossos sitio.
 *
 * @Elemento 
 * <img data-src="holder.js" src="<%= imagem %>"/>
**/
Visao.TopoLogo = Backbone.View.extend({

  tagName: 'img',
  
  initialize: function () {
    $(this.el).attr('data-src', 'holder.js');
  },

  render: function () {
    var meuModelo = this.model;
    
    $(this.el).attr('src', meuModelo.imagem);
    
    return this;
  }

});

/* @descricao Adicionamos aqui painel do topo do sitio
 *
 * @Elemento 
 * <button id="btaoResultados" class="pull-right">Resultados</button>
**/
Visao.TopoPainel = Backbone.View.extend({

  tagName: 'button',
  
  initialize: function () {
    $(this.el).attr('class', 'pull-right');
    $(this.el).attr('id', 'btaoResultados');
  },

  render: function () {
    
    // Iniciamos os nossos componentes
    this._iniciarComponentes();
    
    return this;
  },
  
  /* EVENTOS DA NOSSA VISÃO
  ---------------------------------------------*/
  events: {
    "click": "_aoClicarBtoResultados"  // Clique neste elemento.
  },
  
  /* @funcao aoClicarBtoResultados()
   * @descricao funcao chamada logo após ser disparado o evento de clique no botao de resultados. */
  _aoClicarBtoResultados: function() {
    
  },
  
  /* @função iniciarComponentes()
   * @descrição Iniciamos componentes para esta visão. 
   *  Os componentes podem ser do bootstrap, jQuery e outros frameworks utilizados
   */ 
  _iniciarComponentes: function(){
    
    // Iniciamos o botão de resultados.
    $(this.el).button({
      label: "Resultados"
    });
    
  },

});
