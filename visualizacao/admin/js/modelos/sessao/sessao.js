'use strict'

/* Responsável por lidar com a sessão do usuário.
 *
 * @Arquivo sessao.js
 */

/* Versão 0.0.1-Beta 
 * - Adicionar a coleção aninhada dos escopos para o modelo de sessão. (issue #42) [FEITO] 
 * - Adicionar modelo de sessão para lidar com a sessão atual do usuário. (issue #37) [FEITO]
 */
 
define([
  'jquery'
, 'underscore'
, 'backbone'
, 'codigos'
, 'nesting'
, 'colecoes/escopos/escopos'
], function($, _, Backbone, CodigosDeResposta, nesting, ColecaoEscopos) {
  
 /* Os modelos são a parte central de um aplicativo, contendo os dados e também uma parte longa de toda logica que a cerca:
  * Conversões, validações, propriedades e controle de acesso. Um modelo possue funcionalidades básicas para a gerencia dos dados.
  *
  * Alguns dos métodos dos modelos são listados abaixo.
  *
  * fetch   (União dos dados já obtidos com os novos do banco de dados)
  * save    (Salva o modelo)
  * destroy (Deleta o modelo)
  * get     (Requisita o valor de um atributo de um modelo) 
  * sync    (Faz persistir o estado de um modelo para com o servidor. Pode ser substituido com algum método customizado) 
  *
  * @veja http://backbonejs.org/#Model
  */
   
 /* Para a *comunicação* entre este modelo e as rotas REST utilizaremos, além dos estados, códigos que irão fornecer informações que ajudarão
  * a nossa parte cliente manipular estes valores com mais facilidade.
  * Um exemplo simples seria o de um código do tipo INFO que poderia estar informando que a senha informada não confere, então podemos
  * alertar o usuário de uma forma mais simples para ele entender o que está acontecendo no serviço REST.
  * Os tipos base que iremos utilizar serão o 'INFO', 'SUCESSO' e também o 'ERRO'. Dividimos estes códigos nestes três (3) grupos principais.
  * Lembre-se que cada um dos grupos possui um nível de gravidade. O grupo 'ERRO' possuirá a gravidade maior seguido do 'INFO' e o 'SUCESSO'
  * sendo de menor gravidade.
  */
  
  // Os códigos de informação são:
  CodigosDeResposta.adicionarUmCodigo('INFO', 'SENHA_INVALIDA', '001', 'A senha está incorreta ou não foi informada.'); 
  CodigosDeResposta.adicionarUmCodigo('INFO', 'JID_INVALIDO', '002', ' O Jid informado não confere.'); 
  CodigosDeResposta.adicionarUmCodigo('INFO', 'JID_SENHA_NECESSARIOS', '003', 'O Jid ou a senha não foram informados.'); 
  CodigosDeResposta.adicionarUmCodigo('INFO', 'TOKEN_NECESSARIO', '004', 'O token é necessário de ser informado.'); 
  CodigosDeResposta.adicionarUmCodigo('INFO', 'TOKEN_EXPIRADO', '005', 'O token está expirado.'); 
  CodigosDeResposta.adicionarUmCodigo('INFO', 'SESSAO_ENCERRADA', '006', 'A sessão foi encerrada.'); 
  CodigosDeResposta.adicionarUmCodigo('INFO', 'SERVICO_NAO_DISPONIVEL', '007', 'O serviço ainda está indisponível.'); 
  
  // Os códigos de sucesso são:
  CodigosDeResposta.adicionarUmCodigo('SUCESSO', 'USUARIO_AUTENTICADO', '101', 'O usuário foi autenticado com sucesso.'); 
  CodigosDeResposta.adicionarUmCodigo('SUCESSO', 'TOKEN_VALIDADO', '102', 'O token é valido e pode ser utilizado nas requisições seguintes.'); 
  
  // Os códigos de erro são:
  CodigosDeResposta.adicionarUmCodigo('ERRO', 'TOKEN_NAO_DECODIFICADO', '201', 'Ocorreu algum problema ao decodifica-lo.'); 
  CodigosDeResposta.adicionarUmCodigo('ERRO', 'VERIFICACAO_TOKEN', '202', 'Ocorreu algum problema ao verificarmos a validade do token informado.'); 
          
  // Vamos registrar aqui para ajudar nos testes e desenvolvimento.
  // Não é para ser usado na fase final.
  var registro = function(valor) {
    if (!valor) return; 
    var codigo = CodigosDeResposta.procurarUmCodigoPeloValor(valor);
    console.log((codigo ? codigo.msg : 'Codigo não encontrado.'));
  };
  
  /* @Modelo Sessao().
   *
   * Este modelo vai prover métodos para iniciarmos, validarmos e removermos a sessão de um determinado usuário.
   * @Veja https://cdnjs.com/libraries/backbone.js/tutorials/cross-domain-sessions
   *
   * A abordagem que utilizaremos para requisitar dados pelo lado cliente é que, sempre que necessário,
   * Iremos realizar uma requisição GET passando o token para a rota '/session'. Assim a gente descobre 
   * se o usuário está validado e depois utilizamos o token para requisitar as diversas rotas do nosso aplicativo.
   * Se a validação der errado, sabemos que o cliente deverá realizar nova autenticação.
   *
   * Outra abordagem que podemos realizar é utilizarmos cookies seguros, assim as credenciais são enviadas apenas 
   * uma única vez para a criação do token. Logo em seguida o token é armazenado no cookie. Esta abordagem não
   * necessita sobrescrever o método Backbone.sync() para informamos o token em cada requisição.
   *
   * Abaixo listamos algumas dicas de segurança para o nosso sistema de autenticação.
   * - Crie os tokens com uma chave secreta forte, que seja disponivel para acesso SOMENTE pelo serviço de autenticação.
   *   Sempre que utilizarmos um token para autenticar um usuário, devemos verificar que o token foi criado com a nossa chave super secreta.
   * - Iremos encripta os tokens quando necessário passar informações sensiveis. Isso é realizado utilizando JSON Web Encryption(JWE).
   * - Nunca iremos transmitir os tokens por meio de uma conexão não-HTTPS. Ataques do tipo Man in the middle acontecem.
   * - Iremos armazenar os tokens do lado cliente, somente em HTTPS cookies. Isso nos previne de ataques XSS (https://en.wikipedia.org/wiki/Cross-site_scripting).
   *
   * Lembre-se que mesmo utilizando cookies seguros, ainda assim estaremos vulneráveis aos ataques do tipo CSRF
   * Portanto uma boa abordagem é utilizarmos uma estratégia para combater essa vulnerabilidade. 
   * 
   * @Veja https://stormpath.com/blog/token-auth-spa/
   * @Veja https://www.owasp.org/index.php/Cross-Site_Request_Forgery_%28CSRF%29_Prevention_Cheat_Sheet
   ---------------------------------------------------------------------------------------------------------------------------------*/
  var Sessao = Backbone.Model.extend({
    
    /* @Propriedade {Texto} [urlRoot] A URL REST deste modelo. */
    urlRoot: 'sessao',
    
    /* @Propriedade {Texto} [idAttribute] Informa qual dos atributos é o identificador.
     * <umdez> Não é realmente necessário (Porem diminuirá a paranoia). */
    idAttribute: 'id',
    
    /* @Propriedade {Pilha} [colecoesAninhadas] Isso vai ser utilizado para quando formos pegar os dados 
     * das coleções aninhadas pertecentes a este modelo. */
    colecoesAninhadas: [
      'escopos'
    ], 
    
    /* @Construtor initialize().
     *
     * Aqui realizamos o inicio do nosso modelo. 
     */
    initialize: function () {
      this.escopos = nestCollection(this, 'escopos', new ColecaoEscopos(this.get('escopos')));
    },
    
   /* Abaixo iremos realizar os diversos métodos para iniciar, validar e remover uma determinada sessão.
    * Cada requisição feita vai retornar estatus de sucesso ou erro. Iremos utilizar em geral alguns estados
    * que listamos abaixo:
    *
    * - [estatus 200] Tudo certo. Estado padrão para informar que a requisição ocorreu com exito.
    * - [estatus 401] Não autorizado. Quando a autenticação é requerida e falhou ou dados necessários não foram providos.
    * - [estatus 400] Uma requisição errada. O servidor não pode ou não vai processar a requisição porque houve um erro no cliente (ex., sintaxe de requisição mau formada).
    * - [estatus 403] Acesso proibido. Retornamos este valor sempre que o acesso a uma fonte é proibida.
    * - [estatus 404] Não encontrado. A fonte requisitada não pode ser encontrada mas pode ser disponível no futuro.
    * - [estatus 500] Erro interno no servidor. Uma mensagem generica, disparada quando uma condição não esperada foi encontrada.
    *
    * @Veja https://en.wikipedia.org/wiki/List_of_HTTP_status_codes
    * @Veja http://expressjs.com/en/guide/error-handling.html
    *
    * As rotas disponíveis serão:
    * - POST /sessao/  (Para realizarmos o inicio de uma sessão).
    * - GET /sessao/  (Para validarmos uma sessão).
    * - DELETE /sessao/  (Para o usuário encerrar uma sessão já existente).
    * - GET /sessao/:identificadorDoUsuario/escopos/  (Para receber o valor dos escopos de um determinado usuário).
    * - GET /escopos/  (Para pegar o valor dos escopos de determinado usuário).
    *
    * Devemos lembrar que se estivermos utilizando cookies a sessão do usuário irá funcionar em todas as janelas de um mesmo navegador.
    */
    
   /* @Método [Público] entrar().
    *
    * Responsável por realizar a entrada do usuário. Informando o seu jid e senha pelo método POST. 
    * Se tudo correr bem o usuário terá seu token de acesso para realização de requisições as rotas do serviço.
    *
    * @Parametro {Objeto} [credenciais] As credenciais necessárias para a requisição de um token. Geralmente composto de jid e senha.
    * @Parametro {Texto} [credenciais.jid] O Jabber ID do usuário. Composto por local@dominio.
    * @Parametro {Texto} [credenciais.senha] A senha do usuário.
    * @Parametro {Função} [cd] É chamada logo após recebermos a resposta.
    */
    entrar: function(credenciais, cd) {
      var esteObjeto = this;
      
      // Envia um POST para a rota '/sessao/' e realiza a entrada.
      this.save(credenciais, {
        success: function (modelo, resposta) {
         /* Caso a entrada seja um sucesso e o usuário receba o seu token, então é necessário agora que
          * seja acrescentado no método Backbone.sync() uma forma de adicionar o nosso token nos
          * cabeçalhos das nossas próximas requisições.
          *
          * @Veja http://www.sitepoint.com/using-json-web-tokens-node-js/
          *
          * Nós podemos agora utilizar cookies seguros, isso faz com que não seja mais necessário sobrescrever
          * o método Backbone.sync(). Sendo assim, enviamos um POST com as nossas credenciais, e o token
          * será armazenado numa sessão segura e a cada nova requisição serão acessados os dados pela sessão.
          */
          
          /* Acrescentamos a URL dos escopos aqui, porque é aqui que recebemos o nosso id, e logo após isto
           * nós podemos informar que o escopo está pronto para ser acessado. É desta forma que iremos requisitar
           * o escopo do usuário.
           */
          esteObjeto.escopos.url = 'sessao/' + esteObjeto.id + '/escopos';
          esteObjeto.set({scope: true});  // Escopo pronto para ser requisitado.
        
          registro(resposta.code);
        
          cd(true, resposta);
        },
        error: function (modelo, resposta) {
          registro(resposta.code);
          esteObjeto.set({scope: false});
          cd(false, resposta);
        }
      });
    },
    
    /* @Método [Público] sair().
     *
     * Responsável por sair da sessão. Até o momento não é possível revogar o token pelo lado servidor,
     * por causa disso, nós temos que fazer uma forma de manipular isso aqui do lado cliente, provavelmente,
     * removendo os cookies e apresentando novamente um formulário onde o usuário possa realizar nova entrada.
     */
    sair: function() {
      var esteObjeto = this;
      
      // Envia um DELETE para a rota '/sessao/:id' e limpa os dados do lado cliente.
      this.destroy({
        
        /* <umdez> Provavelmente esta rota sempre irá responder com estado (403) informando erro.
         * Isso acontece porque não temos um método de revogar token pelo lado servidor,
         * mas de qualquer forma nós podemos aqui do lado cliente manipular para que
         * seja apresentada uma visão de que o usuário saiu da conta. Além disso,
         * devemos mostrar uma visão onde o usuário possa se re-autenticar.
         * 
         * <umdez> Apesar do que eu já tinha escrito e pensado, esta rota não mais irá retornar estado (403).
         * Eu faço isto porque mesmo que o token (JWT) não possa ser revogado, ele pode ser apagado
         * ao regenerarmos o cookie. Isso já deve ser o bastante. 
         */
        success: function (modelo, resposta) {
          registro(resposta.code);
          // Limpamos o modelo.
          modelo.clear();
          // Muda o valor de auth e scope para false, fazendo com que seja disparado o evento change:auth e o change:scope.
          esteObjeto.set({auth: false});
          esteObjeto.set({scope: false});
        },
        error: function () {
          // Muda o valor de auth e scope para false, fazendo com que seja disparado o evento change:auth e o change:scope.
          esteObjeto.set({auth: false});
          esteObjeto.set({scope: false});
        }
      });      
    },
    
    /* @Método [Público] seAutenticado().
     *
     * Realizamos aqui a validação do nosso token, isso é feito ao enviarmos uma requisição GET
     * para a rota '/sessao'. Caso tudo ocorrer bem a gente vai saber que o nosso token é válido e que não
     * está expirado.
     * Se houver algo errado com o nosso token, por exemplo, se o token está expirado, então devemos
     * manipular para que o usuário possa se re-autenticar.     
     *
     * @Parametro {Função} [cd] Será chamada quando a requisição terminar e receber uma resposta.
     */
    seAutenticado: function(cd) {
      var esteObjeto = this;
        
      /* Este método envolve as rotas, sendo utilizado para a gente manipular a visão do usuário.
       * Mostrando a visão de entrada se o usuário não estiver validado. Antes de iniciarmos qualquer
       * rota vamos ver se o usuário é valido.
       *
       * Enviamos aqui um GET para a rota '/sessao/' se retornar sucesso então nosso token é valido
       * e com este token válido é possível realizarmos novas requisições.
       */
      this.fetch({
        success: function(modelo, resposta) {
          registro(resposta.code);
          
          /* Acrescentamos a URL dos escopos aqui, porque é aqui que recebemos o nosso id, e logo após isto
           * nós podemos informar que o escopo está pronto para ser acessado. É desta forma que iremos requisitar
           * o escopo do usuário.
           */
          esteObjeto.escopos.url = 'sessao/' + esteObjeto.id + '/escopos';
          esteObjeto.set({scope: true});  // Escopo pronto para ser requisitado.
          
          cd(true, resposta);
        },
        error: function(modelo, resposta) {
          registro(resposta.code);
          esteObjeto.set({scope: false});
          cd(false, resposta);
        }
      });
    },
    
    /* @Propriedade {Objeto} [defaults] Contêm os atributos padrões deste modelo de sessao.
     * Lembre-se que estes atributos podem *não* estar armazenados no modelo do banco de dados.
     * Eu utilizo alguns destes atributos fora do modelo para utilizar os eventos.     
     */
    defaults: {
      scope: false   // Utilizaremos este atributo para saber quando o escopo esta pronto para ser acessado.
                     // Lembre-se que este atributo não está na nossa sessão.
    , auth: false    // Caso o usuário esteja autenticado. Se for falso o usuário terá de realizar novamente a entrada.
    , message: null  // A mensagem recebida. A cada requisição iremos receber uma mensagem informando o que aconteceu.
    , code: null     // Codigo informado para que possamos manipular aqui no lado cliente.
    , token: null    // O nosso token que será utilizado para acesso as rotas do serviço. (Não é informado se caso utilizarmos cookies seguros).
    , exp: null      // O tempo, em minutos, que vai levar para o token expirar.
    , id: null       // Identificador do nosso remetente. Este identificador não é nada mais que a chave primária do usuário.
    }
    
  });
  return new Sessao();

});
