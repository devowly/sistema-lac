'use strict'

/* @arquivo convenios.js */

/* Versão 0.0.1-Beta 
 * - Remover o código das novas células do núcleo do Backgrid e adiciona-las em plugins separados. (issue #15) (9132a0ba4177833c2098f66f38817e6aae277a6a) [FEITO]
 */

define([
  'jquery',
  'backbone',
  'underscore',
  'utilitarios',
  'bootstrap',
  'backgrid',
  'backgrid-filter',
  'backgrid-paginator',
  'backgrid-cellbuttons',
  'backgrid-automaticfilter',
  'text!/js/templantes/paginas/convenios/Visao.Convenios.html'
], function($, Backbone, _, Utilitarios, Bootstrap, Backgrid, BackgridFilter, BackgridPaginator, BackgridCellButtons, BackgridAutomaticFilter, Templante){
  
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
        sortable: true,                     // Iremos aceitar o sorteio pelo identificador.
        cell: Backgrid.IntegerCell.extend({ // Definição de tipo da celula de ID
          orderSeparator: ''
        })
      }, 
      {
        name: "descricao",                  // O atributo de chave do modelo
        label: "Convênio",                  // Nome para mostrar na coluna
        editable: false,                    // por padrão, cada celula em uma coluna é editavel. Mas não queremos neste caso.
        sortable: false,                    // Não é necessário sortear esta coluna
        cell: "string"                      // Tipo da celula, string.
      }, 
      {
        name: "nome_elemento",               // O atributo de chave do modelo
        label: "Visualizar",                 // Nome para mostrar na coluna
        editable: false,                     // por padrão, cada celula em uma coluna é editavel. Mas não queremos neste caso.
        sortable: false,                     // Não é necessário sortear esta coluna
        route: 'infoConvenio',               // O nome da janela modal que queremos abrir.
        cell: "button"                       // O tipo da celula é botão 
      }
    ],
    
    initialize: function () {
      this.render();
      
      // nossa coleção
      var colecao = this.model;
      
      var esteObj = this;
      
      // Disparado Quando é adicionado modelo a nossa coleçao
      this.listenTo(colecao, "add", function () {
       
        esteObj._carregarColecoesAninhadas( colecao, function() { }); 
      });
      
      // Ocorreu reset na coleçao
      this.listenTo(colecao, "reset",function () {
        
        esteObj._carregarColecoesAninhadas( colecao, function() { }); 
      });
      
    },
    
    /* Realiza o carregamento das coleções aninhadas porque o Paginator não o faz.
     *
     * @Parametro {Objeto} [colecao] A coleção dos convênios.
     * @Parametro {Função} [cd] Será chamada logo após estiverem carregados as coleções aninhadas.
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
      
      /* Iniciados uma nova instancia da nossa tabela. Listamos abaixo alguns parametros suportados:
       *
       * 1) className: A classe utilizada
       * 2) columns: Uma pilha contendo os objetos das colunas.
       * 3) collection: A coleção que iremos utilizar na tabela.
       *
       * @veja http://backgridjs.com/
       */
      this.tabela = new Backgrid.Grid({
        className: 'backgrid table table-hover table-bordered',  // Adicionamos nossas classes, estou utilizando o CSS do BootStrap.
        columns: this.colunas,                                   // Nossas colunas
        collection: this.model,                                  // Utilizamos uma coleção do BackBone.Paginator().
        header: Backgrid.Header.extend({ }),                     // Nossas colunas.
        footer: ''                                               // Rodapé da tabela.
      });  
      
      // Acrescenta a nossa tabela e insere ela na div da tabela.
      $("div#tabela-convenios", this.el).append(this.tabela.render().el);

      /* Aqui nós iremos realizar a paginação. Listamos abaixo os parametros suportados:
       *
       * 1) collection: A coleção que a paginação irá utilizar. Nós usamos o Backbone.PageableCollection.
       * 2) goBackFirstOnSort: Retorna para a primeira página ao ocorrer sorteio.
       * 3) windowSize: quantos botões de indice irão ser apresentados.
       *
       * Outros parametros suportados são:       
       * 1) renderIndexedPageHandles: false  (Quando nós não queremos os botões de indice)
       * 2) controls: { rewind: null, fastForward: null }  (Remove o controle de primeiro e ultimo botões)
       *
       * @veja http://backgridjs.com/ref/extensions/paginator.html
       */
      this.paginacao = new Backgrid.Extension.Paginator({
        collection: this.model,     // Nossa coleção    
        goBackFirstOnSort: true,    // Quando sortear deve voltar para primeira página.
        windowSize: 10              // Valor da quantidade de botões de indice para esta paginação
      });
      
      // Acrescentamos a paginação ao DOM a paginação
      $("div#convenio-paginacao", this.el).append(this.paginacao.render().el);
      
      /* O nosso filtro do lado servidor delegando a pesquisa para o servidor quando enviar os parametros da pesquisa.
       * Utilizaremos os parametros de requisição que são suportados pelo nosso servidor REST Epilogue.
       * Alguns dos parametros suportados são:
       * 1) collection: A coleção que iremos utilizar no filtro.
       * 2) name: O nome utilizado para a requisição.
       * 3) wait: O valor em milisegundos que irá esperar da ultima vez que houve o clique e o inicio para a pesquisa.
       *
       * @veja http://backgridjs.com/ref/extensions/filter.html
       */
      this.filtroAutomaticoLadoServidor = new Backgrid.Extension.ServerSideAutomaticFilter({
        collection: this.model,              // Nossa coleção
        name: "q",                           // O nome do parametro de pesquisa no servidor REST
        placeholder: "Filtrar convênios...", // Nome para adicionar no input de escrita
        buttonText: "Filtrar",               // Valor do texto para o botão de pesquisa.
        wait: 245                            // Quantidade de milisegundos esperar até fazer nova pesquisa automatica.
      });
      
      // inserimos o filtro
      $("div#entrada-convenios-pesquisa", this.el).before(this.filtroAutomaticoLadoServidor.render().el);
      
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