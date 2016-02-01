'use strict'

/* @arquivo unidades.js */

/* Versão 0.0.1-Beta
 */

define([
  'jquery'
, 'backbone'
, 'underscore'
, 'bootstrap'
, 'controladores/eventos/eventos'
, 'text!/admin/js/templantes/painel/modulos/unidades/Visao.Unidades.html'
, 'visoes/painel/modulos/unidades/unidadesCriar'
, 'visoes/painel/modulos/unidades/unidadesLer'
, 'visoes/painel/modulos/unidades/unidadesListar'
], function($, Backbone, _, Bootstrap, ControladorEventos, TemplanteModuloUnidades, ModuloVisaoUnidadesCriar, ModuloVisaoUnidadesLer, ModuloVisaoUnidadesListar) {
  
  /* @Variavel {Texto} [MODULO] Nome deste módulo. */
  var MODULO = 'Unidades';
  
  /* Aqui acrescentamos os eventos locais para este módulo. Assim ficará fácil para manipular os eventos que são 
   * locais a este escopo.
   * @Variavel {Evento} [eventos] Armazena os eventos. */
  var eventos = null;
  
  /* @Variavel {Controlador} [ctrldrEventos].
   * Responsavel por lidar com os diversos eventos dos módulos e dos sub-módulos. */
  var ctrldrEventos = null;
  
  /* @Modulo Unidades().
   *
   * Este é o nosso módulo responsável pela gerencia da nossa visão principal das unidades. 
   *
   * @Propriedade {Utilitario} [Escopos] Contêm métodos para lidarmos com os escopos e também as bandeiras dos diversos módulos. 
   * @Propriedade {Controlador} [ctrldrRotas] Responsavel por lidar com as diversas rotas dos módulos e dos sub-módulos.
   -------------------------------------------------------------------------------------------------------------------------------*/
  var Unidades = function(Escopos, ctrldrRotas) {
    
    // Iniciamos aqui os nossos eventos. Lembre-se que temos que adicionar os eventos deste 
    // módulo bem antes de iniciar os seus sub-módulos.
    ctrldrEventos = new ControladorEventos();
    eventos = ctrldrEventos.adcNovoCanalDeEventos(MODULO);
       
    /* @Propriedade {Utilitario} [escopos].
     * Contêm métodos para lidarmos com os escopos e também as bandeiras dos diversos módulos. */
    this.escopos = Escopos;
    this.escopos.carregarAsBandeirasDoModulo(this.listaDasMinhasBandeiras);
    
    /* @Propriedade {Controlador} [ctrldrRotas].
     * Responsavel por lidar com as diversas rotas dos módulos e dos sub-módulos. */
    this.ctrldrRotas = ctrldrRotas;
    this.ctrldrRotas.carregarAsRotasParaSubModulo(this.listaDosMeusSubModulosEstaticos);
    
    ctrldrEventos.dispararEventoEmUmCanal(MODULO, 'Okay', {'OK': 'LOLz'});
    ctrldrEventos.dispararEventoEmUmCanal(MODULO, 'Okay', {'OK': 'LOLz'});
    ctrldrEventos.dispararEventoEmUmCanal(MODULO, 'Okay', {'OK': 'LOLz'});
    
  };
  
  /* @Propriedade {Matriz} (Constante) [listaDasMinhasBandeiras].
   * As bandeiras de acesso são valores diversos para acesso aos escopos do aplicativo. Por exemplo, o modelo
   * 'Exame' poderá possuir bandeiras dinamicas que poderão ser de leitura, criação etc.
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
  Unidades.prototype.listaDasMinhasBandeiras = [
    {'modulo': 'unidades', 'modelo': 'Unidade', 'acao': 'Criar', 'acesso': 'ACESSO_CRIAR', 'valor': 0x00000001 }                   
  , {'modulo': 'unidades', 'modelo': 'Unidade', 'acao': 'Listar', 'acesso': 'ACESSO_LISTAR', 'valor': (0x00000002 | 0x00000020) }  
  , {'modulo': 'unidades', 'modelo': 'Unidade', 'acao': 'Ler', 'acesso': 'ACESSO_LER', 'valor': (0x00000004 | 0x00000020) }        
  , {'modulo': 'unidades', 'modelo': 'Unidade', 'acao': 'Atualizar', 'acesso': 'ACESSO_ATUALIZAR', 'valor': 0x00000008 }           
  , {'modulo': 'unidades', 'modelo': 'Unidade', 'acao': 'Deletar', 'acesso': 'ACESSO_DELETAR', 'valor': 0x00000010 }               
  , {'modulo': 'unidades', 'modelo': 'Unidade', 'acao': 'Livre', 'acesso': 'ACESSO_LIVRE', 'valor': 0x00000020 }                   
  , {'modulo': 'unidades', 'modelo': 'Unidade', 'acao': 'Total', 'acesso': 'ACESSO_TOTAL', 'valor': 0x00000040 }                   
  ];
  
  /* @Propriedade {Matriz} (Constante) [listaDosMeusSubModulosEstaticos]. 
   * Para cada um dos nóssos sub-módulos estáticos nós iremos necessitar de informar:
   *
   * - {Texto} [modulo]         Servirá para identificarmos este módulo.
   * - {Texto} [modelo]         O modelo deste módulo.
   * - {Texto} [identificador]  Serve para identificar o elemento DOM que conterá esta visão. 
   * - {Texto} [nome]           Nome da rota para este sub-modulo.
   * - {Modulo} [valor]         Modulo de visão dos sub-modulos.
   * - {Matriz} [acoes]         As ações requisitadas para o sub-modulo.
   * - {Matriz} [livre]         As ações que são livres para acesso.
   */
  Unidades.prototype.listaDosMeusSubModulosEstaticos = [
    {'modulo': 'unidades', 'modelo': 'Unidade', 'identificador': null, 'nome': 'unidadesCriar', 'valor': ModuloVisaoUnidadesCriar, 'acoes': ['Criar', 'Total'], 'livre': ['Livre'] }
  , {'modulo': 'unidades', 'modelo': 'Unidade', 'identificador': null, 'nome': 'unidadesLer', 'valor': ModuloVisaoUnidadesLer, 'acoes': ['Ler', 'Total'], 'livre': ['Livre'] }
  , {'modulo': 'unidades', 'modelo': 'Unidade', 'identificador': null, 'nome': 'unidadesListar', 'valor': ModuloVisaoUnidadesListar, 'acoes': ['Listar', 'Total'], 'livre': ['Livre'] }
  ];
   
  Unidades.prototype.descarregar = function() {
    // this.escopos.remBandeiraParaUmModulo('unidades');
  };
  
  return Unidades;

});