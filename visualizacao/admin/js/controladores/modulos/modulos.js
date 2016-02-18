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
, 'eventos'
, 'controladores/modulos/escopos'
, 'visoes/painel/modulos/exames/exames'
, 'visoes/painel/modulos/unidades/unidades'
], function($, Backbone, _, Eventos, Escopos, ModuloVisaoExames, ModuloVisaoUnidades) {
  
  var evts = new Eventos();
  
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
    
    /* @Propriedade {Utilitario} [escopos] Responsavel por lidar com os escopos. */
    this.escopos = new Escopos();
    
    /* @Propriedade {Controlador} [ctrldrRotas].
     * Responsavel por lidar com as diversas rotas dos módulos e dos sub-módulos. */
    this.ctrldrRotas = ctrldrRotas;
    this.ctrldrRotas.adcEscopos(this.escopos);
    
    /* @Propriedade {Matriz} [modulos] Contêm os módulos. */
    this.modulos = [];
    
    // Carregaremos os nossos módulos.
    this._carregarOsModulos();
    
    /* Evento disparado logo após todas as visões da interface base estiverem carregadas e prontas 
     * para receberem entradas dos módulos. A interface base não é nada mais que uma coluna dorsal
     * das visões base deste aplicativo. */
    evts.subscrever('Global', 'controlador:interfacebase:carregada', 'sempreQuandoPublicado', function() {
      
      if (!this.moduloVisaoExames) {
        //this.moduloVisaoExames = new ModuloVisaoExames(this.escopos);
      }
    }, this);
    
    /* Evento disparado quando a interface base estiver descarregada. Utilizamos isso para descarregar
     * os nossos módulos e tudo mais que for necessário. */
    evts.subscrever('Global', 'controlador:interfacebase:descarregada', 'sempreQuandoPublicado', function() {
      
      // <umdez> Provavelmente não será necessário adicionar esta caracteristica. Eu digo isso 
      // porque não tras beneficio algum. Seria apenas mais uma forma de aumentar a complexidade 
      // do código. 
      
      if (this.moduloVisaoExames) {
        //this.moduloVisaoExames.descarregar();
        //this.moduloVisaoExames = null;
      }
    }, this);
    
  };
  
  /* @Método {Privado} _carregarOsModulos().
   * Carregaremos os módulos e adicionaremos uma rota para cada um deles. */
  Modulos.prototype._carregarOsModulos = function() {
    var modulos = this.modulosEstaticos;
    
    // Carregamos aqui a nossa lista de módulos.
    for (var ca = 0; ca < modulos.length; ca++) {
      // Caso o módulo não foi carregado nós prosseguimos.
      if (this.modulos[modulos[ca].modulo] === undefined) {
        // Iniciamos o nosso módulo.
        this.modulos[modulos[ca].modulo] = new modulos[ca].valor(this.escopos, this.ctrldrRotas);
        // Iniciamos as bandeiras para o módulo.
        this.modulos[modulos[ca].modulo].carregarAsBandeiras();
        // Nós iremos adicionar uma rota para este módulo carregado.
        this.ctrldrRotas.adcUmaRotaParaUmModulo(modulos[ca].modulo, this.modulos[modulos[ca].modulo]);
      }
    }
    
    // Depois que todas bandeiras de todos os módulos estiverem carregadas é a hora de carregarmos os seus sub-módulos.
    // Isso é importante porque alguns módulos irão necessitar das bandeiras de outros módulos ou sub-módulos.
    for (var ca = 0; ca < modulos.length; ca++) {
      // Caso o módulo já foi carregado então nós prosseguimos.
      if (this.modulos[modulos[ca].modulo]) this.modulos[modulos[ca].modulo].carregarAsRotasParaSubModulos(); 
    }
  };
  
  /* @Propriedade {Matriz} (Constante) [modulosEstaticos]. Para cada um dos nóssos módulos estáticos,
   * nós iremos necessitar de informar:
   *
   * - {Texto} [identificador]  Serve para identificar o elemento DOM que conterá esta visão. 
   * - {Texto} [modulo]         Servirá para identificarmos este módulo.
   * - {Modulo} [valor]         Modulo de visão.
   */
  Modulos.prototype.modulosEstaticos = [
    { 'identificador': null, 'modulo': 'exames', 'valor': ModuloVisaoExames }
  , { 'identificador': null, 'modulo': 'unidades', 'valor': ModuloVisaoUnidades }
  ];
  
  return Modulos;
});