'use strict';

var Promessa = require('bluebird');

function Autenticador() {}

/* Verifica a correspondencia entre o método que o usuário realizou para autenticação.
 *
 * @Parametro {metodo} O metodo utilizado pelo usuário. Podendo ser: PLAIN, X-OAUTH2 ou ANONYMOUS.
 */
Autenticador.prototype.seCorresponder = function (metodo) { // jshint ignore:line
  return false;
};

/* Realiza a autenticação utilizando o método que o usuário utiliza.
 *
 * @Parametro {opcs} Um mapa hash-key das opções.
 */
Autenticador.prototype.autenticar = function (opcs) { // jshint ignore:line
  return new Promessa(function (deliberar, recusar) {
    recusar();
  });
};

module.exports = Autenticador;
