'use strict';

/* @arquivo indice.js 
 *
 * @descrição Realizará uma parte da autenticação e também autorização do nosso serviço
 *            Utilizando Json Web Token.
 */

/* Versão 0.0.1-Beta */

var util = require('util');
var EmissorEvento = require('events').EventEmitter;
var Promessa = require('bluebird');
var registrador = require('../nucleo/registrador')('Autenticacao');

/* Abstração da gerencia das autenticações e autorizações. 
 *
 * @Parametro {aplicativo} O nosso servidor Express.
 * @Parametro {bancoDados} Objeto do nosso banco de dados.
 * @Parametro {jwt} Módulo para tratar as requisições em Json Web Token.
 */
var Autenticacao = function (aplicativo, bancoDados, jwt, autenticacao) {
  
  EmissorEvento.call(this);

  // Armazena a classe do banco de dados sequelize.
  this.bd = bancoDados; 
  
  // Armazena aplicativo express
  this.aplic = aplicativo;
  
  // Utilizaremos os tokens para autenticação.
  this.jsonWebToken = jwt;
  
  // Nome do modelo onde iremos buscar verificar os dados do usuário.
  this.modeloVerificacao = 'Usuario';
  
  // Configuração da autenticação.
  this.autentic = autenticacao;
};

util.inherits(Autenticacao, EmissorEvento);

/* Realiza o inicio do serviço de autenticação de nossos usuários.
 * @Veja http://brianmajewski.com/2015/02/25/relearning-backbone-part-9/
 */
Autenticacao.prototype.carregarServicoAutenticacao = function () {
  var esteObjeto = this;
  
  // Obs: Se utilizar o Postman, não utilize 'application/json' no header de requisição
  // @Veja https://stackoverflow.com/questions/29006170/error-invalid-json-with-multer-and-body-parser
  
  // Acrescentamos a nossa rota de autenticação e esperamos por requisições do tipo POST.
  this.aplic.post('/autenticar', function (req, res) {
    // Aqui procuramos o usuário pelo jid fornecido.
    esteObjeto.bd[esteObjeto.modeloVerificacao].findOne({
      where: {
        jid: req.body.usuarioJid
      }
    }).then(function (usuario) {
      // Se não houver um usuário, é provavel que os dados informados estejam incorretos. Informamos que o JID é incorreto.
      if (!usuario) {
        res.json({ success: false, message: 'Você informou um JID que não confere. Contacte o administrador.' });
      } else {
        // Iremos verificar aqui se os dados informados realmente conferem com os dados que temos.
        var seConfere = usuario.verificarSenha(req.body.senha);
        if (seConfere) {
          // Se o usuário conferir com os dados, agora podemos criar seu token de acesso.
          var token = esteObjeto.jsonWebToken.sign({
            jid: usuario.jid,
            id: usuario.id,
            uuid: usuario.uuid,
            name: usuario.name
          }, esteObjeto.autentic.supersecret, {
            // O token vai expirar em 24 horas.
            expiresInMinutes: 1440
          });

          res.json({
            success: true,
            message: 'Autorização permitida, seu access token foi criado.',
            token: token,
            id: usuario.id
          });
          
        } else {
          res.json({ success: false, message: 'Você informou uma senha que não confere. Contacte o administrador.' });
        }
      }
    });  
  });
};

/* Realizamos aqui o inicio do nosso serviço de autenticação e autorização.
 *
 * @Retorna {Promessa} Promessa de recusa ou de deliberação. 
 */
Autenticacao.prototype.iniciar = function () {

  registrador.debug('Iniciando serviço de Autenticacao e Autorização.');

  var esteObjeto = this;

  return new Promessa(function (deliberar, recusar) {

    // Carregamos nosso serviço.
    esteObjeto.carregarServicoAutenticacao();
    
    // Se tudo ocorreu bem.
    deliberar(esteObjeto);
    
  });
};

module.exports = Autenticacao;