'use strict';

module.exports = {
    nome: 'Exame' // Isso deve ser o mesmo nome dado a tabela no banco de dados.
  , rotas: ['/exames', '/exames/:id'] // Rotas para o serviço REST.
  , associacoes: true
}