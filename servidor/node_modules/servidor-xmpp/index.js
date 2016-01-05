'use strict'

var Servidor = require('./biblioteca/iniciador/principal');
var configuracao = require('./configuracao/configuracao.js');
var Promessa = require('bluebird');
var extend = require('util')._extend;
var registrador = require('./biblioteca/nucleo/Registrador')('index');

/* Oferece abstração para o servidor xmpp.
 */
var servidorXmpp = {
  opcoes: null,
  
  /* Iniciamos aqui com as opções informadas. Realizamos a união das opções passadas com
   * aquelas configurações básicas do nosso servidor.
   *
   * @Parametro {opcoes} Aquelas opções de configuração do servidor.
   */
  inicializar: function(opcoes) {
    var esteObj = this;
    return new Promessa(function (deliberar, recusar) {
      esteObj.opcoes = extend(configuracao, opcoes); 
      deliberar();
    });
  },
  
  /* Carregamos o nosso servidor. e chamamos a função cd().
   *
   * @Parametro {cd} Função chamada logo após tudo estiver carregado no servidor.
   */
  carregar: function(cd) {
    Servidor.prosseguir(this.opcoes, cd);
  },
  
  // Retornamos o servidor para acesso direto se for necessário.
  Servidor: Servidor
};

module.exports = servidorXmpp;