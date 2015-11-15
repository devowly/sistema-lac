var express = require('express');
var path = require('path');
var http = require('http');
//var wine = require('./routes/wines');

// Porta do servidor Express
var PORTA_SERVIDOR = 8080;

var aplic = express();

/* Configuração do express */
aplic.configure(function () {
  aplic.set('port', process.env.PORT || PORTA_SERVIDOR);
  aplic.use(express.logger('dev'));  /* 'default', 'short', 'tiny', 'dev' */
  aplic.use(express.bodyParser()),
  aplic.use(express.static(path.join(__dirname, 'publico')));
});

/* ABAIXO RESTFUL:
 * GET (Pega dados)
 * POST (Envio de dados)
 * PUT (Atualização de dados)
 * DELETE (Apaga uma entrada)
--------------------------------------*/
/*
aplic.get('/wines', wine.findAll);
aplic.get('/wines/:id', wine.findById);
aplic.post('/wines', wine.addWine);
aplic.put('/wines/:id', wine.updateWine);
aplic.delete('/wines/:id', wine.deleteWine);
*/

http.createServer(aplic).listen(aplic.get('port'), function () {
  console.log("Servidor express carregado e escutando na porta " + aplic.get('port'));
});