var Sequelize = require('sequelize');
var sequelize_fixtures = require('sequelize-fixtures');
var pasta = require('path');
var configuracao = require('../configuracao/configuracao');

// Arquivo ou variavel.
var TIPO_PREENCHIMENTO = 'Arquivo';

// Inicia conexão com o banco de dados.
var sequelize = new Sequelize(
  configuracao.storage.database,
  configuracao.storage.user,
  configuracao.storage.password
);

var modelo = { 
  Carrossel: sequelize.import( pasta.join(__dirname + '/../fonte/armazenamento/modelos/', 'Carrossel.js') )
};

// Nosso array contendo os slides
var conteudoSlides = [
  {
    "model": "Carrossel",
    "data": {
      "titulo": "Vários exames laboratoriais",
      "texto": "Mais de 50 tipos de exames laboratoriais.",
      "texto_botao": "Ver lista de exames",
      "imagem": "./imagens/carrosselSlides/slide01.jpg"
    }
  },
  {
    "model": "Carrossel",
    "data": {
      "titulo": "Acesso aos resultados à distância",
      "texto": "Resultados online: Você nem precisa mais sair de casa.",
      "texto_botao": "Ver meus resultados",
      "imagem": "./imagens/carrosselSlides/slide02.jpg"
    }
  },
  {
    "model": "Carrossel",
    "data": {
      "titulo": "Atendimento Online",
      "texto": "Atendimento online gratuito de segunda a sábado em horário comercial.",
      "texto_botao": "Entrar em contato agora",
      "imagem": "./imagens/carrosselSlides/slide03.jpg"
    }
  }
]

if (TIPO_PREENCHIMENTO === 'Arquivo' ) {
  // Carrega registros do arquivo.
  sequelize_fixtures.loadFile('dadosJSON/carrossel.json', modelo).then(function(){
    console.log('Carregado registros do arquivo.');
  });  
} else {
  // Carrega registros do array.
  sequelize_fixtures.loadFixtures(conteudoSlides, modelo).then(function(){
    console.log('Carregado registros da variável.');
  }); 
}