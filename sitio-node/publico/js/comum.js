// A construção do sitio vai ser organizado em dependencia comuns dentro deste arquivo.
// Para aquelas dependencias de terceiros, tipo o jQuery, vão ficar no diretorio ../publico/bibliotecas

// Configura o carregamento de modulos do diretorio de bibliotecas
// Com excessão 
//except for 'app' ones, which are in a sibling
//directory.

requirejs.config({
  
  baseUrl: 'bibliotecas',               // Base onde iremos carregar as bibliotecas
  paths: {
    app: '../app'
  },
  shim: {
    backbone: {
      deps: ['jquery', 'underscore'],
      exports: 'Backbone'
    },
    underscore: {
      exports: '_'
    }
  }
});