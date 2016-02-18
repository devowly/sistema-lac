'use strict'

/* Aqui vamos adicionar as caracteristicas de trabalhar com as rotas, Carregar os arquivos de visão etc.  
 * 
 * @arquivo roteador.js
 */ 

/* Versão 0.0.1-Beta
 * - Adc. caracteristica de troca das visões pelo roteador. (issue #52) [AFAZER].
 */
 
define([
  'jquery'
, 'backbone'
, 'underscore'
, 'eventos'
, 'controladores/escopo/escopos'
, 'controladores/interface/interfaceBase'
, 'controladores/modulos/modulos'
, 'controladores/rotas/rotas'
, 'visoes/entrada/entrada'
, 'modelos/sessao/sessao'
], function($, Backbone, _, Eventos, ControladorEscopos, ControladorInterfaceBase, ControladorModulos, ControladorRotas, VisaoEntrada, ModeloSessao){
  
  var evts = new Eventos();
  
  /* @Roteador SitioRoteador().
   *
   * Aqui temos as propriedades e métodos do nosso roteador. O roteador, como o nome já indica,
   * realiza a apresentação das visões para cada cada rota acessada.
   -------------------------------------------------------------------------------------------*/
  var SitioRoteador = Backbone.Router.extend({
    
    /* @Propriedade {Objeto} [routes] Contêm as nossas rotas. */
    routes: {
      '':            'inicio'
    , ':modulo':     'rotasDeUmNivel'
    , ':modulo/:id': 'rotasDeDoisNiveis'
    },
    
    /* @Construtor initialize().
     *
     * Aqui realizamos o inicio do nosso roteador. 
     *
     * @Parametro {Controlador} [ctrldrRotas] Gerencia as rotas.
     */
    initialize: function (ctrldrRotas) {
      this.ctrldrRotas = ctrldrRotas;
      
      /* Sempre quando a rota for modificada nós iremos disparar um evento, desta forma podemos
       * requisitar os escopos do usuário e fazer qualquer outra coisa que necessite ser realizada 
       * ao modificarmos uma rota.
       *
       * @Veja http://stackoverflow.com/a/9704262/4187180
       */
      this.bind('route', function() {
        // Aplicativo.eventosGlobais.trigger('roteador:rota:modificada');
        
        evts.publicar('Global', 'roteador:rota:modificada', null);
      });
      
      /* Iniciamos a visão de entrada, sempre que o usuário acessar o nosso sitio, será apresentada
       * uma visão de acordo com o estado atual da sessão. Se o usuário já tem uma sessão aberta, 
       * nós iremos apresenta-lo com uma visão do painel, caso contrário, iremos apresentar uma
       * visão onde seja possível que o usuário realize a sua entrada. */
      if (!this.visaoEntrada) { this.visaoEntrada = new VisaoEntrada(ModeloSessao) }
      $('#conteudo-raiz').html(this.visaoEntrada.el); // Acrescentamos aqui a visão de entrada ao DOM

    },
    
    /* @Método inicio().
     *
     * Esta é a rota sempre apresentada inicialmente.
     */
    inicio: function() {
      
    },
    
    /* @Método rotasDeUmNivel(). 
     *
     * Esta é a rota chamada quando o usuário não especificar um id.
     */
    rotasDeUmNivel: function(modulo){
      this.ctrldrRotas.manipularAsRotas(modulo, null);
    },

    /* @Método rotasDeDoisNiveis(). 
     *
     * Esta é a rota chamada quando o usuário informar um id.
     */
    rotasDeDoisNiveis: function(modulo, id){
      this.ctrldrRotas.manipularAsRotas(modulo, id);
    }
    
  });
  
  /* @Função inicializar().
   *
   * Responsável por verificar o estado de autenticação do usuário e também por
   * iniciar o nosso roteador, histório de rotas e os controladores.
   ----------------------------------------------------------------------------*/
  var inicializar = function() {
    
    /* @Variavel {Controlador} [ctrldrEscopos].
     * Iniciamos aqui o nosso controlador de escopos. Assim podemos requisitar os 
     * escopos deste usuário sempre que possível.
     */
    var ctrldrEscopos = new ControladorEscopos(ModeloSessao); 
    
    /* @Variavel {Controlador} [ctrldrRotas].
     * Iniciamos aqui o controle das nossas rotas. Cada um dos módulos e seus sub-módulos
     * poderão oferecer visões relacionadas a determinada rota.
     */
    var ctrldrRotas = new ControladorRotas();
    
    /* @Variavel {Controlador} [ctrldrModulos].
     * Iniciamos aqui o controlador dos módulos do nosso sitio. Os modulos irão oferecer
     * as caracteristicas básicas para os nossos modelos REST.
     */
    var ctrldrModulos = new ControladorModulos(ctrldrRotas);
    
    /* @Variavel {Controlador} [ctrldrInterfaceBase].
     * Iniciamos aqui o nosso controlador da interface base do nosso sistema. Assim iremos 
     * controlar a aparencia base que será preenchida por cada módulo dependendo do
     * acesso a determinado escopo. 
     */
    var ctrldrInterfaceBase = new ControladorInterfaceBase(ModeloSessao);
    
    /* Sempre é necessário verificar o estado da sessão do usuário. A gente confere o estado aqui,
     * porque quando o usuário recarregar a página nós iremos apresentar a visão correta.
     */
    ModeloSessao.seAutenticado((function(seAutenticado, resposta) {
      
      /* Devemos iniciar aqui o roteador porque sempre iremos apresentar a visão
       * depois de verificar a sessão do usuário. */
      var sitioRoteador = new SitioRoteador(ctrldrRotas);
      
      /* Disparamos este evento quando o nosso roteador estiver carregado com sucesso.
       * Assim utilizamos ele para acrescentar as rotas dos nossos módulos. */
      // Aplicativo.eventosGlobais.trigger('roteador:carregado');
        
      evts.publicar('Global', 'roteador:carregado', null);
        
      // Iniciamos aqui o histórico das rotas.
      Backbone.history.start();   
        
    }).bind(this));
  };
 
  return { 
    inicializar: inicializar
  };
});