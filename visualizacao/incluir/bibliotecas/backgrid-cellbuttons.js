'use strict'
  
define([
  'jquery',
  'backbone',
  'underscore',
  'backgrid'
], function($, Backbone, _,  Backgrid){
  
  /* Irá apresentar um botão com o conteúdo, esse botão abrirá uma janela modal do bootstrap.
   * Esta classe extendeo backgrid oferencendo um tipo de célula que imprimirá um botão.
   */
  var ButtonModalCell = Backgrid.Extension.ButtonModalCell = Backgrid.Cell.extend({

    className: 'buttonModal-cell',

    // O texto do botão que será gerado.
    textContent: 'undefined',
    
    // O atributo da mira para uma janela modal.
    target: '',
    
    // Para nossa segurança, nós iremos fazer a formatação do conteúdo do botão.
    // Transformando qualquer valor passado em texto.
    formatter: Backgrid.StringFormatter,
    
    initialize: function (options) {
      ButtonModalCell.__super__.initialize.apply(this, arguments);
      this.textContent = options.textContent || this.textContent;
      this.target = options.target || this.target;
    },

    events: {
      'click': '_aoClicar'  
    },
    
    _aoClicar: function() {
      
    },
    
    render: function () {
      this.$el.empty();
      
      // O valor bruto não é nada mais que o valor que está sem formatação.
      var valorBruto = this.model.get(this.column.get('name'));
      
      // Passamos o valor para o formatador que formatará como texto.
      // Isso é importante para a segurança.
      var formattedValue = this.formatter.fromRaw(valorBruto, this.model);
      
      // A nossa mira no modal que será aberto.
      // Para se único nós adicionamos um nome para a janela e acrescentamos o 
      // identificador referente ao registro que será utilizado neste modal.
      this.target = '#modal' + this.column.get('idwindow') + this.model.get('id');
      
      // Criamos o aqui o botão que abrirá um modal.
      var myButton = $('<button>', {
        'type': 'button',
        'class': 'btn btn-success btn-sm',  // Adicionamos algumas classes do bootstrap.
        'aria-label': 'Right Align',        // O alinhamento deste botão.
        'data-toggle': 'modal',               
        'data-target': this.target          // O valor de mira que será utilizado para mostrar a nossa janela modal.
      }).text(formattedValue);
      
      this.$el.append(myButton);            // Acrescentamos o botão.
      this.delegateEvents();
      return this;
    }

  });

  /* Apresenta um botão com o conteúdo, ele vai abrir um link passando um valor de identificação.
   */
  var ButtonCell = Backgrid.Extension.ButtonCell = Backgrid.Cell.extend({

    className: 'button-cell',

    // O texto do botão que será gerado.
    textContent: 'undefined',
    
    // Para nossa segurança, nós iremos fazer a formatação do conteúdo do botão.
    // Transformando qualquer valor passado em texto.
    formatter: Backgrid.StringFormatter,
    
    initialize: function (options) {
      ButtonCell.__super__.initialize.apply(this, arguments);
      this.textContent = options.textContent || this.textContent;
    },

    render: function () {
      this.$el.empty();
      
      // O valor bruto não é nada mais que o valor que está sem formatação.
      var valorBruto = this.model.get(this.column.get('name'));
      
      // Passamos o valor para o formatador que formatará como texto.
      // Isso é importante para a segurança.
      var formattedValue = this.formatter.fromRaw(valorBruto, this.model);
      
      // Criamos aqui o link que mira em uma rota qualquer que será passada um id 
      // Este id poderá ser utilizado em uma visão.
      this.target = '#' + this.column.get('route') + '/' + this.model.get('id');
      
      //Criamos o nosso botão 
      var myButton = $('<a>', {
        'class': 'btn btn-success btn-sm',  // Algumas classes do bootstrap.
        'role': 'button',
        'href': this.target                 // O endereço que será acessado ao clicar neste botão.
      }).text(formattedValue);
      
      this.$el.append(myButton);
      this.delegateEvents();
      return this;
    }
  });
  
});