module.exports = {
  
  // Armazenamento para os dados, este servidor utiliza sequelize.
  "storage": {
    "dialect": "mysql",
    "user": "leo",
    "password": "montes",
    "database": "database",
    "maxConcurrentQueries": 200,
    "maxConnections": 1,
    "maxIdleTime": 30
  },
  
  // configurações para o express
  "server": {
    "logger": "dev", // Valores: 'default', 'short', 'tiny', 'dev' 
    "port": 8080,
    "cors": {
      "hosts": ["*"] // não utilize * em uso final, por questões de segurança
    }
  }
  
};