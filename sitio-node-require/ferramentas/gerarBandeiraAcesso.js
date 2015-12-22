/* Uma ferramenta para gerar bandeiras de acesso para usuários.
 *
 * @Arquivo gerarBandeiraAcesso.js
 */
 
var configuracao = require('jsconfig');

/* Nossas opções para configuração pela linha de comando. 
 */
configuracao.cli({
  bandeira: ['b', "Uma bandeira em especifico para ser informada.", 'string', null],
  todas: ['t', "A adição de todas as bandeiras.", true]
});

/* @Parametro {args} Argumento passados.
 * @Parametro {opcs} As opções informadas.
 */
configuracao.load(function (args, opcs) {

 /* As bandeiras de acesso, nós utilizaremos nestas bandeiras operadores bit a bit.
  * Exemplo de como manipular as bandeiras:
  * - bandeira & bandeira (Comparação).
  * - bandeira |= bandeira (Adição).
  * - bandeira &= ~bandeira (Remoção).
  *
  * Para cada requisição a um dos nossos endpoints será necessário que o usuário tenha uma bandeira de acesso.
  * As bandeiras irão servir como uma chave de acesso as requisições. As bandeiras são:
  */
  var ACESSO_CRIAR =     0x00000001   // Chave de acesso necessária para criar um registro. 
  ,   ACESSO_LISTAR =    0x00000002   // Chave de acesso necessária para listar registros.
  ,   ACESSO_LER =       0x00000004   // Chave de acesso necessária para ler algum registro.
  ,   ACESSO_ATUALIZAR = 0x00000008   // Chave de acesso necessária para atualizar algum registro.
  ,   ACESSO_DELETAR =   0x00000010   // Chave de acesso necessária para deletar algum registro.
  ,   ACESSO_LIVRE =     0x00000020   // Chave de acesso livre, assim o controlador irá aceitar qualquer requisição.
  ,   ACESSO_TOTAL =     0x00000040;  // Chave de acesso do usuário raiz, com esta chave é possível acessar todas as rotas.

  var bandeira = opcs.bandeira;
  
  if (bandeira) {
    var valor = 0;
    
    switch (bandeira) {
      case 'ACESSO_CRIAR':
        valor = ACESSO_CRIAR;
      break;
      case 'ACESSO_LISTAR':
        valor = ACESSO_LISTAR;
      break;
      case 'ACESSO_LER':
        valor = ACESSO_LER;
      break;
      case 'ACESSO_ATUALIZAR':
        valor = ACESSO_ATUALIZAR;
      break;
      case 'ACESSO_DELETAR':
        valor = ACESSO_DELETAR;
      break;
      case 'ACESSO_LIVRE':
        valor = ACESSO_LIVRE;
      break;
      case 'ACESSO_TOTAL':
        valor = ACESSO_TOTAL;
      break;
    }
    
    console.log( 'O valor em texto da bandeira '+ bandeira +' é de : '+ valor.toString(16));
    console.log( 'O valor real da bandeira '+ bandeira +' é de : '+ valor);
    
  } else if (opcs.todas) {
    var somaTotal = ACESSO_CRIAR |= ACESSO_LISTAR |= ACESSO_LER |= ACESSO_ATUALIZAR |= ACESSO_DELETAR |= ACESSO_LIVRE |= ACESSO_TOTAL;
    var somaTotalTexto = somaTotal.toString(16);
    var somaTotalInt = parseInt(somaTotalTexto, 16);
    
    console.log( 'O valor em texto de todas as bandeiras somadas é de : '+ somaTotalTexto);
    console.log( 'O valor real de todas as bandeiras somadas é de : '+ somaTotalInt);
  } else {
    console.log('Argumentos incorretos. Escreva node gerarBandeiraAcesso.js --help ');
  }
  
});