'use strict'

/* @arquivo entrada.js */

/* Versão 0.0.1-Beta */

define([
  'jquery',
  'backbone',
  'underscore',
  'bootstrap',
  'utilitarios',
  'text!/admin/js/templantes/paginas/entrada/Visao.Entrada.html',
  'text!/admin/js/templantes/paginas/painel/Visao.Painel.html'
], function($, Backbone, _, Bootstrap, Utilitarios, TemplanteEntrada, TemplantePainel){
  
  /* Responsavel por lidar com a página de entrada e a pagina do painel de administração.
   */
  var Entrada = Backbone.View.extend({
    
    // O Modelo para realizarmos a sessão.
    ModeloSessao: null,
    
    // O Jabber ID do usuário. (Composto por local@dominio).
    jid: null,  
    
    // A senha deste usuário.
    senha: null,  
    
    attributes: {
      
    },

    initialize: function (ModeloSessao) {
      var esteObjeto = this;
      this.ModeloSessao = ModeloSessao;
     
      // Espera os eventos da propriedade auth do ModeloSessao. Assim podemos 
      // manipular a interface do usuário de acordo com o estado de autenticação atual do usuário.
      this.ModeloSessao.on('change:auth', function (sessao) {
        esteObjeto.render();
      });
      this.render();
      return this;
    },

    render: function () {
      /* Escolheremos aqui o templante a ser apresentado dependendo da propriedade 'auth' do nosso ModeloSessao.
       * Caso a usuário esteja autenticado então mostramos a interface do painel. Caso contrário, nós iremos 
       * manipular para que seja apresentada novamente uma tela para que ele realize a entrada novamente.
       */
      if(this.ModeloSessao.get('auth')){
        this.$el.html(_.template(TemplantePainel));
      } else {
        this.$el.html(_.template(TemplanteEntrada)); 
      }
    },
    
    // Sempre que o usuário digitar na entrada de jid nós iremos acessar o valor para
    // realizarmos a entrada posteriormente.
    _aoEscreverAtualizarJid: function(evento) {
      this.jid = $(evento.currentTarget).val();
    },
    
    // Sempre que o usuário digitar na entrada de senha nós iremos acessar o valor para
    // realizarmos a entrada posteriormente.
    _aoEscreverAtualizarSenha: function(evento) {
      this.senha = $(evento.currentTarget).val();
    },
    
    // Realizamos aqui a entrada do usuário. É necessário o Jid e a senha.
    _aoClicarEntrar: function (evento) {
      evento.preventDefault();
      var esteObjeto = this;
      
      // Lembre-se que para o usuário entrar fica necessário informarmos o jid e a senha.
      // Assim que o usuário entrar, vamos utilizar o cookie recebido para as novas requisições.
      this.ModeloSessao.entrar({jid: this.jid, senha: this.senha}, function(seAutenticou, resposta){
        if (seAutenticou) {
          // Caso tudo ocorra bem, então, nós iremos acessar a coleção de escopos.
          Utilitarios.carregarColecao([esteObjeto.ModeloSessao.escopos], function(){
            // Veja que cada modelo de escopo possui o nome do modelo (tabela) no banco de dados e também o valor da bandeira de acesso.
            // Com estes valores em mãos nós podemos *montar* aqui a nossa interface do usuário.
            for(var ca = 0; ca < esteObjeto.ModeloSessao.escopos.length; ca++){
              console.log(ca + ': ' + esteObjeto.ModeloSessao.escopos.models[ca].get('modelo') + ' ' + esteObjeto.ModeloSessao.escopos.models[ca].get('bandeira'));
            }
          });
          // Limpamos o jid e senha armazenados.
          esteObjeto.jid = esteObjeto.senha = '';
        } else {
          console.log('Não foi possível autenticar o usuário. ('+ resposta.responseJSON.message +')');
        }
      });
    },
    
    // Evento disparado ao clicar no botão de saida.
    _aoClicarSair : function(evento) {
      evento.preventDefault();
      this.ModeloSessao.sair();
    },
    
    events: {
      'submit form.sair': '_aoClicarSair',                     // Ao clicar no botão sair.
      'submit form.entrada': '_aoClicarEntrar',                 // Ao clicar em botão de submeter o formulário.
      'change input#entrada_jid': '_aoEscreverAtualizarJid',     // Ao escrever no campo de entrada de jid.
      'change input#entrada_senha': '_aoEscreverAtualizarSenha'  // Ao escrever no campo de entrada de senha.
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
  
  return Entrada;
});