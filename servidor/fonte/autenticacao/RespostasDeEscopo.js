'use strict';

/* @arquivo RespostasDeEscopo.js 
 */

/* Versão 0.0.1-Beta
 */

var utilitario = require('util');
var EmissorEvento = require('events').EventEmitter;

/* @Classe RespostasDeEscopo().
 *
 * Aqui - em cada uma das rotas - nós também iremos retornar um código de estatus informando o ocorrido. 
 * Os valores de estados poderão ser:
 *
 * - [estatus 200] Tudo certo. Estado padrão para informar que a requisição ocorreu com exito.
 * - [estatus 401] Não autorizado. Quando a autenticação é requerida e falhou ou dados necessários não foram providos.
 * - [estatus 500] Erro interno no servidor. Uma mensagem generica, disparada quando uma condição não esperada foi encontrada.
 *
 * Uma coisa importante a ser notada é que nós informamos um código na resposta, esse código é de importancia crucial, porque é 
 * com ele que vamos informar o que realmente esta acontecendo.
 *
 * @Veja https://en.wikipedia.org/wiki/List_of_HTTP_status_codes
 * @Veja http://expressjs.com/en/guide/error-handling.html
 *
 * @Parametro {Número} [estatos] O código de estatos de resposta do servidor HTTP REST.
 * @Parametro {Texto} [mensagem] Uma mensagem de resposta.
 * @Parametro {Texto} [codigo] Além dos estadus nós informamos um código que informa ao cliente o que realmente aconteceu.
 ---------------------------------------------------------------------------------------------------------------------------------*/
var RespostasDeEscopo = function(estatos, mensagem, codigo) {
  
  /* @Propriedade {Texto} [name] Nome desta resposta. */  
  this.name = 'RespostasDeEscopo';
  
  /* @Propriedade {Texto} [message] Mensagem desta resposta. */ 
  this.message = mensagem || 'Erro interno no servidor.';
  
  /* @Propriedade {Número} [status] Estatos desta resposta. */ 
  this.status = estatos || 500;                    
  
  /* @Propriedade {Texto} [codigo] O código desta resposta. */ 
  this.code = codigo;  
};
utilitario.inherits(RespostasDeEscopo, EmissorEvento);

/* @Método ErroNaoAutorizado().
 *
 * Não autorizado. Quando a autenticação é requerida e falhou ou dados necessários não foram providos.
 * 
 * @Parametro {Texto} [mensagem] Vamos informar ao cliente o que aconteceu.
 * @Parametro {Texto} [codigo] Contêm geralmente uma forma de informar mais especificamente o que ocorreu ao cliente.
 */
var ErroNaoAutorizado = function(mensagem, codigo) {
  RespostasDeEscopo.call(this, 401, mensagem || 'Não autorizado', codigo); 
  this.name = 'ErroNaoAutorizado';
};
utilitario.inherits(ErroNaoAutorizado, RespostasDeEscopo);

/* @Método RequisisaoCompleta(). 
 *
 * Tudo certo. Estatus padrão para informar que a requisição ocorreu com exito.
 * 
 * @Parametro {Pilha} [conteudo] Conteudo do resultado a ser enviado.
 */
var RequisisaoCompleta = function(conteudo) {
  RespostasDeEscopo.call(this, 200, 'Requisição completa', '');
  this.name = 'RequisisaoCompleta';
  this.content = conteudo;
};
utilitario.inherits(RequisisaoCompleta, RespostasDeEscopo);

module.exports = {
  RespostasDeEscopo: RespostasDeEscopo,
  ErroNaoAutorizado: ErroNaoAutorizado,
  RequisisaoCompleta: RequisisaoCompleta
};