'use strict'

/* @arquivo entrada.js */

/* Versão 0.0.1-Beta
 * - Adicionar caracteristica de validação para o formulário de entrada do painel de administração. (issue #48) [AFAZER]
 */

define([
  'jquery'
, 'backbone'
, 'underscore'
, 'bootstrap'
, 'utilitarios'
, 'text!/admin/js/templantes/paginas/entrada/Visao.Entrada.html'
, 'text!/admin/js/templantes/paginas/painel/Visao.Painel.html'
], function($, Backbone, _, Bootstrap, Utilitarios, TemplanteEntrada, TemplantePainel){
  
  /* @Visão Entrada().
   *
   * Responsavel por apresentar e lidar com a página de entrada e a pagina do painel de administração.
   * Logo após o usuário realizar a sua entrada nós iremos apresentar para ele a visão de painel.
   ----------------------------------------------------------------------------------------------------*/
  var Entrada = Backbone.View.extend({
    
    /* @Propriedade {Objeto} [ModeloSessao] O Modelo para realizarmos a sessão. */
    ModeloSessao: null,
    
    /* @Propriedade {Texto} [jid] O Jabber ID do usuário. (Composto por local@dominio). */
    jid: null,  
    
    /* @Propriedade {Texto} [senha] A senha deste usuário. */
    senha: null,  
    
    /* @Propriedade {Objeto} [attributes] Os atributos desta visão. */
    attributes: {
    
    },

    /* @Construtor initialize().
     *
     * Aqui realizamos o inicio da visão de entrada. Se o usuário estiver autenticado nós apresentaremos
     * a visão do painel. Caso contrário nós apresentaremos a visão para realização da entrada.
     *
     * @Parametro {Objeto} [ModeloSessao] Contêm dados do modelo de sessão.
     * @Retorna {Objeto} Valor deste objeto.
     */
    initialize: function (ModeloSessao) {
      var esteObjeto = this;
      this.ModeloSessao = ModeloSessao;
     
      // Espera os eventos da propriedade auth do ModeloSessao. Assim podemos 
      // manipular a interface do usuário de acordo com o estado de autenticação atual do usuário.
      this.ModeloSessao.on('change:auth', function (sessao) {
        esteObjeto.renderizar();
      });
      this.renderizar();
      return this;
    },

    /* @Método [Público] renderizar().
     *
     * Renderizamos aqui o nosso templante e o acrescentamos ao DOM. Escolheremos aqui o templante a a ser 
     * apresentado dependendo da propriedade 'auth' do nosso ModeloSessao. Caso a usuário esteja autenticado
     * então mostramos a interface do painel. Caso contrário, nós iremos manipular para que seja apresentada 
     * novamente uma tela para que ele realize a entrada novamente.
     */
    renderizar: function () {
      if(this.ModeloSessao.get('auth')){
        this.$el.html(_.template(TemplantePainel));
      } else {
        this.$el.html(_.template(TemplanteEntrada)); 
      }
    },
    
    /* @Método [Privado] _aoEscreverAtualizarJid().
     *
     * Sempre que o usuário digitar na entrada de jid nós iremos acessar o valor para
     * realizarmos a entrada posteriormente.
     *
     * @Parametro {Objeto} [evento] Contêm dados para acesso dos elementos do DOM.
     */
    _aoEscreverAtualizarJid: function(evento) {
      this.jid = $(evento.currentTarget).val();
    },
    
    /* @Método [Privado] _aoEscreverAtualizarSenha().
     *
     * Sempre que o usuário digitar na entrada de senha nós iremos acessar o valor para
     * realizarmos a entrada posteriormente.
     *
     * @Parametro {Objeto} [evento] Contêm dados para acesso dos elementos do DOM.
     */
    _aoEscreverAtualizarSenha: function(evento) {
      this.senha = $(evento.currentTarget).val();
    },
    
    /* @Método [Privado] _aoClicarEntrar().
     *
     * Realizamos aqui a entrada do usuário. É necessário o Jid e a senha.
     *
     * @Parametro {Objeto} [evento] Contêm dados para acesso dos elementos do DOM.
     */ 
    _aoClicarEntrar: function (evento) {
      evento.preventDefault();
      var esteObjeto = this;
      
      // Lembre-se que para o usuário entrar fica necessário informarmos o jid e a senha.
      // Assim que o usuário entrar, vamos utilizar o cookie recebido para as novas requisições.
      this.ModeloSessao.entrar({jid: this.jid, senha: this.senha}, function(seAutenticou, resposta){
        if (seAutenticou) {
          // Limpamos o jid e senha armazenados.
          esteObjeto.jid = esteObjeto.senha = '';
        } else {
          console.log('Não foi possível autenticar o usuário. ('+ resposta.responseJSON.message +')');
        }
      });
    },
    
    /* @Método [Privado] _aoClicarSair().
     *
     * Evento disparado ao clicar no botão de saida.
     *
     * @Parametro {Objeto} [evento] Contêm dados para acesso dos elementos do DOM.
     */
    _aoClicarSair : function(evento) {
      evento.preventDefault();
      this.ModeloSessao.sair();
    },
    
    /* @Propriedade {Objeto} [events] Aqui temos os eventos que esta visão irá escutar.
     * Cada evento será disparado quando o usuário realizar alguma atividade no navegador. 
     */
    events: {
      'submit form.sair': '_aoClicarSair',                       // Ao clicar no botão sair.
      'submit form.entrada': '_aoClicarEntrar',                  // Ao clicar em botão de submeter o formulário.
      'change input#entrada-jid': '_aoEscreverAtualizarJid',     // Ao escrever no campo de entrada de jid.
      'change input#entrada-senha': '_aoEscreverAtualizarSenha'  // Ao escrever no campo de entrada de senha.
    },

    /* @Método [Privado] _iniciarMeusComponentes().
     *
     * Iniciamos componentes para esta visão. Os componentes podem ser do bootstrap, 
     * jQuery e outros frameworks utilizados
     */ 
    _iniciarMeusComponentes: function(){
      
    },
    
    /* @Método [Privado] _iniciarMinhaEscutaEventos().
     *
     * Iniciamos as escutas de eventos para esta visão. Os eventos podem ser de elementos do 
     * bootstrap, jQuery e outros frameworks utilizados
     */ 
    _iniciarMinhaEscutaEventos: function() {
      
    }

  });
  
  return Entrada;
});