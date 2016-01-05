/* Exporta objeto contendo os dados de configuração para a nossa Api REST.
 *
 * @Arquivo configuracao.js 
 */

/* Aqui temos a configuração da nossa API REST.
 *
 * @Diretiva {storage} O nosso sistema de armazenamento.
 *  - storage.dialect (Obrigatório) O dialeto usado. Podendo ser: MySQL, PostGres ou então SQlite.
 *  - storage.port (Opcional e Recomendado) A porta utilizada para conexão com o nosso banco de dados. Não é necessário para o SQlite.
 *  - storage.host (Opcional e Recomendado) O endereço do nosso banco de dados. Não é necessário para o SQlite.
 *  - storage.password (Obrigatório) A nossa senha de conexão com o banco. Não é necessário para o SQlite.
 *  - storage.database (Obrigatório) O nome do banco utilizado.
 *  - storage.user (Obrigatório) O nome do usuário do banco. Não necessário para o SQLite.
 *
 * @Diretiva {api} A nossa API REST para o servidor-xmpp.
 *  - api.activate (Obrigatório) Se vamos ativar nosso serviço REST.
 *  - api.port (Obrigatório) A porta ao qual o serviço REST vai escutar por requisições.
 *  - api.cors (Obrigatório) O serviço cors.
 *  - api.cors.hosts (Obrigatório) Endereços permitidos pelo cors. Por questões de segurança, 
 *                                 não utilize * para a fase de produção.
 */
module.exports = {
  
  // Armazenamento: O armazenamento para os dados, este servidor utiliza sequelize.
  "storage": {
    "dialect": "mysql",               // Dialeto utilizado, pode ser MySQL, SQlite e Postgres.
    "user": "leo",                    // Nome do usuário do banco de dados, não é necessário para o SQlite.
    "password": "montes",             // Senha do usuário do banco de dados, não é necessário para o SQlite.
    "database": "database",           // Nome do nosso banco de dados.
    "maxConcurrentQueries": 200,      // Valor máximo de consultas concorrentes.
    "maxConnections": 1,              // Valo máximo de conexões.
    "maxIdleTime": 30,                
    "host": "127.0.0.1",              // Endereço ao qual utilizaremos para a conexão com o banco de dados.
    "port": 3306                      // A porta ao qual utilizaremos para a conexão com o banco de dados.
  },
  
  // API: configurações para a nossa API REST.
  "api": {
  "activate": true, 
  "port": 8081,     // A porta ao qual iremos escutar por requisições.
  "cors": {
    "hosts": ["*"]  // Utilizado para teste, não use * para a fase de produção. 
                    // Utilize apenas na fase de desenvolvimento e testes.
  }
}
  
};