'use strict';

/* Utilizado para facilitar o acesso aos módulos deste sitemas
 * para cada um dos nossos módulos.
 */
module.exports = {
  ServicoRest: require('./servicoRest/indice'),         // Nosso serviço REST.
  Armazenamento: require('./armazenamento/indice'),     // Nosso módulo de armazenamento.
  registrador: require('./nucleo/registrador'),         // Realizar o registro.
  Autenticacao: require('./autenticacao/indice')        // Autenticacao Json Web Token.
};