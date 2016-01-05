/* Exporta objeto contendo os dados de configuração para a nossa visualização.
 *
 * @Arquivo configuracao.js 
 */

/* Aqui temos a configuração do nosso serviço.
 *
 * @Diretiva {server} O nosso servidor http.
 *  - server.port (Obrigatório) A porta onde o serviço irá esperar por requisições http.
 *  - server.sslPort (Obrigatório) A porta ao qual o servidor irá esperar por requisições https.
 *  - server.limit (Obrigatório) Valor limite do body que é permitido. Mantenha o valor baixo para precaver
 *                               contra negação de serviços.
 *  - server.logger (Opcional) O tipo de registro. podendo ser: 'default', 'short', 'tiny', 'dev' 
 *  - server.certificates.privateKey (Obrigatório) A chave privada.
 *  - server.certificates.certificate (Obrigatório) O certificado.
 */
module.exports = {

  // Servidor: As configurações para o Express.
  "server": {
    "logger": "dev",                     // Valores permitidos: 'default', 'short', 'tiny', 'dev' 
    "port": 80,                          // A porta ao qual o servidor irá escutar por requisições http.
    "sslPort": 443,                      // A porta ao qual o servidor irá esperar por requisições https.
    "limit": "200kb",                    // Limite permitido para o conteúdo body. Lembre-se de manter o limit do body em 
                                         // '200kb' para nos precaver dos ataques de negação de serviço.
    "certificates": {                    // Certificados utilizados para o servidor https.
      "privateKey": "servidorHttps.key", // A chave privada.
      "certificate": "servidorHttps.crt" // O certificado.
    }
  }

};