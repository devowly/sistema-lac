'use strict';

/* @arquivo CarrosselSlide.js */

/* Versão 0.0.1-beta
 * - Adicionar colunas e depois comentar. [FEITO]
 * - Remover a coluna ativo, passando está função para o código. (c88f6ed4fcfe3d105930820adc4537f7bffb3e10) [FEITO]
 */

module.exports = function (database, DataTypes) {

  var VERSAO_BANCO_DADOS = 1;
  
  var CarrosselSlide = database.define('CarrosselSlide', {
    titulo: {                      // Titulo que vai apresentar o slide
      type: DataTypes.STRING, 
      validate: {} 
    },
    texto: {                       // Texto que será apresentado.
      type: DataTypes.STRING, 
      validate: {} 
    },
    texto_botao: {                  // O texto do botão
      type: DataTypes.STRING, 
      validate: {} 
    },
    imagem_dir: {                   // Diretório onde se encontra as imagems
      type: DataTypes.STRING, 
      validate: {} 
    },
    imagem_arquivo: {               // Nome do arquivo da imagem. Exemplo: slide01.jpg
      type: DataTypes.STRING, 
      validate: {} 
    },
    endereco_botao: {               // Endereço que será acessado ao clicar no botão.
      type: DataTypes.STRING, 
      validate: {} 
    }
  }, {
    associate: function (modelos) {

    },
    instanceMethods: {
    
    },
    underscored: true, // Lembre-se que utilizamos o padrão snake_case
    timestamps: false
  });

  return CarrosselSlide;
};