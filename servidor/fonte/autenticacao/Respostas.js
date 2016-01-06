'use strict';

/* @arquivo Respostas.js 
 */

/* Versão 0.0.1-Beta
 * - Adicionar caracteristica de lidar com as respostas da sessão. (issue #46) [FEITO]
 */

var utilitario = require('util');
var EmissorEvento = require('events').EventEmitter;

/* @Classe RespostasDeSessao
 *
 * Aqui - em cada uma das rotas - nós também iremos retornar um código de estatus informando o ocorrido. 
 * Os valores de estados poderão ser:
 *
 * - [estatus 200] Tudo certo. Estado padrão para informar que a requisição ocorreu com exito.
 * - [estatus 401] Não autorizado. Quando a autenticação é requerida e falhou ou dados necessários não foram providos.
 * - [estatus 400] Uma requisição errada. O servidor não pode ou não vai processar a requisição porque houve um erro no cliente (ex., sintaxe de requisição mau formada).
 * - [estatus 403] Acesso proibido. Retornamos este valor sempre que o acesso a uma fonte é proibida.
 * - [estatus 404] Não encontrado. A fonte requisitada não pode ser encontrada mas pode ser disponível no futuro.
 * - [estatus 500] Erro interno no servidor. Uma mensagem generica, disparada quando uma condição não esperada foi encontrada.
 *
 * Uma coisa importante a ser notada é que nós informamos um código na resposta, esse código é de importancia crucial, porque é 
 * com ele que vamos informar o que realmente esta acontecendo.
 *
 * @Veja https://en.wikipedia.org/wiki/List_of_HTTP_status_codes
 * @Veja http://expressjs.com/en/guide/error-handling.html
 *
 * @Parametro {Número} [estatus] O código de estatos de resposta do servidor HTTP REST.
 * @Parametro {Texto} [mensagem] Uma mensagem de resposta.
 * @Parametro {Texto} [codigo] Além dos estadus nós informamos um código que informa ao cliente o que realmente aconteceu.
 * @Parametro {Boleano} [seAutenticado] Usuário está autenticado com sucesso?
 */

var RespostasDeSessao = function(estatus, mensagem, codigo, seAutenticado) {
  this.name = 'RespostasDeSessao';
  this.message = mensagem || 'Erro interno no servidor.';
  this.status = estatus || 500;                    
  this.code = codigo;  
  this.auth = seAutenticado;
};
utilitario.inherits(RespostasDeSessao, EmissorEvento);

/* Não autorizado. Quando a autenticação é requerida e falhou ou dados necessários não foram providos.
 * 
 * @Parametro {Texto} [mensagem] Vamos informar ao cliente o que aconteceu.
 * @Parametro {Texto} [codigo] Contêm geralmente uma forma de informar mais especificamente o que ocorreu ao cliente.
 */
var RespostaDeErroNaoAutorizado = function(mensagem, codigo, seAutenticado) {
  RespostasDeSessao.call(this, 401, mensagem || 'Não autorizado', codigo, seAutenticado); 
  this.name = 'RespostaDeErroNaoAutorizado';
};
utilitario.inherits(RespostaDeErroNaoAutorizado, RespostasDeSessao);

/* Quando acontecer uma requisição erronea. Geralmente isso acontece porque houve um erro do lado do cliente.
 * 
 * @Parametro {Texto} [mensagem] Vamos informar ao cliente o que aconteceu.
 * @Parametro {Texto} [codigo] Contêm geralmente uma forma de informar mais especificamente o que ocorreu ao cliente.
 */
var RespostaDeErroDeRequisicaoErrada = function(mensagem, codigo, seAutenticado) {
  RespostasDeSessao.call(this, 400, mensagem || 'Requisição errada', codigo, seAutenticado); 
  this.name = 'RespostaDeErroDeRequisicaoErrada';
};
utilitario.inherits(RespostaDeErroDeRequisicaoErrada, RespostasDeSessao);

/* O acesso a essa fonte é proibida. Retornamos este valor sempre que o acesso a uma fonte é proibida.
 * 
 * @Parametro {Texto} [mensagem] Vamos informar ao cliente o que aconteceu.
 * @Parametro {Texto} [codigo] Contêm geralmente uma forma de informar mais especificamente o que ocorreu ao cliente.
 */
var RespostaDeErroDeProibicao = function(mensagem, codigo, seAutenticado) {
  RespostasDeSessao.call(this, 403, mensagem || 'Proibido', codigo, seAutenticado); 
  this.name = 'RespostaDeErroDeProibicao';
};
utilitario.inherits(RespostaDeErroDeProibicao, RespostasDeSessao);

/* Não foi encontrado. A fonte requisitada não pode ser encontrada mas pode ser disponível no futuro.
 * 
 * @Parametro {Texto} [mensagem] Vamos informar ao cliente o que aconteceu.
 * @Parametro {Texto} [codigo] Contêm geralmente uma forma de informar mais especificamente o que ocorreu ao cliente.
 */
var RespostaDeErroDeNaoEncontrado = function(mensagem, codigo, seAutenticado) {
  RespostasDeSessao.call(this, 404, mensagem || 'Não encontrado', codigo, seAutenticado); 
  this.name = 'RespostaDeErroDeNaoEncontrado';
};
utilitario.inherits(RespostaDeErroDeNaoEncontrado, RespostasDeSessao);

/* Tudo certo. Estatus padrão para informar que a requisição ocorreu com exito.
 * 
 * @Parametro {Texto} [mensagem] Vamos informar ao cliente o que aconteceu.
 * @Parametro {Texto} [codigo] Contêm geralmente uma forma de informar mais especificamente o que ocorreu ao cliente.
 */
var RespostaDeRequisisaoCompleta = function(mensagem, codigo, seAutenticado) {
  RespostasDeSessao.call(this, 200, mensagem || 'Requisição completa', codigo, seAutenticado);
  this.name = 'RespostaDeRequisisaoCompleta';
};
utilitario.inherits(RespostaDeRequisisaoCompleta, RespostasDeSessao);

module.exports = {
  RespostaDeErroNaoAutorizado: RespostaDeErroNaoAutorizado,
  RespostaDeErroDeNaoEncontrado: RespostaDeErroDeNaoEncontrado,
  RespostaDeErroDeRequisicaoErrada: RespostaDeErroDeRequisicaoErrada,
  RespostasDeSessao: RespostasDeSessao,
  RespostaDeErroDeProibicao: RespostaDeErroDeProibicao,
  RespostaDeRequisisaoCompleta: RespostaDeRequisisaoCompleta
};