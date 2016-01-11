'use strict'

/* Realiza rotinas de autenticação do usuário.
 *
 * @Arquivo AutenticacaoUsuario.js
 */

/* Versão 0.0.1-Beta 
 * - Adicionar caracteristica de verificação das bandeiras de acesso a cada nova requisição de acesso. (issue #39) [FEITO]
 */
 
/* @Classe AutenticacaoUsuario(). 
 *
 * Realizamos aqui diversas formas de autenticar os nossos usuário.
 * 
 * @Parametro {Objeto} [bancoDados] O nosso banco de dados Sequelize.
 * @Parametro {Objeto} [jwt] Utilizado para tratar as requisições em Json Web Token.
 * @Parametro {Objeto} [autenticacao] Configuração de autenticação.
 ------------------------------------------------------------------------------------*/
 var AutenticacaoUsuario = function(bancoDados, jwt, autenticacao) {

  /* @Propriedade {Objeto} [bd] Armazena a classe do banco de dados sequelize. */ 
  this.bd = bancoDados; 
  
  /* @Propriedade {Objeto} [jsonWebToken] Utilizaremos os tokens para autenticação. */  
  this.jsonWebToken = jwt;
  
 /* @Propriedade {Objeto} [autentic] A nossa configuração da autenticação. Abaixo a lista das propriedades:
  *
  * - autenticacao.verifyModel: Contêm o nome do modelo onde iremos buscar verificar os dados do usuário.
  * - autenticacao.accessModel: Contêm o nome do modelo onde iremos buscar verificar as bandeiras de acesso do usuário.
  * - autenticacao.superSecret: Contêm o valor da chave super secreta para codificar e decodificar os tokens.
  * - autenticacao.useSessionWithCookies: Contêm o valor que informa se vamos utilizar cookies com sessão.
  */
  this.autentic = autenticacao;
};

AutenticacaoUsuario.prototype.inicializar = function() {

};

/* @Método [Público] verificarUsuarioPeloToken(). 
 *
 * Realiza verificação do nosso usuário pelo token. Caso o as informações passadas conferirem, nós 
 * retornaremos a informação que o usuário confere e também as diversas propriedades do usuário.
 * @Veja https://github.com/auth0/node-jsonwebtoken
 * @Veja http://brianmajewski.com/2015/02/25/relearning-backbone-part-9/
 *
 * @Parametro {Texto} [token] O token informado pelo usuário.
 * @Parametro {Função} [cd] Será chamada logo após verificarmos completamente o usuário.
 */
AutenticacaoUsuario.prototype.verificarUsuarioPeloToken = function(token, cd) {
  var esteObjeto = this;
  
  this.jsonWebToken.verify(token, this.autentic.superSecret, function (erro, decodificado) {
    if (erro) {
      // O Token não confere. 
      cd(false, null);
    } else {
      if (decodificado && decodificado.user && decodificado.user.id) {
        // Aqui nós iremos procurar pelas bandeiras que este usuário possui para a rota (modelo) informada.
        esteObjeto.bd[esteObjeto.autentic.accessModel].findAll({
          where: {
            usuario_id: decodificado.user.id  // Identificador do usuário.
          }
        }).then(function (acessos) {
          if (!acessos) {
            // Aqui, caso o usuário não possua nenhuma bandeira, fará com que o usuário não tenha acesso as rotas 
            // que necessitem de uma bandeira de acesso. Lembre-se que as rotas de livre acesso não necessitam de nenhuma verificação.
            // Então este usuário possuirá acesso a somente as rotas de livre acesso, que geralmente são de listagem ou leitura.
            cd(false, null);
          } else {
            var escopos = {};   // Nosso escopo de acesso as rotas de cada modelo.
            
            // Caso tenhamos diversos acessos para diversos modelos, vamos armazena-los aqui.
            acessos.forEach(function(acesso) {                            
              var modelo = acesso.modelo;                   // O modelo onde verificamos a bandeira de acesso.
              var bandeira = acesso.bandeira.toString(16);  // Salvamos a bandeira do modelo no tipo texto. Depois convertemos para hexa.                  
              escopos[modelo] = bandeira;                    // Salvamos determinada bandeira para um modelo em especifico.
            }); 
            
             // Token verificado e decodificado com sucesso.
             cd(true, escopos);
          }
        })
        
      } else {
        // Token verificado porem não ha valor decodificado.
        cd(false, null);
      }
    }
  });
};

/* @Método [Público] verificarUsuarioPeloJid().  
 *
 * Verificamos o usuário. A verificação é realizada comparando a senha informada com a senha que temos.
 * Se o usuário conferir nós iremos pegar suas bandeiras de acesso e retornar chamando a função cd().
 * @Veja http://brianmajewski.com/2015/02/25/relearning-backbone-part-9/
 *
 * @Parametro {Texto} [modeloRota] O modelo onde iremos pegar as bandeiras de acesso do usuário.
 * @Parametro {Texto} [jid] O identificador do usuário. Composto de local@dominio.
 * @Parametro {Texto} [senha] Senha deste usuário.
 * @Parametro {Função} [cd] Será chamada assim que a verificação estiver terminada.
 */
AutenticacaoUsuario.prototype.verificarUsuarioPeloJid = function(modeloRota, jid, senha, cd) {
  var esteObjeto = this;
  
  // Aqui procuramos o usuário pelo jid fornecido.
  this.bd[this.autentic.verifyModel].findOne({
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

/* @Método [Público] verificarUsuarioAcessoRota().  
 *
 * Logo após conferir o usuário, nós carregamos as bandeiras de acesso dele a determinada modelo de rota.
 *
 * @Parametro {Texto} [modeloRota] O nome do modelo onde as rotas estão sendo acessadas.
 * @Parametro {Objeto} [usuario] Os dados do usuário. 
 * @Parametro {Função} [cd] Função chamada logo após acessarmos as bandeiras de determinado usuário.
 *                          Nesta função nós informamos se o usuário confere e seus dados.
 */
AutenticacaoUsuario.prototype.verificarUsuarioAcessoRota = function(modeloRota, usuario, cd) {
  var usuarioAcesso = {};
  // Aqui nós iremos procurar pelas bandeiras que este usuário possui para a rota (modelo) informada.
  this.bd[this.autentic.accessModel].findOne({
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