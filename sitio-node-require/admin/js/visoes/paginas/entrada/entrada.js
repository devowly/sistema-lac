'use strict'

/* @arquivo entrada.js */

/* Versão 0.0.1-Beta */

define([
  'jquery',
  'backbone',
  'underscore',
  'bootstrap',
  'utilitarios',
  'text!/admin/js/templantes/paginas/entrada/Visao.Entrada.html'
], function($, Backbone, _, Bootstrap, Utilitarios, Templante){
  
  /* Responsavel por lidar com a página de entrada do painel de administração.
   */
  var Entrada = Backbone.View.extend({
    
    ModeloSessao: null,
    jid: null,
    senha: null,
    
    templante: _.template(Templante),
    
    attributes: {
      
    },

    initialize: function (ModeloSessao) {
      this.render();
      this.ModeloSessao = ModeloSessao;
    },

    render: function () {
      // Renderiza este template
      this.$el.html(this.templante());
      return this;
    },
    
    mudarJid: function(evento) {
      this.jid = $(evento.currentTarget).val();
    },
    
    mudarSenha: function(evento) {
      this.senha = $(evento.currentTarget).val();
    },
    
    entrar: function (evento) {
      evento.preventDefault();
      
      var esteObjeto = this;
      
      this.ModeloSessao.entrar({jid: this.jid, senha: this.senha}, function(seAutenticou){
        if (seAutenticou) {
          Utilitarios.carregarColecao([esteObjeto.ModeloSessao.escopos], function(){
            for(var ca = 0; ca < esteObjeto.ModeloSessao.escopos.length; ca++){
              console.log(ca + ': ' + esteObjeto.ModeloSessao.escopos.models[ca].get('modelo') + ' ' + esteObjeto.ModeloSessao.escopos.models[ca].get('bandeira'));
            }
          });
        } else {
          console.log('Não foi possível autenticar o usuário.');
        }
        
      });
    },
    
    events: {
      'submit form.entrada': 'entrar',           // Ao submeter o formulário.
      'change input#entradaJid': 'mudarJid',     // Ao escrever na entrada do jid.
      'change input#entradaSenha': 'mudarSenha'  // Ao escrever na entrada do jid.
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