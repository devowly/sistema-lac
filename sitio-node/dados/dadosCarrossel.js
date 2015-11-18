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
  CarrosselSlide: sequelize.import( pasta.join(__dirname + '/../fonte/armazenamento/modelos/', 'CarrosselSlide.js') )
};

// Nosso array contendo os slides
var carrosselSlides = [
  {
    "model": "CarrosselSlide",
    "data": {
      "titulo": "Vários exames laboratoriais",
      "texto": "Mais de 50 tipos de exames laboratoriais.",
      "texto_botao": "Ver lista de exames",
      "imagem_dir": "./imagens/carrosselSlides/slide01.jpg",
      "ativo": true,
      "endereco_botao": "#examesOrientacoes"
    }
  },
  {
    "model": "CarrosselSlide",
    "data": {
      "titulo": "Acesso aos resultados à distância",
      "texto": "Resultados online: Você nem precisa mais sair de casa.",
      "texto_botao": "Ver meus resultados",
      "imagem_dir": "./imagens/carrosselSlides/slide02.jpg",
      "ativo": false,
      "endereco_botao": "#"
    }
  },
  {
    "model": "CarrosselSlide",
    "data": {
      "titulo": "Atendimento Online",
      "texto": "Atendimento online gratuito de segunda a sábado em horário comercial.",
      "texto_botao": "Entrar em contato agora",
      "imagem_dir": "./imagens/carrosselSlides/slide03.jpg",
      "ativo": false,
      "endereco_botao": "#centralAtendimento"
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
  sequelize_fixtures.loadFixtures(carrosselSlides, modelo).then(function(){
    console.log('Carregado registros da variável.');
  }); 
}