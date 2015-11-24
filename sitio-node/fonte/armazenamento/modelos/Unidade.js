'use strict';

/* @arquivo Unidade.js */

/* Versão 0.0.1-beta
 * - Uso do padrão snake_case. [FEITO]
 * - Fazer associação funcionar. [FEITO]
 */

module.exports = function (database, DataTypes) {
  
  var VERSAO_BANCO_DADOS = 1;
  
  var Unidade = database.define('Unidade', {
    titulo: {
      type: DataTypes.STRING, // Titulo da unidade. Exemplo: Nossa unidade do centro de Montes Claros.
      validate: {} 
    },
    pagina_endereco: {        // Página que contem endereço em XML. Exemplo: enderecoUnidade002.html
      type: DataTypes.STRING,
      validate: {} 
    },
    nome_elemento: {        // Nome do elemento onde iremos adicionar o mapa. Exemplo: mapaUnidade002
      type: DataTypes.STRING,
      validate: {} 
    },
    nome_aba: {               // Nome da aba onde esta unidade irá ser apresentada. Exemplo: JARDIM PANORAMA.
      type: DataTypes.STRING,
      validate: {}
    }
  }, 
   {
    associate: function (modelos) {
      // Adiciona coluna de chave estrangeira 'unidade_id' para tabela de coordenadas.
      // Cada coordenada pertencerá à uma unidade. 
      modelos.Unidade.hasOne(modelos.UnidadeCoordenada, { foreignKey: 'unidade_id' }); 
      
    },
    instanceMethods: {
    
    },
    underscored: true // Lembre-se que utilizamos o padrão snake_case
  });

  return Unidade;
};