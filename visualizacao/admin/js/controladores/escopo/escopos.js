'use strict'

/* Aqui realizamos a requisição dos escopos de determinado usuário que realizou entrada.
 *
 * @arquivo escopos.js
 */ 

/* Versão 0.0.1-Beta
 * - Adc. caracteristica de apresentação das visões de admin com base no escopo. (issue #50) [AFAZER]
 */
 
define([
  'jquery'
, 'backbone'
, 'utilitarios'
], function($, Backbone, Utilitarios){
  
  /* @Controlador Escopos().
   *
   * Aqui nós vamos requisitar os escopos do usuário logo que ele realizar a entrada no painel.
   * Cada rota REST possui diversas bandeiras de acesso para os escopos.
   * Assim a gente vai saber quais são as bandeiras que este usuário possui para um determinado
   * escopo.
   *
   * @Parametro {Modelo} [ModeloSessao] É a sessão do usuário. Utilizaremos sempre que necessário 
   *                                    para verificar o estado atual de validação do usuário. 
   --------------------------------------------------------------------------------------------*/
  var Escopos = function(ModeloSessao) {
    var esteObjeto = this;
    
    /* @Propriedade {Modelo} [modeloSessao] Armazena o modelo de sessão do nosso 
     * usuário. */
    this.modeloSessao = ModeloSessao;
    
    /* @Propriedade {Pilha} [escopos] Armazena os escopos de determinado usuário 
     * que acaba de realizar a entrada. */
    this.escopos = null;
    
    /* Evento disparado sempre que for necessário requisitar os escopos e realizar a validação
     * da sessão do usuário. Geralmente uma outra parte do código pode necessitar que seja
     * requisitado para manipular a visão apresentada ao usuário. Por exemplo, se a sessão
     * estiver expirada então devemos manipular para que o usuário não possua acesso a determinadas
     * visões e ações. */
    Aplicativo.eventos.on('controlador:escopos:requisicao:carregar:escopos', function(cd) {
      this._carregarOsEscopos(cd);
    }, this);
    
    /* Evento disparado quando o usuário tiver realizado a saida com sucesso. */
    Aplicativo.eventos.on('modelo:sessao:usuario:fora', function() {
      this.escopos = null;
    }, this);
    
    /* Evento disparado sempre que a rota for modificada assim nós podemos 
     * recarregar os escopos deste usuário ou fazer outras coisas. */
    Aplicativo.eventos.on('roteador:rota:modificada', function() {
      
    }, this);
    
  };
  
  /* @Método [Privado] _carregarOsEscopos().
   *
   * Verificamos o estado de autenticação do usuário e logo após nós recarregamos aqui os 
   * escopos do usuário. Isso poderá ser importante para sempre verificarmos se o usuário ainda 
   * possui determinados escopos porque os escopos podem ser modificados. Além disso verificamos
   * o estato atual da autenticação, caso a validade já passou será apresentada a visão de entrada.
   *
   * @Parametro {Função} [cd] Chamada depois que todos os escopos estiverem recarregados.
   */
  Escopos.prototype._carregarOsEscopos = function(cd) {
    this.escopos = [];

    if (this.modeloSessao && this.modeloSessao.get('auth')) {
      // Antes de requisitarmos os escopos nós teremos que verificar se o usuário está realmente autenticado.
      this.modeloSessao.seAutenticado((function(seValido, resposta) {
        // Lembre-se que caso o usuário não estiver válido a visão de re-autenticação será 
        // mostrada automaticamente. Porque neste caso o valor do auth muda e assim a visão muda também.
        if (seValido) {
          // Limpa todos modelos desta coleção.
          if (this.modeloSessao.escopos) this.modeloSessao.escopos.reset();
          // Caso tudo ocorra bem e o usuário tiver sua sessão validada, então, nós iremos acessar a coleção de escopos.
          Utilitarios.carregarColecaoAssinc([this.modeloSessao.escopos], (function(){
            // Percorremos cada um dos modelos deste escopo:
            for(var ca = 0; ca < this.modeloSessao.escopos.length; ca++){          
              /* Veja que cada modelo de escopo possui o nome do modelo (tabela) no banco de dados
               * e também o valor da bandeira de acesso. Com estes valores em mãos nós podemos *montar*
               * aqui a nossa interface do usuário. */
              var escopo = {
                'modelo': this.modeloSessao.escopos.models[ca].get('model')
              , 'bandeira': parseInt(this.modeloSessao.escopos.models[ca].get('flag'), 16)
              };
              this.escopos.push(escopo);
            }
            // Retornamos todos os escopos com sucesso.
            cd(false, this.escopos);
          }).bind(this)); 

        } else {
          /* Aqui temos uma ocorrencia inesperada porque o usuário não é validado. Geralmente neste 
           * caso esperamos que o usuário re-faça sua entrada. Provavelmente quando chegar aqui
           * A visão de requisição de entrada já estará sendo apresentada para o cliente. */
          cd(true, this.escopos); 
        }
      }).bind(this));
    } else {
      // É dificil de acreditar que um usuário esteja requisitando os escopos e nem mesmo possui uma sessão.
      cd(true, this.escopos); 
    }
  };
  
  return Escopos;
});