/* Responsavel por lidar com os códigos de resposta do serviço REST. 
 *
 * @arquivo codigos.js 
 */

/* Versão 0.0.1-Beta
 */

define([
  'jquery' 
, 'underscore'
, 'backbone'
], function($, _, BackBone){
  'use strict';
  
  /* @Classe CodigosDeResposta().
   * 
   * A cada requisição iremos retornar na resposta um campo 'code' que é responsável por
   * informar qual estado da sessão. Isso faz com que haja uma forma primitiva de comunicação,
   * assim o lado cliente pode facilmente manipular os diversos estados de uma requisição.
   *
   * Iremos utilizar apenas três grupos de códigos: O grupo *ERRO*, *SUCESSO* e *INFO*. Cada um
   * deles separará as diversas mensagens pelo grau. Assim uma mensagem do grupo *ERRO* possuirá
   * uma gravidade maior que a do grupo *INFO* e assim por diante. 
   ------------------------------------------------------------------------------------------- */
  var CodigosDeResposta = function() {
    
    /* @Propriedade {Objeto} [CODIGOS] Armazena os códigos de resposta divididos em conjuntos das 
     * pilhas 'INFO', 'SUCESSO' e 'ERRO'. */
    this.CODIGOS = {
      'INFO': []     // Aqui são os códigos relacionados às informações.
    , 'SUCESSO': []  // Aqui os códigos de sucesso.
    , 'ERRO': []     // Informar o cliente que houve algum erro.
    };
  };
  
  /* @Método [Público] adicionarUmCodigo().
   *
   * Realiza a adição de um novo código. Cada código será utilizado para a comunicação das respostas
   * do serviço REST com os nossos modelos. A gente usará isso para ficar mais simples de manipular as
   * diversas respostas do serviço REST.
   *
   * @Parametro {Texto} [tipo] O tipo do código. Podendo ser: 'INFO', 'SUCESSO' ou 'ERRO'.
   * @Parametro {Texto} [nome] O nome do código. Por exemplo: 'SENHA_INVALIDA'.
   * @Parametro {Texto} [valor] O valor do código. Por exemplo: '001'
   * @Parametro {Texto} [mensagem] Uma mensagem que será associada a um código. Por exemplo: 'Senha invalida ou não informada.'.
   */
  CodigosDeResposta.prototype.adicionarUmCodigo = function(tipo, nome, valor, mensagem) {
   
    if ('INFO' === tipo) {  // Códigos de informação poder ser apresentados com cor azul.
      this.CODIGOS['INFO'].push({ nome: nome, cod: valor.toString(), msg: mensagem });
      
    } else if ('SUCESSO' === tipo) {  // Códigos de sucesso poderão ser apresentados com a cor verde.
      this.CODIGOS['SUCESSO'].push({ nome: nome, cod: valor.toString(), msg: mensagem }); 
      
    } else if ('ERRO' === tipo) {  // Códigos de erro podem ser apresentados com a cor vermelha.
      this.CODIGOS['ERRO'].push({ nome: nome, cod: valor.toString(), msg: mensagem }) 
      
    } else {
      console.log('Você informou um tipo que não existe.')
      return false;
    }
    
    // O cód. foi adicionado com sucesso.
    return true;
  };
  
  /* @Método [Público] procurarUmCodigoPeloValor().
   *
   * Realizamos aqui uma busca por determinado código pelo valor informado. Se caso o código for encontrado,
   * nós retornamos a mensagem e o tipo do código. Os tipos de códigos que temos são 'INFO', 'SUCESSO' e 'ERRO'.
   *
   * Uma das utilidades de retornarmos o tipo é que podemos separar as informações, por exemplo, a mensagem do tipo 
   * 'SUCESSO' pode ser apresentada da cor verde, a mensagem 'INFO' poderia ser de cor azul, já a mensagem de erro
   * pode ser apresentada com a cor vermelha. Assim, as cores podem representar a gravidade do código retornado.
   *
   * @Parametro {Texto} [valor] O valor do nosso código. Geralmente um campo texto com valor único.
   * @Retorno {Objeto|nulo} Um objeto contendo uma mensagem, tipo e o nome se encontrarmos o código, ou valor nulo se não for encontrado o código.
   */
  CodigosDeResposta.prototype.procurarUmCodigoPeloValor = function(valor) {
    var CODS = this.CODIGOS;
    var codigo = null;
    var seEncontrou = false;
    
    // Percorreremos todos os tipos de códigos e retornamos se encontrar.
    for (var tipo in CODS) {
      if (CODS.hasOwnProperty(tipo)) {
        // Percorremos aqui os conteudos dos tipos de codigos.
        for (var ca = 0; ca < CODS[tipo].length; ca++) {
          // Se encontrarmos então salvamos as informações e retornamos.
          if (CODS[tipo][ca] && CODS[tipo][ca].cod === valor.toString()) {
            // Aqui a gente retorna o nome, codigo e a mensagem relativa ao código.
            codigo = { nome: CODS[tipo][ca].nome, tipo: tipo, cod: CODS[tipo][ca].cod, msg: CODS[tipo][ca].msg };
            seEncontrou = true;
            break;
          }
        }
      }
      if (seEncontrou) break;
    }
    return codigo;
  };
  
  return (new CodigosDeResposta());

});