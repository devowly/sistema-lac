'use strict'

/* Utilitarios diversos para nossas fontes REST.
 *
 * @Arquivo utilitarios.js
 */
 
var utilitarios = {
  inicializar: null,
  verificarSenha: null,
  bd: null
};

utilitarios.inicializar = function(bancoDados, jwt) {
  // Acesso ao banco de dados.
  this.bd = bancoDados;
  
  // Acesso ao nosso método Json Web Token de autorização as nossas rotas.
  this.jsonWebToken = jwt;
};

/* Realiza verificação do nosso usuário pelo token.
 *
 * @Parametro {token} O token informado pelo usuário.
 * @Parametro {modeloAcessoRota} O nome do modelo que contem as bandeiras de acesso para as rotas.
 * @Parametro {modeloRota} O nome do modelo onde as rotas estão sendo acessadas.
 * @Parametro {cd} Função chamada logo após verificarmos completamente o usuário.
 */
utilitarios.verificarUsuarioToken = function(token, modeloAcessoRota, modeloRota, cd) {
  var esteObjeto = this;
  
  this.jsonWebToken.verify(token, 'SenhaSuperSecreta', function (erro, decodificado) {
    if (erro) {
      cd(false, null);
    } else {
      
      if (decodificado) {
        var usuarioAcesso = {};
        // Aqui nós iremos procurar pelas bandeiras que este usuário possui para a rota (modelo) informada.
        esteObjeto.bd[modeloAcessoRota].findOne({
          where: {
            usuario_id: decodificado.id,  // Identificador do usuário.
            modelo: modeloRota             // Modelo onde queremos descobrir as bandeiras de acesso.
          }
        }).then(function (acessoRota) {
          if (!acessoRota) {
            // Aqui, caso o usuário não possua nenhuma bandeira para este modelo, retornamos o valor de false. Isso
            // faz com que o usuário não tenha acesso as rotas que necessitem de uma bandeira de acesso.
            // As rotas de livre acesso não necessitam de nenhuma verificação.
            cd(false, null);
          } else {
            // Copiamos alguns dados necessário para usuarioAcesso e depois iremos retorna-los.
            usuarioAcesso.id = decodificado.id;       // id: Identificador e também chave primária do nosso usuário.
            usuarioAcesso.jid = decodificado.jid;     // jid: Identificador Jabber do nosso usuário. (local@dominio).
            usuarioAcesso.uuid = decodificado.uuid;   // uuid: Identificador único do usuário.
            usuarioAcesso.name = decodificado.name;   // name: Nome do usuário.
            usuarioAcesso.bandeira = parseInt(acessoRota.bandeira, 16);  // bandeira: A bandeira de acesso deste usuário.
            cd(true, usuarioAcesso);
          }
        });
      } else {
        cd(false, null);
      }
    }
  });
};

/* Verificamos o usuário. A verificação é realizada comparando a senha com a senha que temos.
 * @Veja http://brianmajewski.com/2015/02/25/relearning-backbone-part-9/
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
    // Se não houver um usuário, é provavel que os dados informados estejam incorretos. Retornamos assim o valor false.
    if (!usuario) {
      cd(false, null);
    } else {
      // Iremos verificar aqui se os dados informados realmente conferem com os dados que temos.
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
  // Aqui nós iremos procurar pelas bandeiras que este usuário possui para a rota (modelo) informada.
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
      // Copiamos alguns dados necessário para usuarioAcesso e depois iremos retorna-los.
      usuarioAcesso.id = usuario.id;       // id: Identificador e também chave primária do nosso usuário.
      usuarioAcesso.jid = usuario.jid;     // jid: Identificador Jabber do nosso usuário. (local@dominio).
      usuarioAcesso.uuid = usuario.uuid;   // uuid: Identificador único do usuário.
      usuarioAcesso.name = usuario.name;   // name: Nome do usuário.
      usuarioAcesso.bandeira = parseInt(acessoRota.bandeira, 16);  // bandeira: A bandeira de acesso deste usuário.
      cd(true, usuarioAcesso);
    }
  });
};

module.exports = utilitarios;