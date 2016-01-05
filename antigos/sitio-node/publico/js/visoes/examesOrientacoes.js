'use strict'

/* @arquivo examesOrientacoes.js */

/* Versão 0.0.2-Beta
 * - Adicionar carregamento preguiçoso dos modais. [FEITO]
 * - Corrigir quando realizar uma pesquisa, o seu valor continuar na paginação. Porque quando paginamos o filtro não funciona. [AFAZER]
 * - Adicionar listagem, paginação e filtro de pesquisas. (issues #7 e #8) [FEITO]
 *
 * Versão 0.0.1-Beta
 * - Para cada templante carregado dinamicamento vamos criar uma nova visão. (issue #13) (9a990371680504c44e29ee36e6f1c1c4f5fc2cc6) [FEITO]
 * - Remover conteúdo em HTML do código das visões. (issue #12) (9a990371680504c44e29ee36e6f1c1c4f5fc2cc6) [FEITO]
 */

/* @Visão ExamesOrientacoes
 *
 * @Descrição Responsável pela apresentação dos exames aceitos por este laboratorio.
 */
Visao.ExamesOrientacoes = Backbone.View.extend({

  // União dos dados carregados do banco de dados.
  exameOrientacaoUniaoDB: [],

  // Aqui armazenamos a lista do templante de modais que contem as orientações de cada exame.
  listaModais: [],
  
  // Nossa tabela utilizando BackGrid.
  tabela: null,
  
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
      label: "Nome do exame",             // Nome para mostrar na coluna
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
    
    // Fica necessário zerarmos estas duas variaveis para fazer com que
    // os botões modais sejam recarregados e funcionem em caso de mudança de visão.
    this.exameOrientacaoUniaoDB = [];
    this.listaModais = [];
    
    // Renderiza este template
    this.render();
    
     // nossa coleção
    var colecao = this.model;
    
    var esteObj = this;
    
    // Disparado Quando é adicionado modelo a nossa coleçao
    this.listenTo(colecao, "add", function () {
     
      esteObj._carregarColecoesAninhadas( colecao, function() {
        
        // Carregamos os templates dos modais para esse novo modelo adicionado.
        esteObj._carregarTemplantesModais(function(){
          // O que fazer?
        });
      }); 
      
    });
    
    // Disparado quando é removido algum modelo da coleçao
    this.listenTo(colecao, "remove", function () {
      
    });
    
    // Ocorreu reset na coleçao
    this.listenTo(colecao, "reset",function () {
      
      esteObj._carregarColecoesAninhadas( colecao, function() {
        
        // Carregamos os templates dos modais para este gatilho.
        esteObj._carregarTemplantesModais(function(){
          // O que fazer?
        });
      }); 
    });
    
    // Ocorreu refresh
    this.listenTo(colecao, "backgrid:refresh", function () {
      // <umdez> Já escuto pelo gatilho que dispara no reset. Então, o que fazer?
    });

  },
  
  /* @função _carregarColecoesAninhadas
   * @descrição Realiza o carregamento das coleções aninhadas porque o Paginator não o faz.
   */
  _carregarColecoesAninhadas: function(colecao, cd) {
    
    var exames = colecao.models;  // Necessitamos dos modelos de exames desta coleção
     
    // Percorremos todos os exames.
    _.each(exames, function(exame) {
    
      var exameOrientacoes = exame.exameOrientacoes;
     
      // Verificamos inicialmente se ele já possui modelos carregados.
      if (exame.exameOrientacoes && exame.exameOrientacoes.models && exame.exameOrientacoes.models.length < 1) {
        
        // Carregamos aqui todas as nossas coleções aninhadas da colecao informada
        Global.utilitarios.carregarColecao([exameOrientacoes], function(){
          
          cd(this); 
        });
      } else {
        // Já foi carregado, chamando função
        cd(this); 
      }
      
    });
    
  },
  
  /* @método _carregarTemplantesModais()
   * @descrição Realiza o carregamento dos templates e os acrescentão ao DOM.
   */
  _carregarTemplantesModais: function(cd) {
    
    var visoes = [];   // Cada modal possui uma visão que é o conteúdo em html.
    var esteObj = this;
    
    var exames = this.model.models;  // Necessitamos dos modelos de exames desta coleção
    var exameJson = null;
    
    var ind = 0;  // Indice dos exames
    
    // Percorremos todos os exames.
    _.each(exames, function(exame) {
      
      // Transforma em JSON para podermos manipular e acessar as propriedades do modelo.
      exameJson = exame.toJSON();
      
      // Para cada um dos exames temos orientação
      _.each(exame.exameOrientacoes.models, function(exameOrientacao) {
        
        // Armazenamos em json para podermos manipula-lo e ter acesso as suas propriedades.
        var exameOrientacaoJson = exameOrientacao.toJSON();
        
        // Removemos a extenção .html para depois carregar a página.
        var pagina = exameOrientacaoJson.pagina_html.slice(0, -5);

        // Contem a união dos dados necessarios para carregar os dados dos templantes.
        var exameOrientacaoUniaoLocal = {
          id: exameOrientacaoJson.id,
          nome: exameJson.nome,                          // Nome do exame. Exemplo: 1,25 DIHIDROXI VITAMINA D3.
          pagina_html: exameOrientacaoJson.pagina_html,       // Página html desta orientação para exame. Exemplo: orientacao0001.html
          nome_elemento: exameOrientacaoJson.nome_elemento,   // Nome do elemento html utilizado para esta orientação. Exemplo: orientacao0001
          minha_visao: exameOrientacaoJson.minha_visao,
          indice: ind                                    // Indice deste exame
        };
          
        ind++;
        
        // Verifica se o template deste modal já foi carregado. Se não foi carregado, nós armazenamos em visoes[] para ser carregado.
        if (typeof esteObj.listaModais[pagina] === 'undefined') {  
           
          // Vai armazenar o nome de cada uma das visões em visoes[ca].
          visoes.push(pagina);
           
          // Armazenamos os dados ao nivel global para serem utilizados por outros métodos
          esteObj.exameOrientacaoUniaoDB.push(exameOrientacaoUniaoLocal);
           
          // Armazenar para depois carregar cada visão modal.
          esteObj.listaModais[pagina] = new Visao.ExameOrientacaoModal({model: exameOrientacaoUniaoLocal});
           
          // Utilizado para sabermos se a visão já foi carregada. 
          esteObj.listaModais[pagina].seCarregadoVisao = true;
           
          // Nós precisaremos saber quando o XML desta visão já foi acrescentado.
          esteObj.listaModais[pagina].seXmlAcrescentado = false;
           
        }
      });
      
    });
    
    // Procura no diretorio pagsOrientacoesExames os templates dos modais e os carrega, salvando-os na listaModais.
    Global.utilitarios.carregarTemplantesExtras(this.listaModais, 'pagsOrientacoesExames/', visoes, function(){
      
      var exames = esteObj.model.models; // Os modelos de exames desta coleção
      
      // Percorremos todos os exames.
      _.each(exames, function(exame) {
        
        // Armazenamos em JSON para podermos manipulalo e ter acesso a suas propriedades.
        var exameJson = exame.toJSON();
        
         // Para cada um dos exames temos orientação
         _.each(exame.exameOrientacoes.models, function(exameOrientacao) {
          
           // Armazenamos em json para podermos manipula-lo e ter acesso as suas propriedades.
           var exameOrientacaoJson = exameOrientacao.toJSON();
           
           // Removemos a extenção .html
           var pagina = exameOrientacaoJson.pagina_html.slice(0, -5);
            
           // Verifica se o XML já foi acrescentado, caso negativo, acrescentamos o conteúdo XML a nossa página.
           if (!esteObj.listaModais[pagina].seXmlAcrescentado) {
              
              if (typeof esteObj.listaModais[pagina].template !== 'undefined') {
                // Acrescentamos o XML dos modais.
                $('div#orientacoesExmModais', esteObj.el).append(esteObj.listaModais[pagina].render().el); 
                 
                // Nós precisaremos saber quando o XML desta visão já foi acrescentado.
                esteObj.listaModais[pagina].seXmlAcrescentado = true;
              } else {
                
                //console.log('_carregarTemplantesModais(): Não conseguiu carregar ' + pagina + ' template não definido. Isso pode ter ocorrido pelo preenchimento incorreto da tabela do banco de dados');
              }
             
           } 
           
         });
      });
      
      cd(esteObj);
    });
  },
  
  render: function () {
    
    // Renderiza este template
    $(this.el).html(this.template());
    
    // Carregamos os modais para aqueles modelos da coleção que já foram carregados.
    this._carregarTemplantesModais(function() {
      
    });
    
    // Iniciados uma nova instancia da nossa tabela.
    this.tabela = new Backgrid.Grid({
      className: 'backgrid table table-hover table-bordered',  // Adicionamos nossas classes, estou utilizando o CSS do BootStrap.
      columns: this.colunas,                                   // Nossas colunas
      collection: this.model,                                  // Utilizamos uma coleção do BackBone.Paginator().
      header: Backgrid.Header.extend({ }),                     // Nossas colunas.
      footer: ''                                               // Rodapé da tabela.
    });  
    
    // Renderiza a nossa tabela e insere ela na div da tabela.
    $("div#tabelaExamesOrientacoes", this.el).append(this.tabela.render().el);

    // Vamos realizar a paginação
    this.paginacao = new Backgrid.Extension.Paginator({
      // Nossa coleção
      collection: this.model,           
      
      // Quando sortear deve voltar para primeira página.
      goBackFirstOnSort: true, 
      
      // Não queremos o indice.
      renderIndexedPageHandles: false,
      
      // Remove o controle de primeiro e ultimo botões.
      controls: {
        rewind: null,
        fastForward: null
      }
     
    });
    
    // inserimos a paginação
    $("div#exameOrientacaoPaginacao", this.el).append(this.paginacao.render().el);
    
    // Filtro do lado servidor delegando a pesquisa para o servidor quando enviar os parametros da pesquisa.
    this.filtroLadoServidor = new Backgrid.Extension.ServerSideFilter({
      collection: this.model,           // Nossa coleção
      name: "q",                        // O nome do parametro de pesquisa no servidor REST
      placeholder: "Filtrar exames...", // Nome para adicionar no input de escrita
      buttonText: "Filtrar"             // Valor do texto para o botão de pesquisa.
    });
    
    // inserimos o filtro
    $("div#entradaPesquisa", this.el).before(this.filtroLadoServidor.render().el);
    
    this._iniciarMeusComponentes();
    this._iniciarMinhaEscutaEventos();
  },

  /* @função _iniciarMeusComponentes()
   * @descrição Iniciamos componentes para esta visão. 
   *  Os componentes podem ser do bootstrap, jQuery e outros frameworks utilizados
   */ 
  _iniciarMeusComponentes: function(){
    
    
  },
  
  /* @função _iniciarMinhaEscutaEventos()
   * @descrição Iniciamos as escutas de eventos para esta visão. 
   *  Os eventos podem ser de elementos do bootstrap, jQuery e outros frameworks utilizados
   */ 
  _iniciarMinhaEscutaEventos: function() {
    
   
  }

});
 
/* @Visao ExameOrientacaoModal
 *
 * @Elemento:
 * <div class="modal fade" id="ModalExemplo1" tabindex="-1" role="dialog" aria-labelledby="ModalExemplo1Etiqueta"> </div>
 *
 * @Carrega:
 *  <div class="modal-dialog" role="document">
 *    <div class="modal-content">
 *      <div class="modal-header" style="border-color: #5cb85c; color: #5cb85c;">
 *        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
 *        <h4 class="modal-title" id="ModalExemplo1Etiqueta">Orientações para o exame</h4>
 *      </div>
 *      <div class="modal-body">
 *        <p>Material: Sangue. </p>
 *        <p>
 *          Preparo:
 *          <ul>
 *            <li> Jejum de 8 horas. </li>
 *            <li> Informar medicamentos em uso. </li>
 *          </ul>
 *        </p>
 *      </div>
 *      <div class="modal-footer" style="border-color: #5cb85c;">
 *        <button type="button" class="btn btn-success" data-dismiss="modal">Fechar</button>
 *      </div>
 *    </div>
 *  </div>
 *     
**/ 
Visao.ExameOrientacaoModal = Backbone.View.extend({
  tagName: 'div',
  
  attributes: {
    'class': 'modal fade',
    'role': 'dialog',
    'tabindex': '-1'
  },
  
  initialize: function () {
    
  },

  render: function () {
    var meuModelo = this.model;
  
    $(this.el).attr('id', meuModelo.nome_elemento + meuModelo.id);
    $(this.el).attr('aria-labelledby', meuModelo.nome_elemento + meuModelo.id);
  
    // Carregamos o templante
    $(this.el).html(this.template(meuModelo));
    
    return this;
  }

});