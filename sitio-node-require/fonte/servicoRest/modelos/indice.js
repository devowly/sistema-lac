'use strict';

/* @arquivo indice.js
 *
 * Realiza a leitura dos arquivos com extenção .js desta pasta, 
 * para depois, carregar as rotas REST para cada um deles.
 */

var fs = require('fs');
var pasta = require('path');

module.exports = function ()  {
  var modelos = [];

  // carrega pasta atual
  fs
    .readdirSync(__dirname)
    .filter(function (arquivo) {
      // carrega aqueles arquivos com extenção .js e filtra o arquivo indice.js
      return ((arquivo.indexOf('.') !== 0) && (arquivo !== 'indice.js') && (arquivo.slice(-3) === '.js'));
    })
    // carregamos os modelos
    .forEach(function (arquivo) {
      
      // removemos a extensão deste arquivo
      arquivo = arquivo.substr(0, arquivo.lastIndexOf('.'));
      
      // Carregamos o modelo.
      var modelo = require(pasta.join(__dirname, arquivo));
      
      // Adiciona modelo para o array
      modelos.push(modelo);
    });

  return modelos;
};