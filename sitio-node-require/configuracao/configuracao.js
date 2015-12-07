/* Exporta objeto contendo os dados de configuração para o nosso servidor.
 *
 * @Arquivo configuracao.js 
 */

module.exports = {
  
  // Armazenamento para os dados, este servidor utiliza Sequelize.
  "storage": {
    "dialect": "mysql",               // Dialeto utilizado, pode ser MySQL, SQlite e Postgres.
    "user": "leo",                    // Nome do usuário do banco de dados, não é necessário para o SQlite.
    "password": "montes",             // Senha do usuário do banco de dados, não é necessário para o SQlite.
    "database": "database",           // Nome do nosso banco de dados.
    "maxConcurrentQueries": 200,      // Valor máximo de consultas concorrentes.
    "maxConnections": 1,              // Valo máximo de conexões.
    "maxIdleTime": 30,                
    "host": "localhost",              // Endereço ao qual utilizaremos para a conexão com o banco de dados.
    "port": 3306                      // A porta ao qual utilizaremos para a conexão com o banco de dados.
  },
  
  // configurações para o Express
  "server": {
    "logger": "dev",                  // Valores permitidos: 'default', 'short', 'tiny', 'dev' 
    "port": 8080,                     // A porta ao qual o servidor irá escutar por requisições http.
    "cors": {                         
      "hosts": ["*"]                  // Os hosts permitidos, não utilize * em uso final, por questões de segurança
    }
  }
  
};