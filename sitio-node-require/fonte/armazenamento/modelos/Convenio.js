/* @arquivo Convenio.js */

/* Versão 0.0.1-beta
 * - Uso do padrão snake_case. [FEITO]
 */

module.exports = function (database, DataTypes) {
  
  var VERSAO_BANCO_DADOS = 1;
  
  var Convenio = database.define('Convenio', {
    id: { 
      type: DataTypes.INTEGER, 
      autoIncrement: true, 
      primaryKey: true 
    },
    nome: {
      type: DataTypes.STRING // Nome do convênio. Exemplo: Arcelor Mittal.
    },
    descricao: {
      type: DataTypes.STRING // Descricao do convênio. Exemplo: Arcelor Mittal - Associação beneficiente dos empregados da Arcelor Mittal Brasil.
    }
  }, 
   {
    associate: function (modelos) {
      // Adiciona coluna de chave estrangeira 'convenio_id' para tabela de informação deste convenio.
      // Cada informação pertencerá à um convenio. 
      modelos.Convenio.hasOne(modelos.InfoConvenio, { foreignKey: 'convenio_id' }); 
    },
    instanceMethods: {
    
    },
    underscored: true, // Lembre-se que utilizamos o padrão snake_case
    timestamps: false
  });

  return Convenio;
};