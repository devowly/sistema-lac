'use strict'

/* @arquivo barraDeNav.js */

/* Versão 0.0.1-Beta
 */

define([
  'jquery'
, 'backbone'
, 'underscore'
, 'bootstrap'
, 'text!/admin/js/templantes/painel/base/BarraDeNav/Visao.BarraNav.html'
], function($, Backbone, _, Bootstrap, TemplanteBarraDeNavDoPainel) {
  
  /* Aqui acrescentamos os eventos para este sub-módulo. Assim ficará fácil para manipular os eventos que são
   * locais a este escopo. Este padrão será utilizado na maioria dos escopos que iremos criar.
   *
   * @Veja http://pragmatic-backbone.com/using-events-like-a-baws
   * @Veja https://lostechies.com/derickbailey/2012/04/03/revisiting-the-backbone-event-aggregator-lessons-learned/
   *
   * @Propriedade {Evento} [eventos] Extenção dos eventos do Backbone.
   */
  var eventos = _.extend({}, Backbone.Events);
  
  /* @Classe BarraDeNav().
   *
   * Este é a nosso classe responsável pela gerencia da nossa visão da barra de nav. da interface base do aplicativo. 
   ------------------------------------------------------------------------------------------------------------------*/
  var BarraDeNav = function() {
    
    this.opcoesDoMenu = [
      {'nome': 'Cadastrar'}  // Lista de opções para realizar algum cadastro.
    , {'nome': 'Listar'}     // Lista para leitura dos cadastros em geral.
    ];
    
    /* @Propriedade {Objeto} visaoBase(). Armazenamos aqui a nossa visão principal. */
    this.visaoBase = null;
  };
  
  /* @Visão visao().
   */
  BarraDeNav.prototype.visao = Backbone.View.extend({
    
    /* @Propriedade {Objeto} [attributes] Os atributos desta visão que serão acrescentados 
     * como atributos HTML (id, class, etc.) do elemento (this.el) DOM desta visão. */
    attributes: {
    
    },

    /* @Construtor initialize().
     *
     */
    initialize: function (opcoes) {
      var esteObjeto = this;
      
      return this._renderizar();
    },

    /* @Método [Privado] _renderizar().
     *
     * @Retorna {Objeto} Valor deste objeto.
     */
    _renderizar: function () {
      
      this.$el.html(_.template(TemplanteBarraDeNavDoPainel));
     
      return this;
    },
    
    /* @Propriedade {Objeto} [events] Aqui temos os eventos que esta visão irá escutar.
     * Cada evento será disparado quando o usuário realizar alguma atividade no navegador. 
     */
    events: {
      
    },
    
    /* @Método [Publico] descarregar().
     *
     * Descarregamos aqui esta visão removendo a nossa visão do DOM e também as escutas por eventos.
     * @Veja http://stackoverflow.com/a/11534056/4187180
     */
    descarregar: function() {
      // Removemos todas escutas por eventos aqui.
      this.undelegateEvents();
      this.$el.removeData().unbind(); 
      
      // Removemos visão do DOM.
      this.remove();  
      Backbone.View.prototype.remove.call(this);
    }

  });
  
  /* @Visão visaoDoItemNoMenuDoTopo().
   */
  BarraDeNav.prototype.visaoDoItemNoMenuDoTopo = Backbone.View.extend({
    
    /* @Construtor initialize().
     * 
     * @Parametro {Objeto} [opcoes] Objeto contendo informações do item que será inserido no menu.
     * @Parametro {Texto} [opcoes.local] O valor do local no menu onde o item será adicionado. Ex,. 'Cadastro', 'Listas' etc. 
     * @Parametro {Texto} [opcoes.nome] O nome do item que será adicionado no menu. Ex,. 'Exame'.
     * @Parametro {Text} [opcoes.rota] Valor da rota para este item do menu. Ex,. '#exameLista'.
     */
    initialize: function (opcoes) {
      var esteObjeto = this;
      this.opcoes = opcoes;
    }
  });
  
  /* @Método [Privado] _adcItemNoMenuDoTopo().
   *
   * Utilizado para adição de um item no menu do topo do painel.
   *
   * @Parametro {Objeto} [item] Contêm dados básicos para adição de um item no menu.
   * @Parametro {Texto} [item.local] O valor do local no menu onde o item será adicionado. Ex,. 'Cadastro', 'Listas' etc. 
   * @Parametro {Texto} [item.nome] O nome do item que será adicionado no menu. Ex,. 'Exame'.
   * @Parametro {Text} [item.rota] Valor da rota para este item do menu. Ex,. '#exameLista'.
   */
  BarraDeNav.prototype._adcItemNoMenuDoTopo = function(item) {
    var visao = new this.visaoDoItemNoMenuDoTopo(item);
    
    visao.render();
    $("#detail").html(visao.el);
  };
  
  /* @Método [Publico] descarregar().
   * Descarregamos aqui as nossas visões e tudo mais que seja necessário. 
   */
  BarraDeNav.prototype.descarregar = function() {
    
    if (this.visaoBase) { 
      //this.visaoBase.descarregar(); 
      //this.visaoBase = null;
    }
   
  };
  
  return BarraDeNav;
});