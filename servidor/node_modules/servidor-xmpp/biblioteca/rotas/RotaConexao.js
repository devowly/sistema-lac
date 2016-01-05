'use strict';

/* @Arquivo RotaConexao.js 
 *
 * Gerencia as conexões, autenticações e os diversos eventos de um determinado stream.
 * Os eventos de um stream podem ser de conexão, envio de stanzas, autenticação etc.
 */

/* Versão 0.0.1-Beta
 * - Verificar se os valores de to e from são adequados para o cliente, rejeitar mensagems onde o valor do from não é adequado. (issue #8) [AFAZER]
 */ 
 
var util = require('util');
var XRotas = require('../nucleo/XRotas');
var Promessa = require('bluebird');
var JID = require('node-xmpp-core').JID;
var VerificarXmpp = require('../nucleo/VerificarXmpp');
var registrador = require('../nucleo/Registrador')('RotaConexao');
var RegistradorEventos = require('../nucleo/RegistradorEventos'); // Bom notar que utilizamos também bunyan.

/* Gerencia as conexões e roteia as solicitações para outras rotas
 */
function RotaConexao(armazenamento) {
  XRotas.call(this);

  this.armazenamento = armazenamento;

  // Gerência de conexões, por exemplo, tcp, bosh e websockets.
  this.gerenciaConexao = [];

  // Os métodos de autenticação, por exemplo, oauth2, anonymous e plain.
  this.metodosAutenticacao = [];

  // As seções conectadas de todas gerências de conexão
  this.secoes = {};
  this.contador = 0;
  
  // Vamos registrar aqueles eventos relacionados ao stream
  this.registradorEventos = new RegistradorEventos();
  
}

// Extendemos o XRotas.
util.inherits(RotaConexao, XRotas);

RotaConexao.prototype.nome = 'RotaConexao';

/* Verificamos se o destinatário desta stanza corresponde.
 *
 * @Parametro {stanza} A stanza.
 */
RotaConexao.prototype.seCorresponder = function (stanza) {
  var seCorresponder = false;

  if (stanza.attrs && stanza.attrs.to) {
    var paraJid = new JID(stanza.attrs.to);

    // envia para todos clientes locais, verifica se o JID confere
    if (this.secoes.hasOwnProperty(paraJid.bare().toString())) {
      seCorresponder = true;
    }
  }
  return seCorresponder;
};

/* Aqui adicionamos um determinado método de autenticação. Podendo ser: Simple, Oauth2 ou Anonymous.
 *
 * @Parametro {metodo} Um método de autenticação.
 */
RotaConexao.prototype.adcMetodoAutenticacao = function (metodo) {
  this.metodosAutenticacao.push(metodo);
};

/* Procura um determinado método de autenticação.
 *
 * @Parametro {metodo} Pode ser X-OAUTH2, ANONYMOUS ou PLAIN.
 * @Retorna Uma pilha contendo todos aqueles métodos encontrados.
 */
RotaConexao.prototype.procurarMetodoAutenticacao = function (metodo) {
  var encontrados = [];
  for (var i = 0; i < this.metodosAutenticacao.length; i++) {
    if (this.metodosAutenticacao[i].seCorresponder(metodo)) {
      encontrados.push(this.metodosAutenticacao[i]);
    }
  }
  return encontrados;
};

/* Passo adicional de verificação da informação do cliente.
 *
 * @Parametro {opcs} As informação de valores chave das opções do cliente.
 * @Retorna {Promessa} De deliberação ou recusa da verificação.
 */
RotaConexao.prototype.verificarCliente = function (opcs) {
  registrador.debug('Verificando cliente');

  for (var atrb in opcs) {
    if (opcs.hasOwnProperty(atrb)) {
      registrador.debug(atrb + ' -> ' + opcs[atrb]);
    }
  }
  
  registrador.debug('Autenticação do cliente');
  
  var armazenamento = this.armazenamento;

  return new Promessa(function(deliberar, recusar) {
 
    // Armazena o nome se pegar 
    if (opcs.jid) {
      registrador.debug('atualiza nome do usuário');
   
      // Nós não precisamos esperar aqui, vamos fazer isto no plano de fundo
      // encontrar ou criar usuário e atualizar o nome  
      var transacao = null;
      var usu = null;
      armazenamento.sequelize.transaction().then(function (t) {
        transacao = t;
        return armazenamento.encontrarOuCriarUsuario(opcs.jid.toString(), {
          transaction: t
        })
      }).spread(function(usuario, criado) { // jshint ignore:line
        usu = usuario;
        if (opcs.name) {
          usu.name = opcs.name;
        }
        return transacao.commit();
      }).then(function(){
        registrador.debug(JSON.stringify(usu));
        deliberar(usu);
      }).catch(function(err){
        registrador.error(err);
        transacao.rollback();
        recusar(err);
      })
    } else {
      recusar('parameter for authentication is missing');
    }
  })

};

/* Primeiro passo na autenticação do usuário.
 *
 * @Parametro {opcs} As informação de valores chave das opções do cliente.
 * @Parametro {cd} Função que será chamada.
 */
RotaConexao.prototype.autenticar = function (opcs, cd) {
  var esteObjeto = this;

  try {

    for (var atrb in opcs) {
      if (opcs.hasOwnProperty(atrb)) {
        registrador.debug(atrb + ' -> ' + opcs[atrb]);
      }
    }

    registrador.debug('Inicia o processo de autenticação');
    var autenticacao = this.procurarMetodoAutenticacao(opcs.saslmech);
    if (autenticacao.length > 0) {
      autenticacao[0].autenticar(opcs).then(function (cliente) { // <umdez> na autenticação está faltando acesso aos usuários no banco de dados
        registrador.debug('Clinte xmpp autenticado');

        // Unindo propriedades
        for (var propriedade in cliente) {
          if (cliente.hasOwnProperty(propriedade)) {
            opcs[propriedade] = cliente[propriedade];
          }
        }

        esteObjeto.verificarCliente(opcs).then(function () {
          registrador.debug('Cliente verificado')
          // Chamar depois
          cd(null, opcs);
        }).
        catch(function (err) {
          registrador.error(err);
          cd('user verification failed');
        });

      }).
      catch(function (err) {
        registrador.error('Autenticação do cliente xmpp falhou' + err);
        cd('xmpp could not authenticate user');
      });

    } else {
      // throw error
      registrador.error('Não foi possivel manipular %s', opcs.saslmech);
      cd(new Error('user not found'));
    }

  } catch (err) {
    registrador.error(err.stack);
    cd(new Error('user not found'));
  }
};

/* Realizamos aqui o registro de novo usuário.
 *
 * @Parametro {opcs} As informação de valores chave das opções do cliente.
 * @Parametro {cd} Função que será chamada.
 */
RotaConexao.prototype.registrar = function (opcs, cd) {
  // Não está implementado, mas é relevante apenas para servidor.
  registrador.debug('Registrar usuário');
  
  var err = new Error('not allowed');
  err.code = 123;
  err.type = 'abort';
  cd(err);
};

/* Comunicação de entrada
 */
RotaConexao.prototype.manipular = function (stanza) {

  // Verifica se nós temos o endereço do remetente
  if (!stanza.attrs.to) {
    stanza.attrs.to = new JID(stanza.attrs.from).getDomain();
  }

  registrador.debug('emitir evento stanza: ' + stanza.toString());
  this.emit('stanza', stanza);
};

/* Comunicação de saida
 */
RotaConexao.prototype.enviar = function (stanza) {
  var enviado = false
  try {
    // registrador.debug('Entregar:' + stanza.root().toString());
    var esteObjeto = this;

    if (stanza.attrs && stanza.attrs.to) {
      var destinatarioJid = new JID(stanza.attrs.to);

      // Envia para todos clientes locais, também verifica se tem o JID.
      if (esteObjeto.secoes.hasOwnProperty(destinatarioJid.bare().toString())) {
        // Agora percorre todas as seções em laço e somente envia para o(s) JID(s) correto(s).
        var fonte;
        for (fonte in esteObjeto.secoes[destinatarioJid.bare().toString()]) {
          if (destinatarioJid.bare().toString() === destinatarioJid.toString() || destinatarioJid.resource === fonte) {
            registrador.debug('enviando mensagem para a fonte: ' + fonte);
            esteObjeto.secoes[destinatarioJid.bare().toString()][fonte].send(stanza);
            enviado = true;
          }
        }

        // Não foi possível enviar a stanza.
        if (!enviado) {
          registrador.error(stanza.root().toString() + ' Não pode ser entregue');
        }
      } else {
        registrador.warn('Não pôde ser entregue a stanza: ' + stanza.toString());
      }
    }
  } catch (err) {
    registrador.error(err.stack);
  }

  return enviado;
};

/* Registra uma rota (A conexão de um cliente JID)
 */
RotaConexao.prototype.registrarRota = function (jid, cliente) {
  try {
    registrador.debug('Registrado cliente ' + jid);
    // Afazer: Verificar por conflitos
    if (!this.secoes.hasOwnProperty(jid.bare().toString())) {
      this.secoes[jid.bare().toString()] = {};
    }

    this.secoes[jid.bare().toString()][jid.resource] = cliente;
  } catch (err) {
    registrador.error(err.stack);
  }
  return true;
};

/* Desregistra uma rota (A conexão de cliente JID)
 */
RotaConexao.prototype.desregistrarRota = function (jid) {
  try {
    registrador.debug('desregistrar jid ' + jid);
    if (jid && jid.bare()) {
      if (this.secoes.hasOwnProperty(jid.bare().toString())) {
        delete this.secoes[jid.bare().toString()][jid.resource];
      }
    }
  } catch (err) {
    registrador.error(err.stack);
  }

  return true;
};

/* Retorna a lista de JIDs conectados a um JID especifico.
 */
RotaConexao.prototype.clientesConectadosPorJid = function (jid) {
  try {
    jid = new JID(jid);
    if (!this.secoes.hasOwnProperty(jid.bare().toString())) {
      return [];
    } else {
      var jids = [];
      var fontes = this.secoes[jid.bare().toString()];
      for (var fonte in fontes) {
        if (fontes.hasOwnProperty(fonte)) {
          jids.push(new JID(jid.bare().toString() + '/' + fonte));
        }
      }
      return jids;
    }
  } catch (err) {
    registrador.error(err.stack);
    return [];
  }
};

RotaConexao.prototype.conecta = function (jid, stream) {
  try {
    if (jid) {
      this.registrarRota(jid, stream);
      this.emit('connect', jid);
    }
  } catch (err) {
    registrador.error(err);
  }
};

RotaConexao.prototype.desconecta = function (jid, stream) {
  try {
    this.desregistrarRota(jid, stream);
    this.emit('disconnect', jid);
  } catch (err) {
    registrador.error(err.stack);
  }
};

RotaConexao.prototype.verificarStanza = function (stream, stanza) {
  try {
    // Verificar xmpp stanza
    var erro = VerificarXmpp.remetenteInvalido(stream, stanza);

    if (erro) {
      registrador.warn(erro);
      // cliente.error(error);
    }

    // Despacha stanza para rota
    this.manipular(stanza);

  } catch (err) {
    registrador.error(err.stack);
  }
};

/* Pega um stream e registra manipulação para os eventos
 * @Parametro {stream} Um stream do node-xmpp.
 */
RotaConexao.prototype.registraStream = function (stream) {

  this.contador++;

  registrador.debug('registrar novo stream ' + this.contador);

  var esteObjeto = this;

  // Permite ao desenvolvedor autenticar usuários da forma que quiser.
  stream.on('authenticate', function (opcs, cd) {
    esteObjeto.autenticar(opcs, cd);
  });

  // Permite ao desenvolvedor aceitar e registrar o JID da forma que quiser.
  stream.on('register', function (opcs, cd) {
    esteObjeto.registrar(opcs, cd);
  });

  // Eventos de socket advinda de uma conexão node-xmpp
  stream.on('end', function () {
    // Conexão foi finalizada, e então fechada.
    // @veja http://nodejs.org/api/net.html#net_event_end
    registrador.debug('Conexão do cliente fechada');
  });

  stream.on('online', function () {
    registrador.debug('ONLINE: ' + stream.jid.toString());
    // despacha o evento para a rota
    esteObjeto.conecta(stream.jid, stream);
  });

  stream.on('close', function () {
    // Despacha evento para a rota
    esteObjeto.desconecta(stream.jid, stream);
  });

  stream.on('stanza', function (stanza) {
    registrador.debug('mensagem recebida : ' + stanza.toString());
    esteObjeto.verificarStanza(stream, stanza);
  });

  // Eventos base da rota
  stream.on('connect', function () {
    esteObjeto.contador--;
    esteObjeto.conecta(stream.jid, stream);
  });

  stream.on('disconnect', function () {
    esteObjeto.desconecta(stream.jid, stream);
  });

};

RotaConexao.prototype.desregistraStream = function () {
  // Afazer: Implementar este método.
};

// Adiciona multiplas gerencias de conexões
RotaConexao.prototype.adcGerenciaConexao = function (gerConex) {
  registrador.debug('Carregado gerência de conexão: ' + gerConex.nome);

  // Guarda a gerencia de conexões
  this.gerenciaConexao.push(gerConex);

  // Anexao aos eventos da conexão e despacha eles para o gerente de rotas.
  var esteObjeto = this;
  gerConex.on('connect', function (stream) {
    esteObjeto.registraStream(stream);
  });
  
  // Adiciona o registro de eventos para este gerente de conexões.
  this.registradorEventos.adcRegistroEventosPara(gerConex);
  
};

// Encerra o gerente de conexões
RotaConexao.prototype.pararConexoes = function () {
  registrador.info('Encerradas todas as conexões');

  for (var i = 0, l = this.gerenciaConexao.length; i < l; i++) {
    this.gerenciaConexao[i].shutdown();
  }
};

module.exports = RotaConexao;