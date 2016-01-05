'use strict'

/*
 * Os parametros do objeto Client:
 *   jid: String (obrigatório)
 *   password: String (obrigatório)
 *   host: String (Opcional)
 *   port: Number (opcional)
 *   reconnect: Boolean (opcional)
 *   autostart: Boolean (opcional) - Se nós iniciamos conectando a uma porta fornecida.
 *   register: Boolean (opcional) - Registra a conta antes de autenticar.
 *   legacySSL: Boolean (opcional) - Conecta com a porta legada SSL, obrigatório ao menos que o endereço host seja especificado.
 *   credentials: Dictionary (opcional) - Certificado de credenciais TLS ou chave SSL.
 *   actAs: String (opcional) - Se for um usuário administrador vai agir ao lado de outro usuário.
 *   disallowTLS: Boolean (opcional) - Previne que a conexão seja atualizada para uma segura atraves de TLS.
 *   preferred: String (opcional) - O mecanismo SASL preferido para usar.
 *   bosh.url: String (opcional) - Rota BOSH que será usada.
 *   bosh.prebind: Function(error, data) (opcional) - Vincula uma sessão BOSH ao navegador do cliente.
 *            error String - Resultado de um erro XMPP. Ex : [Error: XMPP authentication failure]
 *            data Object - Resultado da conexão XMPP BOSH.
 *
 * Exemplos:
 *   var cl = new xmpp.Client({
 *       jid: "eu@exemplo.com.br",
 *       password: "secreto"
 *   })
 *   var gtalk = new xmpp.Client({
 *       jid: 'eu@gmail.com',
 *       oauth2_token: 'xxxx.xxxxxxxxxxx', // from OAuth2
 *       oauth2_auth: 'http://www.google.com/talk/protocol/auth',
 *       host: 'talk.google.com'
 *   })
 *   var prebind = new xmpp.Client({
 *       jid: "meu@exemplo.com.br",
 *       password: "secreto",
 *       bosh: {
 *           url: "http://exemplo.com:porta/http-bind",
 *           prebind: function(error, data) {
 *               if (error) {}
 *               res.send({ rid: data.rid, sid: data.sid })
 *           }
 *       }
 *   })
 *
 * Exemplo de SASL externo:
 *
 * var minhasCredenciais = {
 *   // Estes são necessário apenas se estiver usando um certificado para autenticação do cliente.
 *   key: fs.readFileSync('key.pem'),
 *   cert: fs.readFileSync('cert.pem'),
 *   // passphrase: 'opcional'
 * }
 * var cl = new xmppClient({
 *     jid: "eu@exemplo.com.br",
 *     credentials: minhasCredenciais
 *     preferred: 'EXTERNAL' // Não é realmente obrigatorio, mas possivel de se utilizar. 
 * })
 *
 */
var xmppCliente = require('node-xmpp-client');

// Aqui iremos pegar os usuários
var configuracao = require('../../configuracao/configuracao.js');
var _ = require('underscore');

// Chamamos o arquivo principal, ele vai iniciar o servidor.
var servidor = require('../../biblioteca/iniciador/principal');

var quantClientes = 0;
var clientes = [];

// Lembre-se que ser você informou na configuração o testusers, Vão ser adcionados 10mil usuários.
// Isso faz com que tenhamos que adicionar um timeout de 30 segundos para que o teste dê certo.
var seUsuariosTeste = false;

/* Conectamos os clientes utilizando o mecanismo PLAIN.
 * O primeiro teste tentará conectar um cliente ao servidor xmpp utilizando o mecanismo PLAIN.
 * O segundo tenta testar a autenticação que o servidor oferece, sendo que é esperado
 * um erro em caso se senha inválida.
 * Observer que utilizamos o arquivo de configuração onde usuários de teste são adicionados.
 */
describe('Inicia servidor e conecta o nosso cliente', function(){
    
    before(function(avancar) {
      servidor.prosseguir(configuracao, function() {
        console.log('Iniciou servidor xmpp com sucesso!');
        avancar();
      });
    });
    

    beforeEach(function(avancar){
      
      // Percorremos todos os usuários de cada autenticação e armazenamos o jid e senha deles
      // Para depois conectarmos no servidor utilizando estes dados.	  
      if (configuracao && configuracao.auth && configuracao.auth.length >= 1) {
        var quantAutenticacoes = configuracao.auth.length;
        var qtdAutent = configuracao.auth.length - 1;

        // Avançamos logo depois de armazenar todos usuários de todos tipos de autenticação
        var pronto = _.after(quantAutenticacoes, function() {
          avancar();
        });
        _.each(configuracao.auth, function(autenticacao) {
          // Percorremos as autenticações disponíveis
          quantAutenticacoes--;
  
          if (autenticacao.users) {
            // Percorre lista de usuários
            autenticacao.users.forEach(function (usuario) {
              var confConexaoClient = {
                jid: usuario.user + '@' + 'localhost',
                password: usuario.password,
                
                // Utilizaremos o mecanismo de autenticação PLAIN. (Poderia ser: PLAIN, ANONYMOUS ou X-OAUTH2).
                preferred: 'PLAIN'
              }

              // cada um dos usuários possuem uma configuração.
              clientes[usuario.user] = confConexaoClient;

              quantClientes++;
            });  
          } else {
            console.log('Não possui usuarios de teste para a autenticação ' + autenticacao.type + '.');	
          } 

          // Verificamos se podemos proceder com o teste
          if (quantAutenticacoes <= qtdAutent) {
            seUsuariosTeste = autenticacao.testusers;
            pronto(); 		
          }
        });

      } else {
		  
        // Se não houver usuários como iremos conectar?
        console.log("Não foi possível carregar usuários, nesessário adicionar no arquivo de configuração.");
        process.exit(1);
      }
    });

    it('Deve conectar fácil se usuário e senha estivere corretos', function(pronto){
  
      var quantClientesConect = 1;
      var clts = [];
      var nomeUsuario;

      // Quando temos testes de usuários é necessário darmos mais tempo 
      // para o cliente conectar e disparar o evento online
      if (seUsuariosTeste) {
        this.timeout(30000); // 30 segundos 
      } else {
        this.timeout(10000); // 10 segundos 
      }
  
      for (nomeUsuario in clientes){
        if (clientes.hasOwnProperty(nomeUsuario)) {
          // cada cliente é conectado
          clts[nomeUsuario] = new xmppCliente(clientes[nomeUsuario]);
  
          clts[nomeUsuario].on('online', function () {
            quantClientesConect++;
              
            //Quando todos os clientes da configuração estiverem conectados
            if (quantClientesConect === quantClientes) {
                pronto(); 
            }

          });
        }
       }
 
    });
	
    // Este teste não está funcionando ainda. Porque o servidor não vai retornar erro para senha errada, e sim,
    // procurar no banco de dados, se não encontrar ele cria um novo usuário.
    // Fazendo com que nenhum erro seja retornado.
    it('deveria disparar um erro em caso de falha na autenticação', function(pronto){
  
      var quantClientesConect = 1;
      var clts = [];
      var nomeUsuario;

      // Quando temos testes de usuários é necessário darmos mais tempo 
	    // para o cliente conectar e disparar o evento online
      if (seUsuariosTeste) {
        this.timeout(30000); // 30 segundos 
      } else {
        this.timeout(10000); // 10 segundos 
	  }
	  
      for (nomeUsuario in clientes){
        if (clientes.hasOwnProperty(nomeUsuario)) {

          // Modificamos a configuração para conexão setando uma senha errada.
          var confSenhaErrada = clientes[nomeUsuario];
          confSenhaErrada.password = confSenhaErrada.password + 'yzzi';
		  
          clts[nomeUsuario] = new xmppCliente(confSenhaErrada);
  
          clts[nomeUsuario].on('online', function () {
            quantClientesConect++;
              
            //Quando todos os clientes da configuração estiverem conectados
            if (quantClientesConect === quantClientes) {
              throw function() {};
            }

          });

          clts[nomeUsuario].on('error', function(err) {
              //if(err === "XMPP authentication failure") {
              pronto();
              //}
          });
        }
      }
 
    });
    
});