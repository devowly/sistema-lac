'use strict';

module.exports = {
    nome: 'UnidadeMapa'            // Isso deve ser o mesmo nome dado a tabela no banco de dados.
  , rotas: null                    // Rotas para o serviço REST. Não utilizamos rotas pois está associado.
  , sePossuirAssociacoes: true     // Está associado as unidades
  , parametroPesquisa: 'q'         // O parametro utilizar na pesquisa.
  , parametroOrdenamento: 'order'  // O parametro utilizado para realizar ordenamento de determinada coluna
  , seRealizarPaginacao: true      // Quando ligado vai retornar o valor total de resultados da listagem.
}