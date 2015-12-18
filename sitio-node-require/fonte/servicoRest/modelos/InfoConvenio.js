'use strict';

module.exports = {
    nome: 'InfoConvenio'        // Isso deve ser o mesmo nome dado a tabela no banco de dados.
  , rotas: null                 // Rotas para o serviço REST. Não utilizamos rotas pois está associado.
  , sePossuirAssociacoes: true  // Está associado aos convenios
  , parametroPesquisa: 'q'
  , parametroOrdenamento: 'order'
  , seRealizarPaginacao: true
}