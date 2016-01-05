'use strict'

/* Versão 0.0.1-Beta
 */

define([
  
], function( ){
  
  /* Configuração da nossa visão.
   *
   * @Diretiva {cors} Configuração do serviço CORS.
   *  - cors.serverAddress (Obrigatório) O endereço do servidor http.
   *  - cors.serverAddressSsl (Obrigatório) O endereço do servidor https.
   */
  
  return {
    cors: {
      serverAddress: "http://localhost:81/"       // O endereço do servidor http.
    , serverAddressSsl: "https://localhost:444/"  // O endereço do servidor https.
    }
  };
  
});