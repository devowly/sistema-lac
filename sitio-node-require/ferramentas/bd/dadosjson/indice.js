'use strict';

/* @arquivo indice.js
 */

var fs = require('fs'),
  pasta = require('path');  

/* Realiza a leitura dos arquivos com extenção .json desta pasta, 
 * para depois, carregar cada um deles e adicionar cada um dos registros
 * no nosso banco de dados.
 *
 * @Parametro {sequelize_fixtures} Faz carregamento dos arquivos .json que contem os registros
 *                                 que serão acrescentados ao banco de dados.
 * @Parametro {modelos} Contem a lista dos modelos do banco de dados.
 */
module.exports = function (sequelize_fixtures, modelos)  {
  
  // carrega pasta atual
  fs
  .readdirSync(__dirname)
  .filter(function (arquivo) {
    
    // carrega tudo que contenha extensão .json e filtrará o indice.js
    return ((arquivo.indexOf('.') !== 0) && (arquivo !== 'indice.js') && (arquivo.slice(-5) === '.json'));
  })
  .forEach(function (arquivo) {
    
    var arquivo = pasta.join(__dirname, arquivo);
    
    // Carregamos cada um dos arquivos .json que contem os registros.
    sequelize_fixtures.loadFile(arquivo, modelos).then(function(){
      console.log('Carregado arquivo '+ arquivo +' de dados.');
    });  

  });

};