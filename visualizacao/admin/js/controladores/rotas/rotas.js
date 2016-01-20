'use strict'

/*
 * @arquivo rotas.js
 */ 

/* Versão 0.0.1-Beta
 */
 
define([
  'jquery'
, 'backbone'
, 'underscore'
], function($, Backbone, _){
  
  /* @Controlador Rotas().
   *
   * Realiza a gerencia das rotas para os módulos e sub-módulos.
   *
   * @veja http://stackoverflow.com/q/12153956/4187180
   --------------------------------------------------------------------------------------*/
  var Rotas = function() {
    
    /* @Propriedade {Pilha} [modulos] Contêm os módulos. */
    this.modulos = [];
    
    /* @Propriedade {Pilha} [subModulos] Contêm os sub-módulos. */
    this.subModulos = [];
    
    /* @Propriedade {Utilitario} [escopos] Os escopos. */
    this.escopos = null;
    
    this.inicializar();
  };

  Rotas.prototype.inicializar = function() {
    
  };
  
  /* @Método {Publico} adcEscopos().
   * 
   * Adicionamos uma referencia ao módulo dos escopos. Nós iremos fazer uso dos escopos intensamente
   * para controle de acesso as rotas.
   *
   * @Parametro {Utilitario} [escopos] Os escopos.
   */
  Rotas.prototype.adcEscopos = function(escopos) {
    this.escopos = escopos;
  };
  
  /* @Método {Publico} carregarAsRotasParaModulo(). 
   * 
   * Aqui carregaremos as rotas para os modulos. Cada um dos módulos possuirá uma rota, por exemplo,
   * o módulo 'exames' possuirá uma rota #exames.
   *
   * @Parametro {Pilha} [listaDeModulos] Contêm a lista dos modulos que iremos carregar.
   * @Parametro {Texto} [listaDeModulos.identificador] Serve para identificar o elemento DOM que conterá esta visão.
   * @Parametro {Texto} [listaDeModulos.modulo] Servirá para identificarmos este módulo.
   * @Parametro {Texto} [listaDeModulos.nome] Variavel que iremos utilizar para armazenar os dados da visão.
   * @Parametro {Modulo} [listaDeModulos.valor] Modulo de visão.
   */
  Rotas.prototype.carregarAsRotasParaModulo = function(listaDeModulos, objDoMod) {
    var modulos = listaDeModulos;
    for (var ca = 0; ca < modulos.length; ca++) {
      // Caso o módulo não foi carregado nós prosseguimos.
      if (!this.modulos[modulos[ca].modulo]) {
        this.modulos[modulos[ca].modulo] = new modulos[ca].valor(this.escopos, this);
        objDoMod[modulos[ca].nome] = this.modulos[modulos[ca].modulo];
      }
    }
  };
  
  /* @Método {Publico} carregarAsRotasParaSubModulo(). 
   * 
   * Aqui carregaremos as rotas para os sub-modulos. 
   *
   * @Parametro {Pilha} [listaDeSubModulos] Contêm a lista dos sub-modulos que iremos carregar.
   * @Parametro {Texto} [listaDeSubModulos.modulo] Servirá para identificarmos o módulo deste sub-modulo.
   * @Parametro {Texto} [listaDeSubModulos.modelo] O modelo.
   * @Parametro {Texto} [listaDeSubModulos.identificador] Serve para identificar o elemento DOM que conterá esta visão.
   * @Parametro {Texto} [listaDeSubModulos.subModulo] Nome da rota para este sub-modulo.
   * @Parametro {Modulo} [listaDeSubModulos.valor] Modulo de visão.
   * @Parametro {Evento} [listaDeSubModulos.evts] Eventos locais ao modulo e sub-modulos.
   */
  Rotas.prototype.carregarAsRotasParaSubModulo = function(listaDeSubModulos, objDoSubMod) {
    var subModulos = listaDeSubModulos;
    
    // Percorremos cada um dos sub-modulos.
    for (var ca = 0; ca < subModulos.length; ca++) {
      
      // Caso o sub-modulo ainda não foi carregado nós iremos carregar aqui.
      if(!this.subModulos.hasOwnProperty(subModulos[ca].modulo)) {
        this.subModulos[subModulos[ca].modulo] = [];
      } else if (this.subModulos[subModulos[ca].modulo] === null) {
        this.subModulos[subModulos[ca].modulo] = [];
      }
      
      // Acrescentamos os dados para o sub-modulo.
      this.subModulos[subModulos[ca].modulo][subModulos[ca].subModulo] = {
        'modulo': subModulos[ca].modulo
      , 'subModulo': subModulos[ca].subModulo
      , 'modelo': subModulos[ca].modelo
      , 'identificador': subModulos[ca].identificador
      , 'valor': new subModulos[ca].valor(this.escopos, subModulos[ca].evts)
      , 'livre': subModulos[ca].livre
      , 'acoes': subModulos[ca].acoes
      }
      
      objDoSubMod[subModulos[ca].nome] = this.subModulos[subModulos[ca].modulo][subModulos[ca].subModulo].valor;
    }
  };
  
  /* @Método {Publico} manipularAsRotas().
   *
   * Realizamos aqui a manipulação das rotas que são requisitadas. Estas rotas podem ser para um 
   * sub-modulo ou um modulo. Além disso nós também realizamos a verificação da permissão do usuário
   * que realizou a requisição, porque alguns módulos e sub-módulos podem requisitar que o usuário possua
   * alguma bandeira de acesso.
   *
   * @Parametro {Texto} [rota] O valor da rota que o usuário requisitou.
   * @Parametro {Texto} [id] O identificador que o usuário requisitou.
   */
  Rotas.prototype.manipularAsRotas = function(rota, id) {
    if (this.modulos[rota]) {
      // Aqui temos a requisição de acesso a rota de um modulo.
      if (id === null) {
        // this.modulos[rota].chamarAlgo();
      } else {
        // this.modulos[rota].chamarAlgoDiferente(id);
      }
    } else {
      // Aqui temos a requisição de acesso a uma rota de um sub-modulo.
      for (var modulo in this.modulos) {
        if (this.subModulos[modulo] && this.subModulos[modulo][rota]) {
          
          // this.modulos[modulo].fazerAlgoAntesDoSubModulo();
          
          // this.subModulos[modulo][rota].fazerAlgoDepoisDoModulo();
          
          var modulo = this.subModulos[modulo][rota].modulo;
          var modelo = this.subModulos[modulo][rota].modelo;
          var acoes = this.subModulos[modulo][rota].acoes;
          var livre = this.subModulos[modulo][rota].livre;
          
          this.escopos.sePossuiAcessoAoEscopo(modulo, modelo, acoes, livre, (function(possui){
            if(possui){
              // Apresentar a visão do sub-modulo.
            } else {
              // Talvez apresentar uma visão informando que não possui acesso?
            }
          }).bind(this));
          
          break;
        }
      }
    }
  };
  
  return Rotas;
});