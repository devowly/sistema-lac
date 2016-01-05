/* @arquivo InfoConvenio.js */

/* Versão 0.0.1-beta
 * - Fazer associação funcionar. [FEITO]
 */

module.exports = function (database, DataTypes) {
  
  var VERSAO_BANCO_DADOS = 1;
  
  var InfoConvenio = database.define('InfoConvenio', {
    id: { 
      type: DataTypes.INTEGER, 
      autoIncrement: true, 
      primaryKey: true 
    },
    pagina_html: {
      type: DataTypes.STRING // Página html desta informação para o convenio. Exemplo: infoconvenio0001.html
    },
    nome_elemento: {
      type: DataTypes.STRING // Nome do elemento html utilizado para esta informação. Exemplo: infoconvenio0001
    },
    imagem: {
      type: DataTypes.STRING // Nome do arquivo que contêm a imagem do convênio. Exemplo: imgConvenio0001.jpeg
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

  return InfoConvenio;
};