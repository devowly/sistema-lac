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
    
    /* @Propriedade {Matriz} [modulos] Contêm os módulos. */
    this.modulos = [];
    
    /* @Propriedade {Matriz} [subModulos] Contêm os sub-módulos. */
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
  
  /* @Método {Publico} adcUmaRotaParaUmModulo(). 
   * 
   * Aqui carregaremos uma rota para um modulo. Cada um dos módulos possuirá uma rota, por exemplo,
   * o módulo 'exames' possuirá uma rota #exames.
   *
   * @Parametro {Texto} [modulo] Servirá para identificarmos este módulo.
   * @Parametro {Modulo} [valor] Modulo de visão.
   */
  Rotas.prototype.adcUmaRotaParaUmModulo = function(modulo, valor) {
       
    // Caso o módulo já foi carregado então nós prosseguimos.
    if (this.modulos[modulo] === undefined) {
      this.modulos[modulo] = valor;
    }
  };
  
  /* @Método {Publico} carregarAsRotasParaSubModulo(). 
   * 
   * Aqui carregaremos as rotas para os sub-modulos. 
   *
   * @Parametro {Matriz} [listaDeSubModulos] Contêm a lista dos sub-modulos que iremos carregar.
   * @Parametro {Texto} [listaDeSubModulos.modulo] Servirá para identificarmos o módulo deste sub-modulo.
   * @Parametro {Texto} [listaDeSubModulos.modelo] O modelo.
   * @Parametro {Texto} [listaDeSubModulos.identificador] Serve para identificar o elemento DOM que conterá esta visão.
   * @Parametro {Texto} [listaDeSubModulos.subModulo] Nome da rota para este sub-modulo.
   * @Parametro {Modulo} [listaDeSubModulos.valor] Modulo de visão.
   * @Parametro {Evento} [listaDeSubModulos.evts] Eventos locais ao modulo e sub-modulos.
   */
  Rotas.prototype.carregarAsRotasParaSubModulo = function(listaDeSubModulos) {
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
      this.subModulos[subModulos[ca].modulo][subModulos[ca].nome] = {
        'modulo': subModulos[ca].modulo
      , 'nome': subModulos[ca].nome
      , 'modelo': subModulos[ca].modelo
      , 'identificador': subModulos[ca].identificador
      , 'valor': new subModulos[ca].valor(this.escopos)
      , 'livre': subModulos[ca].livre
      , 'acoes': subModulos[ca].acoes
      }
      
      // A partir de agora estaremos trocando informações a partir dos canais de eventos. Será que isso ficou obsoleto?
      // objDoSubMod[subModulos[ca].nome] = this.subModulos[subModulos[ca].modulo][subModulos[ca].subModulo].valor;
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
   * @Parametro {Texto} [id] Um identificador que o usuário informou na requisição.
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
          
          this.escopos.sePossuiAcessoAoEscopo(modulo, modelo, acoes, livre, (function(sePossuiPermissaoDeAcesso){
            if(sePossuiPermissaoDeAcesso){
              // Apresentar a visão do sub-modulo.
              if (id === null) {
                
              } else {
                
              }
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