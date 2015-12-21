/* Um utilitário para gerar senhas para os usuários.
 *
 * @Arquivo gerarSenha.js
 */

var bcrypt = require('bcrypt-nodejs');
var configuracao = require('jsconfig');

/* Nossas opções para configuração pela linha de comando. 
 */
configuracao.cli({
  senha: ['s', "a senha para ser encriptada", 'string', 'nao-informado']
});

/* @Parametro {args} Argumento passados.
 * @Parametro {opcs} As opções informadas.
 */
configuracao.load(function (args, opcs) {

  var senha = opcs.senha;

  // Gerando nossa senha encriptada.
  bcrypt.genSalt(5, function(erro, salt) {
    if (erro) {
      console.log('Erro ao tentar gerar o salt. Encerrando o processo.');
      process.exit(1);
    }
    bcrypt.hash(senha, salt, null, function(erro, hash) {
      if (erro) {
        console.log('Erro ao tentar gerar a senha. Encerrando o processo.');
        process.exit(1);
      }
      
      console.log('A senha ['+ senha +'] é equivalente a: '+ hash);
    });
  });
  
});