'use strict'

/* Utilitarios diversos.
 *
 * @Arquivo utilitarios.js
 */
 
var utilitarios = {
  inicializar: null,
  verificarSenha: null,
  bd: null
};

utilitarios.inicializar = function(bancoDados) {
  this.bd = bancoDados;
};

/* Verificamos o usuário. A verificação é realizada comparando a senha com a senha que temos.
 *
 * @Parametro {modeloVerificacao} O nome do modelo em que iremos verificar o nosso usuário.
 * @Parametro {modeloAcessoRota} O nome do modelo que contem as bandeiras de acesso para as rotas.
 * @Parametro {modeloRota} O nome do modelo onde as rotas estão sendo acessadas.
 * @Parametro {usuarioJid} O identificador do usuário. Composto de local@dominio.
 * @Parametro {senha} Senha do usuário.
 * @Parametro {cd} Função chamada logo após verificarmos completamente o usuário.
 */
utilitarios.verificarUsuario = function(modeloVerificacao, modeloAcessoRota, modeloRota, usuarioJid, senha, cd) {
  // Aqui procuramos o usuário pelo jid fornecido.
  this.bd[modeloVerificacao].findOne({
    where: {
      jid: usuarioJid
    }
  }).then(function (usuario) {
    // Se usuário conferir nós iremos aqui chamar a função informando seus dados.
    if (!usuario) {
      cd(false, null);
    } else {
      var seConfere = usuario.verificarSenha(senha);
      if (seConfere) {
        // Se o usuário conferir com os dados, então agora queremos acessar sua bandeira de acesso a esta rota.
        utilitarios.verificarUsuarioAcessoRota(modeloRota, modeloAcessoRota, usuario, cd);
      } else {
        cd(false, null);
      }
    }
  });
};

/* Logo após o usuário for verificado, nós carregamos as bandeiras de acesso dele a determinada rota.
 *
 * @Parametro {modeloRota} O nome do modelo onde as rotas estão sendo acessadas.
 * @Parametro {modeloAcessoRota} O nome do modelo que contem as bandeiras de acesso para as rotas.
 * @Parametro {usuario} O objeto com os dados do usuário. 
 * @Parametro {cd} Função chamada logo após acessarmos as bandeiras de determinado usuário.
 */
utilitarios.verificarUsuarioAcessoRota = function(modeloRota, modeloAcessoRota, usuario, cd) {
  var usuarioAcesso = {};
  
  this.bd[modeloAcessoRota].findOne({
    where: {
      usuario_id: usuario.id,       // Identificador do usuário.
      modelo: modeloRota            // Modelo onde queremos descobrir as bandeiras de acesso.
    }
  }).then(function (acessoRota) {
    
    if (!acessoRota) {
      // Aqui, caso o usuário não possua nenhuma bandeira para este modelo, retornamos o valor de false. Isso
      // faz com que o usuário não tenha acesso as rotas que necessitem de uma bandeira de acesso.
      // As rotas de livre acesso não necessitam de nenhuma verificação.
      cd(false, null);
    } else {
      usuarioAcesso.id = usuario.id;       // Id: identificador do nosso usuário.
      usuarioAcesso.jid = usuario.jid;     // jid: Identificador do nosso usuário. (local@dominio).
      usuarioAcesso.uuid = usuario.uuid;   // uuid: Identificador unico do usuário.
      usuarioAcesso.name = usuario.name;   // name: Nome do usuário.
      usuarioAcesso.bandeira = parseInt(acessoRota.bandeira, 16);  // bandeira: A bandeira de acesso deste usuário.
      cd(true, usuarioAcesso);
    }
  });
  
};

module.exports = utilitarios;