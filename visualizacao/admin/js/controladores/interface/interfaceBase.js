'use strict'

/*
 * @arquivo interfaceBase.js
 */ 

/* Versão 0.0.1-Beta
 */
 
define([
  'jquery'
, 'backbone'
, 'underscore'
, 'eventos'
, 'visoes/painel/base/topo/topo'
, 'visoes/painel/base/barraDeNav/barraDeNav'
], function($, Backbone, _, Eventos, VisaoTopoDoPainel, VisaoBarraDeNavDoPainel){
  
  var evts = new Eventos();
  
  /* @Controlador InterfaceBase().
   * 
   * Aqui é o inicio da espinha dorsal da interface do nosso sistema. Iremos iniciar a interface
   * base que depois será preenchida por cada módulo do sistema baseado nos escopos que o usuário 
   * possuir.
   *
   * A interface base que iremos apresentar possuirá quatro partes principais que são: topo, 
   * barra de navegação, conteúdo e rodapé. Estas partes principais oferecem aos módulos 
   * caracteristicas de apresentação. 
   *
   * @Parametro {Modelo} [ModeloSessao] É a sessão do usuário. Utilizaremos sempre que necessário 
   *                                    para verificar o estado atual de validação do usuário. 
   ---------------------------------------------------------------------------------------------*/
  var InterfaceBase = function(ModeloSessao) {
    var esteObjeto = this;
    
    /* @Propriedade {Modelo} [modeloSessao] Armazena o modelo de sessão do nosso 
     * usuário. */
    this.modeloSessao = ModeloSessao;
    
    /* Evento disparado quando o usuário tiver realizado a entrada com sucesso. Logo após isso
     * podemos apresentar a interface base. */
    evts.subscrever('Global', 'modelo:sessao:usuario:dentro', 'sempreQuandoPublicado', this._carregarInterface, this);
    
    /* Evento disparado sempre que o nosso roteador estiver carregado, aqui verificamos se
     * a sessão do usuário está aberta, depois disso nós acrescentamos as nossas visões no DOM.   
     * Lembre-se que quando o roteador estiver carregado isso significa que já foi realizado
     * uma verificação do estado da sessão do usuário. Além disso, quando o roteador é carregado
     * significa que o sitio foi acessado inicialmente ou a página foi reiniciada pelo usuário. */
    evts.subscrever('Global', 'roteador:carregado', 'quandoPublicado', this._carregarInterface, this);
    
    /* Quando uma rota nova é acessada então este evento será disparado. */
    evts.subscrever('Global', 'roteador:rota:modificada', 'sempreQuandoPublicado', function() {}, this);
    
    /* Quando o usuário sair do painel. Usamos isto para realizar a remoção das nossas visões.
     * @Veja http://stackoverflow.com/a/11534056/4187180 */
    evts.subscrever('Global', 'modelo:sessao:usuario:fora', 'sempreQuandoPublicado', this._descarregarInterface, this);
    
  };
  
  /* @Método {Privado} _carregarInterface(). Carregamos as visões da interface básica aqui.
   */
  InterfaceBase.prototype._carregarInterface = function() {
    
    if (this.modeloSessao && this.modeloSessao.get('auth')) {
      // Acrescentamos aqui as nossas visões ao DOM.
      var visoes = this.visoesEstaticas; 
      for (var ca = 0; ca < visoes.length; ca++) {
        if (!this[visoes[ca].nome]) {
          this[visoes[ca].nome] = new visoes[ca].valor();
          this[visoes[ca].nome].visaoBase = new this[visoes[ca].nome].visao();
          var $conteudo = $(visoes[ca].identificador);
          $conteudo.html(this[visoes[ca].nome].visaoBase.el);
        }
      }
        
      // Informamos que as nossas visões estão totalmente carregadas e podem agora 
      // receber requisições.
      evts.publicar('Global', 'controlador:interfacebase:carregada', null);
    }
  };
  
  /* @Método {Privado} _descarregarInterface(). Descarregamos as visões da interface básica aqui.
   */
  InterfaceBase.prototype._descarregarInterface = function() {
    
    // <umdez> Provavelmente não será necessário adicionar esta caracteristica. Eu digo isso 
    // porque não tras beneficio algum. Seria apenas mais uma forma de aumentar a complexidade 
    // do código. 
    
    // Descarregamos aqui as nossas visões.
    var visoes = this.visoesEstaticas; 
    for (var ca = 0; ca < visoes.length; ca++) {
      if (this[visoes[ca].nome]) {
        //this[visoes[ca].nome].descarregar();
        //this[visoes[ca].nome] = null;
      }
    }
 
    // Informamos aqui que as nossas visões e tudo mais que seja necessário estão
    // totalmente encerradas.
    // Aplicativo.eventosGlobais.trigger('controlador:interfacebase:descarregada');
  };
  
  /* @Propriedade {Pilha} [visoesEstaticas]. Para cada uma das nossas visões, nós
   * iremos necessitar de informar:
   *
   * - {Texto} [identificador] Serve para identificar o elemento DOM que conterá esta visão.
   * - {Texto} [nome]          A variavel que iremos utilizar para armazenar os dados da visão.
   * - {Visão} [valor]         O modulo de visão.
   */
  InterfaceBase.prototype.visoesEstaticas = [
    { 'identificador': 'div#topo > span#topo-menu', 'nome': 'visaoTopoDoPainel', 'valor': VisaoTopoDoPainel }
  , { 'identificador': 'div#barra-navegacao', 'nome': 'visaoBarraDeNavDoPainel', 'valor': VisaoBarraDeNavDoPainel }
  ];
  
  return InterfaceBase;
});