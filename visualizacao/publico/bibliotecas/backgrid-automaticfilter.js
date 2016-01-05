'use strict';

define([
  'jquery',
  'backbone',
  'underscore',
  'backgrid',
  'backgrid-filter'
], function($, Backbone, _, Backgrid, BackgridFilter) {
  
  /* Tem tudo que o filtro do lado servidor possui, só que faz o filtro funcionar com qualquer entrada digitada, 
   * realizando o filtro automaticamente. Além disso, acrescenta as classes do bootstrap.
   */
  var ServerSideAutomaticFilter = Backgrid.Extension.ServerSideAutomaticFilter = Backgrid.Extension.ServerSideFilter.extend({
    
    // Acrescentamos aqui as classes do bootstrap
    className: "backgrid-filter form-search input-group",
   
    // Extendemos aqui os eventos do filtro. Queremos fazer o filtro automatico sempre
    // que o usuário digitar no campo de pesquisa.
    events: _.extend({}, Backgrid.Extension.ServerSideFilter.prototype.events, {
      "keydown input[type=search]": "automaticSearch"
    }),
    
    /* O tempo de espera em milisegundos desde a ultima mudança no campo de pesquisa.
     * Este valor poderá ser ajustado dependendo da frequencia com que o campo de pesquisa é utilizado
     * e o tamanho da quantidade de registros no indice de pesquisa.  
     *
     * Para tornar a pesquisa mais rápida e com menos consumo de dados, é recomendado utilizar em conjunto com 
     * o BackBone.Paginator em modo servidor, utilizando também um limite de resultados retornados.     
     *
     * O padrão será de 245 milisegundos.     
     */
    wait: 245,
    
    template: function (data) {
      var html = '';

      // Nossa caixa de entrada.
      html += '<input type="search" ' + (data.placeholder ? 'placeholder="' + data.placeholder + '"' : '') + ' name="' + data.name + '" ' + (data.value ? 'value="' + data.value + '"' : '') + ' class="form-control" />';
      
      // Nosso botão de pesquisa.
      html += '<span class="input-group-btn"> <button id="btao-pesquisar" class="btn btn-default" type="button">'+ data.buttonText  +'</button></span>';  
      
      return html;
    },
    
    // Quando iniciamos, nós vamos pegar as opções passadas.
    initialize: function (options) {
      ServerSideAutomaticFilter.__super__.initialize.apply(this, arguments);
      this.name = options.name || this.name;
      this.value = options.value || this.value;
      this.placeholder = options.placeholder || this.placeholder;
      this.template = options.template || this.template;
      this.buttonText = options.buttonText || this.buttonText;
      this.wait = options.wait || this.wait;
      
      // Mantem os dados da pesquisa ao realizar a paginação.
      // Ele faz isso apenas no modo servidor.
      var collection = this.collection, self = this;
      if (Backbone.PageableCollection && collection instanceof Backbone.PageableCollection && collection.mode == "server") {
        
        collection.queryParams[this.name] = function () {
          return self.searchBox().val() || null;
        };
      }
      
      this._debounceMethods(['automaticSearch']);
    },
    
    // Quando o usuário digitar no campo de pesquisa este evento será chamado automaticamente.
    automaticSearch: function (e) {
      if (e) e.preventDefault();
      
      var data = {};
      var query = this.query();
      if (query) data[this.name] = query;
 
      var collection = this.collection;

      // Se utilizar o PageableCollection, vamos retornar para primeira página com filtro.
      if (Backbone.PageableCollection && collection instanceof Backbone.PageableCollection) {
        collection.getFirstPage({data: data, reset: true, fetch: true});
      } else {
        collection.fetch({data: data, reset: true});
      }
     
    },
    
    _debounceMethods: function (methodNames) {
      if (_.isString(methodNames)) methodNames = [methodNames];

      this.undelegateEvents();

      for (var i = 0, l = methodNames.length; i < l; i++) {
        var methodName = methodNames[i];
        var method = this[methodName];
        this[methodName] = _.debounce(method, this.wait);
      }

      this.delegateEvents();
    }
    
  });
  
});