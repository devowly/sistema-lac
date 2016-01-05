'use strict';

module.exports = {
    nome: 'ExameOrientacao'                              // Isso deve ser o mesmo nome dado a tabela no banco de dados.
  , rotas: ['/ExameOrientacao', '/ExameOrientacao/:id']  // Rotas para o serviço REST. Não utilizamos rotas pois está associado.
  , sePossuirAssociacoes: false                          // Está associado as unidades
  , parametroPesquisa: 'q'
  , parametroOrdenamento: 'order'
  , seRealizarPaginacao: true
}