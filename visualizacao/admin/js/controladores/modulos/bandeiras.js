'use strict'

/* As bandeiras de acesso a determinada fonte, nós utilizaremos nestas bandeiras operadores bit a bit.
 * Exemplo de como manipular as bandeiras:
 * - bandeira & bandeira (Comparação).
 * - bandeira |= bandeira (Adição).
 * - bandeira &= ~bandeira (Remoção).
 *
 * Para cada requisição a um dos nossos endpoints será necessário que o usuário tenha uma bandeira de acesso.
 * As bandeiras irão servir como uma chave de acesso as requisições.
 *
 * Aqui nós realizamos o teste para saber se um determinado usuário possui o acesso a rotas do serviço rest.
 *
 * @Arquivo bandeiras.js
 */

define([
  'jquery' 
, 'underscore'
, 'backbone'
], function($, _, BackBone){
  
  /* @Classe Bandeiras().
   *
   * Realizamos aqui a manipulação das bandeiras de acesso aos diversos escopos.
   --------------------------------------------------------------------------------------*/
  var Bandeiras = function() {
    
    /* @Propriedade {Pilha} [listaBandeiras] Uma lista de bandeiras para cada modelo. */
    this.listaBandeiras = [];  
    
    this.inicializar();
  };

  Bandeiras.prototype.inicializar = function() {
    
  };

  /* @Método [Publico] adcUmaBandeiraParaModulo(). 
   *
   * Acrescenta uma bandeira na pilha de determinado modulo. 
   *
   * @Parametro {Texto} [modulo] O nome do modulo que possui as bandeiras. Por exemplo: 'exames'.
   * @Parametro {Texto} [modelo] O nome do modelo que possui as bandeiras. Por exemplo: 'Exame'.
   * @Parametro {Texto} [acao] O tipo de ação da bandeira. Por exemplo: 'Criar'.
   * @Parametro {Texto} [acesso] O nome desta bandeira. Por exemplo: 'ACESSO_CRIAR'.
   * @Parametro {Número} [valor] O valor em hexadecimal desta bandeira. Por exemplo: 0x00000001.
   * @Retorna {verdadeiro|falso} Em caso de sucesso retorna verdadeiro, caso contrário retorna falso.
   */
  Bandeiras.prototype.adcUmaBandeiraParaModulo = function(modulo, modelo, acao, acesso, valor) {
    
    // Se ainda não houver uma lista de bandeiras para este modelo, então criamos uma.
    if(!this.listaBandeiras.hasOwnProperty(modulo)) {
      this.listaBandeiras[modulo] = [];
      this.listaBandeiras[modulo][modelo] = [];
    } else if (this.listaBandeiras[modulo] === null) {
      this.listaBandeiras[modulo] = [];
      this.listaBandeiras[modulo][modelo] = [];
    }
    
    // Salva uma nova bandeira e seu valor na lista de bandeiras de determinado modelo.
    this.listaBandeiras[modulo][modelo][acesso] = { 'acao': acao, 'valor': valor };
    return true;
  };

  /* @Método [Publico] pegarValorDaBandeiraPelasAcoes(). 
   *
   * Pega o valor das bandeiras associadas a determinadas ações. Aceita várias ações em simultaneo.
   * Retorna a adição do valor das bandeiras destas determinadas ações.
   *
   * @Parametro {Texto} [modulo] O nome do modulo que possui as bandeiras. Por exemplo: 'exames'.
   * @Parametro {Texto} [modelo] O modelo que possui as bandeiras.
   * @Parametro {Pilha} [acoes] As ações de acesso requisitado. Por exemplo 'Listar' ou 'Criar'.
   * @Retorna {Número} Soma das bandeiras das ações informadas.
   */
  Bandeiras.prototype.pegarValorDaBandeiraPelasAcoes = function(modulo, modelo, acoes) {
    var soma = parseInt(0, 16);
    var listaBandeiras = null;
    
    if (this.listaBandeiras[modulo] && this.listaBandeiras[modulo][modelo]) {
      listaBandeiras = this.listaBandeiras[modulo][modelo];
      for (var acesso in listaBandeiras) {
        if (listaBandeiras.hasOwnProperty(acesso)) {
          for (var ca = 0; ca < acoes.length; ca++) {  
            if (acoes[ca] === listaBandeiras[acesso].acao) {
              soma |= listaBandeiras[acesso].valor;
            }
          }
        }
      }
    }
    return soma;
  };
  
  /* @Método [Publico] removerBandeiraParaUmModulo(). 
   *
   * Remove da lista de bandeiras todos os dados de determinado modulo.
   *
   * @Parametro {Texto} [modulo] O modulo que possui as bandeiras.
   * @Retorna {verdadeiro|falso} Verdadeiro em caso de sucesso. Falso se não houve sucesso.
   */
  Bandeiras.prototype.removerBandeiraParaUmModulo = function(modulo) {
    
    if(this.listaBandeiras.hasOwnProperty(modulo)) {
      this.listaBandeiras[modulo] = null;
      return true;
    } 
    return false;
  };
  
  /* @Método [Publico] sePossuiAcesso(). 
   *
   * Verificamos aqui as bandeiras de acesso a este determinado modulo e seu modelo.
   *
   * @Parametro {Texto} [modulo] O modulo que possui as bandeiras.
   * @Parametro {Texto} [modelo] O modelo que possui as bandeiras.
   * @Parametro {Pilha} [acoes] As ações de acesso requisitado. Por exemplo 'Listar' ou 'Criar'.
   * @Retorna {falso|verdadeiro} falso se não houver acesso, verdadeiro caso contrário.
   */
  Bandeiras.prototype.sePossuiAcesso = function(modulo, modelo, acoes, valor) {
    var seSim = false;
    var listaBandeiras = null;
    
    if (this.listaBandeiras[modulo] && this.listaBandeiras[modulo][modelo]) {
      listaBandeiras = this.listaBandeiras[modulo][modelo];
      for (var acesso in listaBandeiras) {
        if (listaBandeiras.hasOwnProperty(acesso)){
           for (var ca = 0; ca < acoes.length; ca++) {        
            // Se o tipo de acesso requisitado e o valor das bandeiras são verdadeiros, nós retornamos verdadeiro.
            if (acoes[ca] === listaBandeiras[acesso].acao && (listaBandeiras[acesso].valor & valor)) {
              seSim = true;
              break;
            }
          }
        }
        if(seSim) {
          break;
        }
      }
    }
    return seSim;
  };

  return Bandeiras;
});