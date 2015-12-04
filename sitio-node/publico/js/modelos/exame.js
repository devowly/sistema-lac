'use strict'

/* @arquivo exame.js */

/* Versão 0.0.1-Beta
 * - Pegar o valor de state.totalRecords diretamente do servidor REST. [AFAZER]
 */

/* Metodos básicos dos modelos são
 *
 * fetch   (União dos dados já obtidos com os novos do banco de dados)
 * save    (Salva o modelo)
 * destroy (Deleta o modelo)
 */
Modelo.Exame = Backbone.Model.extend({

  // O endereço REST onde iremos pegar os dados.
  urlRoot: "/exames",

  // Isso vai ser utilizado para quando formos pegar os dados 
  // das coleções aninhadas pertecentes a este modelo.
  colecoesAninhadas: [
    'exameOrientacoes'
  ],
  
  initialize: function () {
    
    // Cada um dos exames possue uma orientação a ser informada.
    this.exameOrientacoes = nestCollection(this, 'exameOrientacoes', new Colecao.ExameOrientacoes(this.get('exameOrientacoes')));
    this.exameOrientacoes.url = '/exames/' + this.id + '/ExameOrientacao';
  },
  
  // Aqui os atributos padrões deste modelo de exame.
  defaults: {
    id: null,   // Identificador
    nome: "",    //Nome do exame. Exemplo: 1,25 DIHIDROXI VITAMINA D3.
    nome_elemento: "Ver instruções do exame"
  }
});

/* Metodos básicos da coleção são
 *
 * add      (Adiciona novo modelo à coleção)
 * remove   (Remove o modelo da coleção)
 * fetch    (União dos dados já obtidos dos modelos desta coleção com os novos do banco de dados) 
 */
Colecao.Exames = Backbone.PageableCollection.extend({

  model: Modelo.Exame,
  
  // O endereço REST onde iremos pegar os dados. 
  url: "/exames",
  
  // Modo infinito, é um hibrido do modo cliente e modo servidor.
  // Quando navegado para trás utilizara os dados do tipo cliente,
  // Quando navegado para frente irá realizar paginação dos dados pelo servidor REST Epilogue.
  mode: 'infinite',

  // Estados iniciais da paginação
  state: {
    // Numero de registros apresentados a cada página.
    pageSize: 7,
    order: 1,
    
    // A primeira página tem indice 0
    // Você pode utilizar indice base 0 ou 1
    firstPage: 0,
    
    // Informe o valor da página inicial de onde iremos começar diferente do firstPage
    currentPage: 0,
    
    // número total de registros.
    // <umdez> Acho que poderiamos pegar essa informação do servidor REST. 
    totalRecords: 23
  },
  
  // Aqui ajustamos para ficar compativel com as chaves de chamada que nosso servidor REST suporta.
  // Informando valor null em algum parametro istá remover ele das requisições.
  queryParams: {
    // utilizaremos o &count=valor para o tamanho de registros retornados para cada página
    pageSize: 'count',
    
    // Em modo infinito não é importante informar o número total de páginas e ou valor do total de registros.
    totalPages: null,
    totalRecords: null,
    
    // Não utilizaremos o &sort=valor
    sortKey: null,
    
    // Registro de onde iremos começar
    currentPage: 'offset',
    
    // Importante para utilizarmos na nossa paginação.
    offset: function () { 
      return this.state.currentPage * this.state.pageSize; 
    }
  }
  
});