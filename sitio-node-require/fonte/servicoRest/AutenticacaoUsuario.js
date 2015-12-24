'use strict'

/* Realiza rotinas de autenticação do usuário.
 *
 * @Arquivo AutenticacaoUsuario.js
 */

/* Realizamos aqui diversas formas de autenticar os nossos usuário.
 * 
 * @Parametro {bancoDados} Objeto do nosso banco de dados.
 * @Parametro {jwt} Nosso módulo Json Web Token.
 * @Parametro {autenticacao} Configuração de autenticação.
 */
 var AutenticacaoUsuario = function(bancoDados, jwt, autenticacao) {

  // Armazena a classe do banco de dados sequelize.
  this.bd = bancoDados; 
  
  // Utilizaremos os tokens para autenticação.
  this.jsonWebToken = jwt;
  
  // Chave para codificação ou decodificação dos tokens.
  this.superSecreto = autenticacao.supersecret;
  
  // A nossa configuração da autenticação. Abaixo a lista de propriedades:
  // - autenticacao.verifymodel: Contêm o nome do modelo onde iremos buscar verificar os dados do usuário.
  // - autenticacao.accessmodel: Contêm o nome do modelo onde iremos buscar verificar as bandeiras de acesso do usuário.
  this.autentic = autenticacao;
};

AutenticacaoUsuario.prototype.inicializar = function() {

};

/* Realiza verificação do nosso usuário pelo token. Caso o as informações passadas conferirem, nós 
 * retornaremos a informação que o usuário confere e também as diversas propriedades do usuário.
 * @Veja https://github.com/auth0/node-jsonwebtoken
 * @Veja http://brianmajewski.com/2015/02/25/relearning-backbone-part-9/
 *
 * @Parametro {token} O token informado pelo usuário.
 * @Parametro {modeloRota} O nome do modelo onde as rotas estão sendo acessadas.
 * @Parametro {cd} Função chamada logo após verificarmos completamente o usuário.
 */
AutenticacaoUsuario.prototype.verificarUsuarioPeloToken = function(token, modeloRota, cd) {
  var esteObjeto = this;
  
  this.jsonWebToken.verify(token, this.superSecreto, function (erro, decodificado) {
    if (erro) {
      // O Token não confere. 
      cd(false, null);
    } else {
      if (decodificado) {
        var usuarioAcesso = {};
        // Aqui nós iremos procurar pelas bandeiras que este usuário possui para a rota (modelo) informada.
        esteObjeto.bd[esteObjeto.autentic.accessmodel].findOne({
          where: {
            usuario_id: decodificado.id,  // Identificador do usuário.
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

/* Verificamos o usuário. A verificação é realizada comparando a senha informada com a senha que temos.
 * Se o usuário conferir nós iremos pegar suas bandeiras de acesso e retornar chamando a função cd().
 * @Veja http://brianmajewski.com/2015/02/25/relearning-backbone-part-9/
 *
 * @Parametro {modeloRota} O nome do modelo onde as rotas estão sendo acessadas.
 * @Parametro {jid} O identificador do usuário. Composto de local@dominio.
 * @Parametro {senha} Senha do usuário.
 * @Parametro {cd} Função chamada logo após verificarmos completamente o usuário.
 */
AutenticacaoUsuario.prototype.verificarUsuarioPeloJid = function(modeloRota, jid, senha, cd) {
  var esteObjeto = this;
  
  // Aqui procuramos o usuário pelo jid fornecido.
  this.bd[this.autentic.verifymodel].findOne({
    where: {
      jid: jid
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
        esteObjeto.verificarUsuarioAcessoRota(modeloRota, usuario, cd);
      } else {
        cd(false, null);
      }
    }
  });
};

/* Logo após conferir o usuário, nós carregamos as bandeiras de acesso dele a determinada modelo de rota.
 *
 * @Parametro {modeloRota} O nome do modelo onde as rotas estão sendo acessadas.
 * @Parametro {usuario} O objeto com os dados do usuário. 
 * @Parametro {cd} Função chamada logo após acessarmos as bandeiras de determinado usuário.
 *                 Nesta função nós informamos se o usuário confere e seus dados.
 */
AutenticacaoUsuario.prototype.verificarUsuarioAcessoRota = function(modeloRota, usuario, cd) {
  var usuarioAcesso = {};
  // Aqui nós iremos procurar pelas bandeiras que este usuário possui para a rota (modelo) informada.
  this.bd[this.autentic.accessmodel].findOne({
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

module.exports = AutenticacaoUsuario;