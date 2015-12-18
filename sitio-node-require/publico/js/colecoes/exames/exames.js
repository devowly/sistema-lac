'use strict'

/* @arquivo exames.js */

/* Versão 0.0.1-Beta
 * - Pegar o valor de state.totalRecords diretamente do servidor REST. [FEITO]
 */
 
 define([
  'jquery',
  'backbone',
  'backbone.paginator',
  'underscore',
  'modelos/exame/exame'
], function($, Backbone, BackbonePaginator, _, ModeloExame){
   
  /* O Backbone.PageableCollection é 100% compativel com o BackBone.Collection. Por causa disso, 
   * todos os métodos básicos irão funcionar. Além disso, novos métodos serão adicionados.
   * @Veja https://github.com/backbone-paginator/backbone.paginator
   *
   * Uma coleção tem como objetivo contem um conjunto de modelos. Estes modelos compartilham
   * mesma propriedades. Além disso, a coleção possui vários métodos para gerencia destes modelos.
   * Alguns dos metodos básicos de uma coleção do BackBone são:
   *
   * add      (Adiciona novo modelo à coleção)
   * remove   (Remove o modelo da coleção)
   * fetch    (União dos dados já obtidos dos modelos desta coleção com os novos do banco de dados) 
   * sync     (Faz persistir o estado de uma coleção com o servidor. Pode ser substituido por uma customização)
   * toJSON   (Retorna uma pilha contendo os atributos de cada modelo no estilo hash) 
   * reset    (Adiciona e remove os modelos um de cada vez, isso faz com que uma coleção nova de modelos seja atribuida à coleção)
   * set      (Este método realiza uma atualização da coleção com a lista de modelos informada)
   * get      (Requesita um modelo desta coleção, especificado por um id ou cid ou passando um modelo) 
   *
   * @veja http://backbonejs.org/#Collection
   *
   * Os métodos básicos do Backbone.PageableCollection são:
   * getFirstPage    (Pega os registros da primeira página)
   * getPreviousPage (Pega a página anterior a atual)
   * getNextPage     (Pega próxima página a atual)
   * getLastPage     (Pega registros da última página)
   * getPage         (Pega uma página em especifico)
   *
   * Lembre-se que todos os métodos get*Page, quando no modo servidor,  delegam para o fetch.
   * Por causa disso, você pode anexar o callback para o objeto jqXHR retornado, utilizando método done.
   * Por exemplo:
   *
   * books.getPage(2).done(function () {
   *   // fazer algo...
   * });
   *
   * Com relação aos métodos get*Page, tenha em mente que é possível a realização de filtro com o parametro de pesquisa.
   * Assim, fica possível a utilização do método get*Page da seguinte forma:
   * 
   * var parametroPesquisa = 'q';
   * var dados[parametroPesquisa] = 'o texto a pesquisar';
   * colecao.getFirstPage({data: dados, reset: true, fetch: true});
   */
  var Exames = Backbone.PageableCollection.extend({

    model: ModeloExame,
    
    /* A url não é nada mais que uma rota que temos no serviço REST Epilogue. Neste endereço, iremos
     * realizar a listagem dos registros do banco.
     */
    url: "/exames",
   
   /* Existem três tipos de modos no Paginator, listo cada um deles abaixo:
    *
    * 1) O modo cliente é utilizado quando o número de registros a serem baixados é pequeno.
    *    Podendo assim, baixar todos os registros no lado cliente de uma só vez. Neste modo, 
    *    também possui o suporte bi-direcional.
    *
    * 2) O modo servidor se diferencia do modo cliente, porque ele baixa apenas uma parte de registros por vez.
    *    Este modo é adequado quando nós temos uma grande quantidade de registros e necessitamos pagina-los.
    *    Neste modo também é possível modificarmos o valor do totalRecords a cada pesquisa.
    *
    * 3) O Modo infinito, é um hibrido do modo cliente e modo servidor.
    *    Quando navegado para trás utilizara os dados da mesma forma que o modo cliente,
    *    Quando navegado para frente irá realizar paginação dos dados da mesma forma que no modo servidor.
    *    Vale lembrar, que no modo infinito, não é possível mudarmos o valor do totalRecords.
    */
    mode: 'server',

    /* Aqui nós configuramos os estados iniciais da nossa paginação. Apesar dos estados puderem ser acessados, 
     * após a inicialização os estados se tornam somente leitura. Existem diversos métodos para modificar o valor 
     * de um estado, é recomendado utilizar estes métodos ao invez de tentar acesso direto. Abaixo a lista de métodos:
     *
     * 1) setPageSize: Faz mudar o número de registros por página.
     * 2) setSorting: Realiza o sorteio.
     * 3) switchMode: Faz a troca entre modos, valor possiveis são: infinite, server ou client.
     * 4) state: Quando se quer acessar o estado interno.
     * 5) get*Page: Utilizado quando se quer ir para outra página.
     * 6) hasPreviousPage e hasNextPage: Verifica se a paginação para trás ou para frente é possível.
     */
    state: {
      // Informe aqui no pageSize, o número total de registros que serão apresentados a cada paginação.
      pageSize: 7,
      
      // Informe aqui o tipo de ordenamento inicial dos registros. 
      // Podendo ser -1 para ordem ascendente ou 1 para descendente.
      order: -1,
      
      // Informe aqui a base da página de inicio. Você pode ser informar o indice 0 ou indice 1.
      firstPage: 0,
      
      // Aqui você pode informar o valor de onde iremos começar a paginação. No nosso caso, iremos
      // informar o valor 0 (zero), porque queremos começar a listagem desde o primeiro registro.
      // Esse valor será o valor informado no parametro de pesquisa offset.
      currentPage: 0,
      
      // Aqui você poderá informar o valor total de registros no banco de dados, ou o valor
      // total de registros para a pesquisa atual. No modo servidor e no modo cliente, este valor será
      // informado pelo proprio servidor REST Epilogue. O Epilogue informará atravez do header, passando o valor X-total.
      totalRecords: 23
    },
    
    /* Ajustamos aqui os valores dos parametros de requisição para adaptar e ficar compativel com o 
     * servidor REST utilizado neste projeto.
     * No nosso caso, estaremos utilizando os valores que o servidor REST Epilogue trabalha.
     * Se você quiser remover algum parametro de requisição, apenas informe o valor nulo para ele.
     */
    queryParams: {
      
      // Utilizaremos o &count=valor para o tamanho de registros retornados para cada página
      pageSize: 'count',
      
      /* O valor de  totalPages e totalRecords, vai depender do modo que você escolher. Por exemplo:
       * 1) Em modo infinito não é importante informar o número total de páginas e ou valor do total de registros.
       * 2) Em modo servidor e ou no modo cliente, estas duas variaveis serão atualizadas a cada nova requisição no servidor REST.
       */
      totalPages: null,
      totalRecords: null,
      
      // A chave utilizada para sorteio será o sort.
      sortKey: 'sort',
      
      // O currentPage armazenará o valor inicial da nossa página. 
      currentPage: 'offset',
      
      // O valor de requisição utilizado para o ordenamento.
      order: 'order',
      
      /* As direções que utilizaremos para o ordenamento. Podendo ser:
       * 1) Ascendente: Faz o sorteio do menor para o maior.
       * 2) Descendente: Faz o sorteio do maior para o menor.
       *
       * Lembre-se que os valores devem mesmo serem em maiusculas.
       */
      directions: { 
        "-1": "ASC", 
        "1": "DESC" 
      },
      
      // Importante para utilizarmos na paginação. Faz o calculo da página em que estamos.
      offset: function () { 
        return this.state.currentPage * this.state.pageSize; 
      }
    },
    
    /* Os métodos de análise disponíveis são:
     * 1) parse
     * 2) parseRecords
     * 3) parseState
     * 4) parseLinks
     */
     
    // A cada nova requisição, nós iremos pegar o valor total de registros para esta requisição.
    parseState: function (resp, queryParams, state, options) {
      return { totalRecords: parseInt( options.xhr.getResponseHeader("X-total")) };
    }
    
  });
  
  return Exames;
});