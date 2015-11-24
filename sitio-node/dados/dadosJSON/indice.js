'use strict';

/* @arquivo indice.js
 *
 * @descrição carrega arquivos de json desta pasta.
 */

var fs = require('fs'),
  pasta = require('path');

module.exports = function (sequelize_fixtures, modelos)  {
  
  // carrega pasta atual
  fs
  .readdirSync(__dirname)
  // carrega tudo que contenha extensão .json menos indice.js
  .filter(function (arquivo) {
    return ((arquivo.indexOf('.') !== 0) && (arquivo !== 'indice.js') && (arquivo.slice(-5) === '.json'));
  })
  .forEach(function (arquivo) {
    
    var arquivo = pasta.join(__dirname, arquivo);
    
    sequelize_fixtures.loadFile(arquivo, modelos).then(function(){
      console.log('Carregado arquivo '+ arquivo +' de dados.');
    });  

  });

};