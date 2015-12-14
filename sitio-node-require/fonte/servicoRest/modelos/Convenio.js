'use strict';

module.exports = {
    nome: 'Convenio' // Isso deve ser o mesmo nome dado a tabela no banco de dados.
  , rotas: ['/convenios', '/convenios/:id'] // Rotas para o serviço REST.
  , associacoes: true
}