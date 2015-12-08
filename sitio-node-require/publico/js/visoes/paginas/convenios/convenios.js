'use strict'

/* @arquivo convenios.js */

/* Versão 0.0.1-Beta */

define([
  'jquery',
  'backbone',
  'underscore',
  'utilitarios',
  'bootstrap',
  'backgrid',
  'backgrid-filter',
  'backgrid-paginator',
  'text!/js/templantes/paginas/convenios/Visao.Convenios.html'
], function($, Backbone, _, Utilitarios, Bootstrap, Backgrid, BackgridFilter, BackgridPaginator, Templante){
  
  /* Responsavel por lidar com a apresentação e controle da visão de convenios.
   */
  var Convenios = Backbone.View.extend({

    templante: _.template(Templante),
    
    attributes: {
      
    },
    
    // As colunas da nossa tabela
    colunas: [
      {
        name: "id",                         // O atributo de chave do modelo
        label: "#",                         // Nome para mostrar na coluna
        editable: false,                    // por padrão, cada celula em uma coluna é editavel, mas a celula chave não deve.
        sortable: false,                    // O Servidor REST Epilogue não é compativel com esta forma de organização.
        cell: Backgrid.IntegerCell.extend({ // Definição de tipo da celula de ID
          orderSeparator: ''
        })
      }, 
      {
        name: "nome",                       // O atributo de chave do modelo
        label: "Nome do convênio",          // Nome para mostrar na coluna
        editable: false,                    // por padrão, cada celula em uma coluna é editavel. Mas não queremos neste caso.
        sortable: false,                    // O Servidor REST Epilogue não é compativel com esta forma de organização.
        cell: "string"                      // Tipo da celula, string.
      }, 
      {
        name: "nome_elemento",               // O atributo de chave do modelo
        label: "Visualizar",                 // Nome para mostrar na coluna
        editable: false,                     // por padrão, cada celula em uma coluna é editavel. Mas não queremos neste caso.
        sortable: false,                     // O Servidor REST Epilogue não é compativel com esta forma de organização.
        idwindow: 'orientacao',              // O nome da janela modal que queremos abrir.
        cell: "buttonModal"                  // O tipo da celula é botão modal
      }
    ],
    
    initialize: function () {
      this.render();
      
      // nossa coleção
      var colecao = this.model;
      
      var esteObj = this;
      
      // Disparado Quando é adicionado modelo a nossa coleçao
      this.listenTo(colecao, "add", function () {
       
        esteObj._carregarColecoesAninhadas( colecao, function() {
          
        }); 
        
      });
      
      // Ocorreu reset na coleçao
      this.listenTo(colecao, "reset",function () {
        
        esteObj._carregarColecoesAninhadas( colecao, function() {
          
        }); 
      });
      
    },
    
     /* Realiza o carregamento das coleções aninhadas porque o Paginator não o faz.
     *
     * @Parametro {colecao} A coleção dos convênios.
     * @Parametro {cd} Função que será chamada logo após estiverem carregados as coleções aninhadas.
     */
    _carregarColecoesAninhadas: function(colecao, cd) {
      
      var convenios = colecao.models;  // Necessitamos dos modelos de convenios desta coleção
       
      // Percorremos todos os convenios.
      _.each(convenios, function(convenio) {
      
        var infoConvenios = convenio.infoConvenios;
       
        // Verificamos inicialmente se ele já possui modelos carregados.
        if (convenio.infoConvenios && convenio.infoConvenios.models && convenio.infoConvenios.models.length < 1) {
          
          // Carregamos aqui todas as nossas coleções aninhadas da colecao informada
          Utilitarios.carregarColecao([infoConvenios], function(){
            
            cd(this); 
          });
        } else {
          // Já foi carregado, chamando função
          cd(this); 
        }
        
      });
      
    },

    render: function () {
      // Renderiza este template
      this.$el.html(this.templante());
      
      // Iniciados uma nova instancia da nossa tabela.
      this.tabela = new Backgrid.Grid({
        className: 'backgrid table table-hover table-bordered',  // Adicionamos nossas classes, estou utilizando o CSS do BootStrap.
        columns: this.colunas,                                   // Nossas colunas
        collection: this.model,                                  // Utilizamos uma coleção do BackBone.Paginator().
        header: Backgrid.Header.extend({ }),                     // Nossas colunas.
        footer: ''                                               // Rodapé da tabela.
      });  
      
      // Renderiza a nossa tabela e insere ela na div da tabela.
      $("div#tabela-convenios", this.el).append(this.tabela.render().el);

      // Vamos realizar a paginação
      this.paginacao = new Backgrid.Extension.Paginator({
        collection: this.model,           // Nossa coleção    
        goBackFirstOnSort: true,          // Quando sortear deve voltar para primeira página.
        renderIndexedPageHandles: false,  // Não queremos o indice.
        controls: {                       // Remove o controle de primeiro e ultimo botões.
          rewind: null,
          fastForward: null
        }
      });
      
      // inserimos a paginação
      $("div#convenio-paginacao", this.el).append(this.paginacao.render().el);
      
      // Filtro do lado servidor delegando a pesquisa para o servidor quando enviar os parametros da pesquisa.
      this.filtroLadoServidor = new Backgrid.Extension.ServerSideFilter({
        collection: this.model,              // Nossa coleção
        name: "q",                           // O nome do parametro de pesquisa no servidor REST
        placeholder: "Filtrar convênios...", // Nome para adicionar no input de escrita
        buttonText: "Filtrar"                // Valor do texto para o botão de pesquisa.
      });
      
      // inserimos o filtro
      $("div#entrada-convenios-pesquisa", this.el).before(this.filtroLadoServidor.render().el);
      
      this._iniciarMeusComponentes();
      this._iniciarMinhaEscutaEventos();
      
      return this;
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
  return Convenios;
});