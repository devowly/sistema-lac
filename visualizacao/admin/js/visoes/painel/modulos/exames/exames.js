'use strict'

/* @arquivo exames.js */

/* Versão 0.0.1-Beta
 */

define([
  'jquery'
, 'backbone'
, 'underscore'
, 'bootstrap'
, 'text!/admin/js/templantes/painel/modulos/exames/Visao.Exames.html'
, 'visoes/painel/modulos/exames/examesCriar'
, 'visoes/painel/modulos/exames/examesLer'
, 'visoes/painel/modulos/exames/examesListar'
], function($, Backbone, _, Bootstrap, TemplanteModuloExames, ModuloVisaoExamesCriar, ModuloVisaoExamesLer, ModuloVisaoExamesListar) {
  
  /* Aqui acrescentamos os eventos locais para este módulo. Assim ficará fácil para manipular 
   * os eventos que são locais a este escopo. Este padrão será utilizado na maioria dos modulos que
   * iremos criar.
   *
   * @Veja http://pragmatic-backbone.com/using-events-like-a-baws
   * @Veja https://lostechies.com/derickbailey/2012/04/03/revisiting-the-backbone-event-aggregator-lessons-learned/
   *
   * @Variavel {Evento} [eventos] Extenção dos eventos do Backbone.
   */
  var eventos = _.extend({}, Backbone.Events);
  
  /* @Modulo Exames().
   *
   * Este é o nosso módulo responsável pela gerencia da nossa visão principal dos exames. 
   *
   * @Propriedade {Utilitario} [Escopos] Contêm métodos para lidarmos com os escopos e também
   *                                     as bandeiras dos diversos módulos. 
   * @Propriedade {Controlador} [ctrldrRotas] Responsavel por lidar com as diversas rotas dos 
   *                                          módulos e dos sub-módulos.
   ---------------------------------------------------------------------------------------*/
  var Exames = function(Escopos, ctrldrRotas) {
       
    /* @Propriedade {Utilitario} [escopos] Contêm métodos para lidarmos com os escopos e também
     * as bandeiras dos diversos módulos. */
    this.escopos = Escopos;
    this.escopos.carregarAsBandeirasDoModulo(this.listaDasMinhasBandeiras);
    
    /* @Propriedade {Controlador} [ctrldrRotas] Responsavel por lidar com as diversas rotas dos 
     * módulos e dos sub-módulos. */
    this.ctrldrRotas = ctrldrRotas;
    this.ctrldrRotas.carregarAsRotasParaSubModulo(this.subModulosEstaticos, this);
    
  };
  
  /* @Propriedade {Pilha} [listaDasMinhasBandeiras] As bandeiras de acesso são valores diversos para acesso aos
   * escopos do aplicativo. Por exemplo, o modelo 'Exame' poderá possuir bandeiras dinamicas que poderão ser de 
   * leitura, criação etc.
   *
   * Listamos abaixo as chaves de acesso para este modulo:
   * - [ACESSO_CRIAR]     Chave de acesso necessária para criar um registro.
   * - [ACESSO_LISTAR]    Chave de acesso necessária para listar registros (Geralmente o acesso a listagem é livre).
   * - [ACESSO_LER]       Chave de acesso necessária para ler algum registro (Geralmente o acesso a leitura é livre).
   * - [ACESSO_ATUALIZAR] Chave de acesso necessária para atualizar algum registro.
   * - [ACESSO_DELETAR]   Chave de acesso necessária para deletar algum registro.
   * - [ACESSO_LIVRE]     Chave de acesso livre, assim o controlador irá aceitar qualquer requisição.
   * - [ACESSO_TOTAL]     Chave de acesso do usuário raiz, com esta chave é possível acessar todas as rotas.
   */
  Exames.prototype.listaDasMinhasBandeiras = [
    {'modulo': 'exames', 'modelo': 'Exame', 'acao': 'Criar', 'acesso': 'ACESSO_CRIAR', 'valor': 0x00000001 }                   
  , {'modulo': 'exames', 'modelo': 'Exame', 'acao': 'Listar', 'acesso': 'ACESSO_LISTAR', 'valor': (0x00000002 | 0x00000020) }  
  , {'modulo': 'exames', 'modelo': 'Exame', 'acao': 'Ler', 'acesso': 'ACESSO_LER', 'valor': (0x00000004 | 0x00000020) }        
  , {'modulo': 'exames', 'modelo': 'Exame', 'acao': 'Atualizar', 'acesso': 'ACESSO_ATUALIZAR', 'valor': 0x00000008 }           
  , {'modulo': 'exames', 'modelo': 'Exame', 'acao': 'Deletar', 'acesso': 'ACESSO_DELETAR', 'valor': 0x00000010 }               
  , {'modulo': 'exames', 'modelo': 'Exame', 'acao': 'Livre', 'acesso': 'ACESSO_LIVRE', 'valor': 0x00000020 }                   
  , {'modulo': 'exames', 'modelo': 'Exame', 'acao': 'Total', 'acesso': 'ACESSO_TOTAL', 'valor': 0x00000040 }                   
  ];
  
  /* @Propriedade {Pilha} [subModulosEstaticos]. Para cada um dos nóssos sub-módulos estáticos,
   * nós iremos necessitar de informar:
   *
   * - {Texto}  [modulo]        Servirá para identificarmos este módulo.
   * - {Texto}  [modelo]        O modelo deste módulo.
   * - {Texto}  [identificador] Serve para identificar o elemento DOM que conterá esta visão. 
   * - {Texto}  [subModulo]     Nome da rota para este sub-modulo.
   * - {Modulo} [valor]         Modulo de visão dos sub-modulos.
   * - {Evento} [evts]          O serviço de eventos local.
   * - {Pilha}  [acoes]         As ações requisitadas para o sub-modulo.
   * - {Pilha}  [livre]         As ações que são livres para acesso.
   */
  Exames.prototype.subModulosEstaticos = [
    {'modulo': 'exames', 'modelo': 'Exame', 'identificador': null, 'subModulo': 'examesCriar', 'valor': ModuloVisaoExamesCriar, 'evts': eventos, 'nome': 'moduloVisaoExamesCriar', 'acoes': ['Criar', 'Total'], 'livre': ['Livre'] }
  , {'modulo': 'exames', 'modelo': 'Exame', 'identificador': null, 'subModulo': 'examesLer', 'valor': ModuloVisaoExamesLer, 'evts': eventos, 'nome': 'moduloVisaoExamesLer', 'acoes': ['Ler', 'Total'], 'livre': ['Livre'] }
  , {'modulo': 'exames', 'modelo': 'Exame', 'identificador': null, 'subModulo': 'examesListar', 'valor': ModuloVisaoExamesListar, 'evts': eventos, 'nome': 'moduloVisaoExamesListar', 'acoes': ['Listar', 'Total'], 'livre': ['Livre'] }
  ];
   
  Exames.prototype.descarregar = function() {
    // this.escopos.remBandeiraParaUmModulo('exames');
  };
  
  return Exames;

});