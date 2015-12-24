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
 * @Parametro {autenticacao} Configuração de autenticação.
 */
var Autenticacao = function (aplicativo, bancoDados, jwt, autenticacao) {
  
  EmissorEvento.call(this);

  // Armazena a classe do banco de dados sequelize.
  this.bd = bancoDados; 
  
  // Armazena aplicativo express
  this.aplic = aplicativo;
  
  // Utilizaremos os tokens para autenticação.
  this.jsonWebToken = jwt;
  
  // A nossa configuração da autenticação. Abaixo a lista das propriedades:
  // - autenticacao.verifymodel: Contêm o nome do modelo onde iremos buscar verificar os dados do usuário.
  // - autenticacao.accessmodel: Contêm o nome do modelo onde iremos buscar verificar as bandeiras de acesso do usuário.
  // - autenticacao.supersecret: Contêm o valor da chave super secreta para codificar e decodificar os tokens.
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
    var jid = req.body.jid || req.params.jid || req.headers['x-autenticacao-jid'];
    var senha = req.body.senha || req.params.senha || req.headers['x-autenticacao-senha'];
    
    // Aqui procuramos o usuário pelo jid fornecido.
    esteObjeto.bd[esteObjeto.autentic.verifymodel].findOne({
      where: {
        jid: jid
      }
    }).then(function (usuario) {
      // Se não houver um usuário, é provavel que os dados informados estejam incorretos. Informamos que o JID é incorreto.
      if (!usuario) {
        res.json({ success: false, message: 'Você informou um JID que não confere. Contacte o administrador.' });
      } else {
        // Iremos verificar aqui se os dados informados realmente conferem com os dados que temos.
        var seConfere = usuario.verificarSenha(senha);
        if (seConfere) {
          // O jid e senha conferem, agora iremos requisitar as bandeiras de acesso para cada modelo.
          var jwtDados = {};
          // Aqui nós iremos procurar pelas bandeiras que este usuário possui para todas as rotas que ele tem cadastro.
          // Isso funcionará como os escopos, porque só iremos oferecer acesso a certos escopos (rotas dos modelos).
          esteObjeto.bd[esteObjeto.autentic.accessmodel].findAll({
            where: {
              usuario_id: usuario.id  // Identificador do usuário.
            }
          }).then(function (acessos) {
            if (!acessos) {
              // Aqui, caso o usuário não possua nenhuma bandeira, fará com que o usuário não tenha acesso as rotas 
              // que necessitem de uma bandeira de acesso. Lembre-se que as rotas de livre acesso não necessitam de nenhuma verificação.
              // Então este usuário possuirá acesso a somente as rotas de livre acesso, que geralmente são de listagem ou leitura.
            } else {
              // Copiamos alguns dados básicos do usuário e depois iremos codifica-los e depois retorna-los.
              jwtDados.id = usuario.id;      // id: Identificador e também chave primária do nosso usuário.
              jwtDados.jid = usuario.jid;    // jid: Identificador Jabber do nosso usuário. (local@dominio).
              jwtDados.uuid = usuario.uuid;  // uuid: Identificador único do usuário.
              jwtDados.name = usuario.name;  // name: Nome do usuário.
              
              // Caso tenhamos diversos acessos para diversos modelos, vamos armazena-los aqui.
              acessos.forEach(function(acesso) {
                var modelo = acesso.modelo;                   // O modelo onde verificamos a bandeira de acesso.
                var bandeira = acesso.bandeira.toString(16);  // Salvamos a bandeira do modelo no tipo texto. Depois convertemos para hexa.
                jwtDados[modelo] = bandeira;                // Salvamos determinada bandeira para um modelo em especifico.
              }); 
              
              // Agora que tudo esta certo nós podemos criar seu token de acesso.
              var token = esteObjeto.jsonWebToken.sign(
                jwtDados,  // Informações básicas do nosso cliente.
                esteObjeto.autentic.supersecret, {
                expiresInMinutes: 1440  // O token vai expirar em 24 horas.
              });

              // Informamos que houve sucesso na identificação e também retornamos o valor do token. 
              // Este token contêm informações sobre o tipo de acesso que o usuário possuirá. Isto 
              // é realizado pelo valor das bandeiras que este usuário possui.
              res.json({
                success: true,
                message: 'Autorização permitida, seu access token foi criado.',
                token: token,
                id: usuario.id
              });
            }
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