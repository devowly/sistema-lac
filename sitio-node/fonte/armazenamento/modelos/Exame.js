/* @arquivo Exame.js */

/* Versão 0.0.1-beta
 * - Uso do padrão snake_case. [FEITO]
 */

module.exports = function (database, DataTypes) {
  
  var VERSAO_BANCO_DADOS = 1;
  
  var Exame = database.define('Exame', {
    id: { 
      type: DataTypes.INTEGER, 
      autoIncrement: true, 
      primaryKey: true 
    },
    nome: {
      type: DataTypes.STRING // Nome do exame. Exemplo: 1,25 DIHIDROXI VITAMINA D3.
    }
  }, 
   {
    associate: function (modelos) {
      // Adiciona coluna de chave estrangeira 'exame_id' para tabela de orientação deste exame.
      // Cada orientação pertencerá à um exame. 
      modelos.Exame.hasOne(modelos.ExameOrientacao, { foreignKey: 'exame_id' }); 
    },
    instanceMethods: {
    
    },
    underscored: true, // Lembre-se que utilizamos o padrão snake_case
    timestamps: false
  });

  return Exame;
};