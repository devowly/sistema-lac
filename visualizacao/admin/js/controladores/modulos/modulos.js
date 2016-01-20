'use strict'

/*
 * @arquivo modulos.js
 */ 

/* Versão 0.0.1-Beta
 */
 
define([
  'jquery'
, 'backbone'
, 'underscore'
, 'controladores/modulos/escopos'
, 'visoes/painel/modulos/exames/exames'
], function($, Backbone, _, Escopos, ModuloVisaoExames) {
  
  /* @Controlador Modulos().
   * 
   * Acrescenta as caracteristicas para gerenciamento dos diversos módulos e sub-módulos do 
   * aplicativo.
   *
   * @Propriedade {Controlador} [ctrldrRotas] Responsavel por lidar com as diversas rotas dos 
   *                                          módulos e dos sub-módulos.
   --------------------------------------------------------------------------------------------*/
  var Modulos = function(ctrldrRotas) {
    var esteObjeto = this;
    this.escopos = new Escopos();
    this.ctrldrRotas = ctrldrRotas;
    this.ctrldrRotas.adcEscopos(this.escopos);
    this.ctrldrRotas.carregarAsRotasParaModulo(this.modulosEstaticos, this);
    
    /* Evento disparado logo após todas as visões da interface base estiverem carregadas e prontas 
     * para receberem entradas dos módulos. A interface base não é nada mais que uma coluna dorsal
     * das visões base deste aplicativo. */
    Aplicativo.eventos.on('controlador:interfacebase:carregada', function() {
      
      if (!this.moduloVisaoExames) {
        //this.moduloVisaoExames = new ModuloVisaoExames(this.escopos);
      }
    }, this);
    
    /* Evento disparado quando a interface base estiver descarregada. Utilizamos isso para descarregar
     * os nossos módulos e tudo mais que for necessário. */
    Aplicativo.eventos.on('controlador:interfacebase:descarregada', function() {
      
      // <umdez> Provavelmente não será necessário adicionar esta caracteristica. Eu digo isso 
      // porque não tras beneficio algum. Seria apenas mais uma forma de aumentar a complexidade 
      // do código. 
      
      if (this.moduloVisaoExames) {
        //this.moduloVisaoExames.descarregar();
        //this.moduloVisaoExames = null;
      }
    }, this);
  };
  
  /* @Propriedade {Pilha} [modulosEstaticos]. Para cada um dos nóssos módulos estáticos,
   * nós iremos necessitar de informar:
   *
   * - [identificador] Serve para identificar o elemento DOM que conterá esta visão. 
   * - [modulo]        Servirá para identificarmos este módulo.
   * - [nome]          Variavel que iremos utilizar para armazenar os dados da visão do modulo.
   * - [valor]         Modulo de visão.
   */
  Modulos.prototype.modulosEstaticos = [
    { 'identificador': null, 'modulo': 'exames', 'nome': 'moduloVisaoExames', 'valor': ModuloVisaoExames }
  ];
  
  return Modulos;
});