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
 * @ Arquivo Bandeiras.js
 */

var Bandeiras = function() {
  this.listaBandeiras = [];  // Uma lista de bandeiras para cada modelo.
};

Bandeiras.prototype.inicializar = function() {
  
};

/* Acrescenta uma bandeira na lista. 
 *
 * @Parametro {modelo} O modelo que possui as bandeiras.
 * @Parametro {bandeira} O nome desta bandeira.
 * @Parametro {tipo} O tipo de acesso da bandeira. Por exemplo: 'Criar'.
 * @Parametro {valor} O valor em hexadecimal desta bandeira.
 */
Bandeiras.prototype.adcBandeiraParaModelo = function(modelo, bandeira, tipo, valor) {
  
  // Se ainda não houver uma lista de bandeiras para este modelo, então criamos uma.
  if(!this.listaBandeiras.hasOwnProperty(modelo)) {
    this.listaBandeiras[modelo] = [];
  } 
  
  // Salva uma nova bandeira e seu valor na lista de bandeiras de determinado modelo.
  this.listaBandeiras[modelo][bandeira] = {
    valor: valor,
    tipo: tipo
  };
};

/* Verificamos aqui as bandeiras de acesso a este determinado modelo.
 *
 * @Parametro {modelo} O modelo que possui as bandeiras.
 * @Parametro {tipos} Pilha com os tipos de acesso requisitado. Por exemplo 'Listar'.
 * @Retorna falso se não houver acesso, verdadeiro caso contrário.
 */
Bandeiras.prototype.sePossuiAcesso = function(modelo, tipos, valor) {
  var seSim = false;
   
  var listaBandeiras = this.listaBandeiras[modelo];
  
  for (var bandeira in listaBandeiras) {
    if (listaBandeiras.hasOwnProperty(bandeira)){
      for (var ca = 0; ca < tipos.length; ca++) {
        // Se o tipo de acesso requisitado e o valor das bandeiras são verdadeiros, nós retornamos verdadeiro.
        if (tipos[ca] === listaBandeiras[bandeira].tipo && (listaBandeiras[bandeira].valor & valor)) {
          seSim = true;
          break;
        }
      }
    }
    if(seSim) {
      break;
    }
  }
  
  return seSim;
}

module.exports = Bandeiras;