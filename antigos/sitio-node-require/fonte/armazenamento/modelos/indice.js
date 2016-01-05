'use strict';

/* @arquivo indice.js
 *
 * Carrega arquivos de modelo desta pasta.
 */

var fs = require('fs'),
  path = require('path');

module.exports = function (sequelize, bd)  {
  bd = bd ||  {};
  var modelos = [];

  // carrega pasta atual
  fs
    .readdirSync(__dirname)
    // carrega tudo menos indice.js
    .filter(function (arquivo) {
      return ((arquivo.indexOf('.') !== 0) && (arquivo !== 'indice.js') && (arquivo.slice(-3) === '.js'));
    })
    // importa modelo
    .forEach(function (arquivo) {
      var modelo = sequelize.import(path.join(__dirname, arquivo));

	    // Adiciona modelo para um objeto
      bd[modelo.name] = modelo;
      modelos.push(modelo);
    });

  // No momento em que o modelo é definido, vamos carregar as associações
  modelos.forEach(function (modelo) {
    
    if (modelo.options.hasOwnProperty('associate')) {
      modelo.options.associate(bd);
    }
  });

  return bd;
};