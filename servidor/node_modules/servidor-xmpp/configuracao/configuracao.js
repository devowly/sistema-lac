/* Exporta objeto contendo os dados de configuração para o nosso servidor XMPP.
 *
 * @Arquivo configuracao.js 
 */

/* Aqui temos a configuração do nosso serviço.
 *
 * @Diretiva {connection} As formas de conexões aceitas. 
 *  - connection.type (Obrigatorio) Aquelas conexões aceitas. podendo ser: tcp, bosh ou websocket.
 *  - connection.port (Opcional e recomendado) A porta a qual esta conexão vai escutar.
 *  - connection.domain (Opcional e recomendado) O endereço ao qual este tipo de conexão irá escutar por conexões.
 *  - connection.interface (Opcional) A interface utilizada por esta conexão.
 *
 * @Diretiva {auth} As autenticaçõe disponíveis.
 *  - auth.type (Obrigatório) O tipo de autenticação. podendo ser: simple, oauth2 e ou anonymous.
 *  - auth.testusers (Opcional) Se essa autenticação vai possuir usuários de teste.
 *  - auth.users (Opcional) Aqueles usuários desta autenticação.
 *  - auth.users.user (Opcional) Nome de usuário desta autenticação.
 *  - auth.users.password (Opcional) A senha do usuário desta autenticação.
 *  - auth.server (Opcional) É obrigatório apenas no tipo oauth2. Esta será a URL utilizada pela autenticação Oauth2.
 *
 * @Diretiva {storage} O nosso sistema de armazenamento.
 *  - storage.dialect (Obrigatório) O dialeto usado. Podendo ser: MySQL, PostGres ou então SQlite.
 *  - storage.port (Opcional e Recomendado) A porta utilizada para conexão com o nosso banco de dados. Não é necessário para o SQlite.
 *  - storage.host (Opcional e Recomendado) O endereço do nosso banco de dados. Não é necessário para o SQlite.
 *  - storage.password (Obrigatório) A nossa senha de conexão com o banco. Não é necessário para o SQlite.
 *  - storage.database (Obrigatório) O nome do banco utilizado.
 *  - storage.user (Obrigatório) O nome do usuário do banco. Não necessário para o SQLite.
 */
module.exports = {

  // Conexão: A gerencia de conexões irá carregar os tipos de conexões daqui.
  "connection": [{
      "type": "tcp",                // Conexão do tipo tcp.
      "port": 5222,                 // Porta utilizada nessa conexão.
      "interface": "0.0.0.0", 
      "domain": "127.0.0.1"         // Vamos escutar por conexões neste endereço.
    }, {
      "type": "bosh",               // Conexão do tipo BOSH
      "port": 5280,                 // Porta utilizada.
      "path": "http-bind",          // Extensão que utilizaremos.
      "interface": "0.0.0.0",
      "domain": "127.0.0.1"         // Vamos escutar por conexões neste endereço.
    }, {
      "type": "websocket",          // Conexão do tipo websocket.
      "port": 5281,                 // Porta utilizada.
      "interface": "0.0.0.0",
      "domain": "127.0.0.1"         // Vamos escutar por conexões neste endereço.
    }
  ],

  // Autenticação: Configura os mecanismos de autenticação
  "auth": [{
    "type": "simple",                // Mecanismo de autenticação SIMPLE.
    "testusers": false,              // Se ligado irá adicionar 10mil usuários de teste.
    "users": [{                      // Nossos usuários de teste. Eles serão adicionados ao mecanismo de autenticação Simple.
      "user": "felippe",
      "password": "felippe10"
    }, {
      "user": "junior",
      "password": "junior10"
    }, {
      "user": "vinicius",
      "password": "vinicius10"
    }]
  },
  {
    "type": "oauth2",                 // Mecanismo de autenticação OAUTH2.
    "server": "localhost:3000"        // O servidor Oauth2. <umdez> Eu ainda não tenho certeza de qual servidor eu vou utilizar. 
  },
  {
    "type": "anonymous"               // Mecanismo de autenticação ANONYMOUS.
  }],
  
  // Armazenamento: O armazenamento para os dados, este servidor utiliza sequeliza.
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
  }
  
};