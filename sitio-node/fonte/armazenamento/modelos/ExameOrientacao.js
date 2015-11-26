'use strict';

/* @arquivo ExameOrientacao.js */

/* Versão 0.0.1-beta
 * - Fazer associação funcionar. [FEITO]
 */

module.exports = function (database, DataTypes) {
  
  var VERSAO_BANCO_DADOS = 1;
  
  var ExameOrientacao = database.define('ExameOrientacao', {
    pagina_html: {
      type: DataTypes.STRING, // Página html desta orientação para exame. Exemplo: orientacao0001.html
      validate: {} 
    },
    nome_elemento: {
      type: DataTypes.STRING, // Nome do elemento html utilizado para esta orientação. Exemplo: orientacao0001
      validate: {} 
    }
  }, 
   {
    associate: function (modelos) {

    },
    instanceMethods: {
    
    },
    underscored: true, // Lembre-se que utilizamos o padrão snake_case
    timestamps: false
  });

  return ExameOrientacao;
};