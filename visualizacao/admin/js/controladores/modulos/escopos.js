'use strict'

/*
 * @arquivo escopos.js
 */ 

/* Versão 0.0.1-Beta
 */
 
define([
  'jquery'
, 'backbone'
, 'underscore'
, 'controladores/modulos/bandeiras'
], function($, Backbone, _, Bandeiras){
  
  /* @Utilitario Escopos().
   *
   --------------------------------------------------------------------------------------*/
  var Escopos = function() {
    
    this.bandeiras = new Bandeiras();
    
   /* @Propriedade {Pilha} [escopos] Uma lista com todos os escopos que requisitaremos as bandeiras. 
    * Cada um dos escopos oferece acesso a uma rota REST dependendo da bandeira. Por exemplo., 
    * o escopo 'Exame' possuirá acessos CRUD. Para saber se possuimos algum acesso qualquer
    * iremos encontrar isso nas bandeiras deste escopo.
    */
    this.escopos = [ ];
    this.escopos['Exame'] = { 'bandeira': parseInt(0, 16) };
    this.escopos['Convenio'] = { 'bandeira': parseInt(0, 16) };
    this.escopos['Unidade'] = { 'bandeira': parseInt(0, 16) };
    
    this.inicializar();
  };

  Escopos.prototype.inicializar = function() {
    
  };
  
  /* @Método {Publico} carregarAsBandeirasDoModulo(). Realiza para cada modulo o carregamento das 
   * suas bandeiras. Lembre-se que um modulo pode ter bandeiras com acesso, valores e ações únicos.
   *
   */
  Escopos.prototype.carregarAsBandeirasDoModulo = function(listaDeBandeiras) {
    for (var ca = 0; ca < listaDeBandeiras.length; ca++) {
      this.bandeiras.adcUmaBandeiraParaModulo(
        listaDeBandeiras[ca].modulo, listaDeBandeiras[ca].modelo, listaDeBandeiras[ca].acao
      , listaDeBandeiras[ca].acesso, listaDeBandeiras[ca].valor
      );  
    }
    return true;
  };
  
  /* @Método [Publico] pegarValorDaBandeiraPelasAcoes(). 
   *
   * Pega o valor das bandeiras associadas a determinadas ações. Aceita várias ações em simultaneo.
   * Retorna a adição do valor das bandeiras destas determinadas ações.
   *
   * @Parametro {Texto} [modulo] O nome do modulo que possui as bandeiras. Por exemplo: 'exames'.
   * @Parametro {Texto} [modelo] O modelo que possui as bandeiras.
   * @Parametro {Pilha} [acoes] As ações de acesso requisitado. Por exemplo 'Listar' ou 'Criar'.
   * @Retorna {Número} Soma das bandeiras das ações informadas.
   */
  Escopos.prototype.pegarValorDaBandeiraPelasAcoes = function(modulo, modelo, acoes) {
    return this.bandeiras.pegarValorDaBandeiraPelasAcoes(modulo, modelo, acoes);
  };
  
  /* @Método [Publico] sePossuiAcesso(). 
   *
   * Verificamos aqui as bandeiras de acesso a este determinado modulo e seu modelo.
   *
   * @Parametro {Texto} [modulo] O modulo que possui as bandeiras.
   * @Parametro {Texto} [modelo] O modelo que possui as bandeiras.
   * @Parametro {Pilha} [acoes] As ações de acesso requisitado. Por exemplo 'Listar' ou 'Criar'.
   * @Retorna {falso|verdadeiro} falso se não houver acesso, verdadeiro caso contrário.
   */
  Escopos.prototype.sePossuiAcesso = function(modulo, modelo, acoes, valor) {
    return this.bandeiras.sePossuiAcesso(modulo, modelo, acoes, valor);
  };
  
  /* @Método {Publico} manipularOsEscopos().
   *
   * Podemos aqui manipular os nossos escopos. Isso é importante porque os escopos podem mudar 
   * dinamicamente, sendo assim, temos que verificar a cada acesso os escopos. Isso vai oferecer
   * mais uma camada de proteção ao nosso aplicativo.
   *
   * @Parametro {Pilha} [escopos] Uma pilha contendo cada escopo e o valor da bandeira.
   * @Parametro {Função} [cd] Chamada depois que a manipulação dos escopos terminar.
   */
  Escopos.prototype.manipularOsEscopos = function(escopos, cd) {
    if (escopos && escopos.length) {
      // Aqui manipulamos os escopos. Isso é necessário porque os escopos poderão ser
      // modificados dinamicamente.
      for (var ca = 0; ca < escopos.length; ca++) {
        if (this.escopos[escopos[ca].modelo]) {
          this.escopos[escopos[ca].modelo].bandeira = escopos[ca].bandeira;
        }
      }
      cd(false, escopos);
    } else {
      // Retornamos que não houve erro algum, mas o usuário possui escopo vazio. Isso
      // significa que o nosso usuário possui apenas acesso as rotas de livre acesso.
      cd(false, escopos);
    }
  };
  
  /* @Método {Publico} requisitarOsEscopos().
   *
   * Utilizamos isso sempre que necessário. Nós iremos verificar os escopos e o o estado atual de 
   * autenticação do usuário. Isso é de importancia crucial porque verifica mudanças nos acessos 
   * a escopos aumentando significativamente a segurança do nosso aplicativo. Assim iremos montar 
   * a nossa visão com base nestes resultados.
   *
   * @Parametro {Função} [cd] Chamada depois da requisição dos escopos e a verificação da sessão
   * retornar.
   */
  Escopos.prototype.requisitarOsEscopos = function(cd) {

    Aplicativo.eventos.trigger('controlador:escopos:requisicao:carregar:escopos', (function(erro, escopos) {
      
      if (erro) {
        // Lembre-se que se este erro for de validação, provavelmente a visão do usuário será modificada
        // para que o usuário consiga se autenticar novamente.
        console.log('Escopos: Erro ao requisitar carregamento dos escopos.');
        
        // Retornamos os valores sem modificação alguma. Fica a cargo do método que chamou verificar se
        // houve erro e tomar a decisão com base nesta resposta.
        cd(erro, escopos);
      } else {
        /* Lembre-se que se houver algum erro os escopos serão apenas um pilha vazia, fazendo com que o usuário
         * acesso somente aqueles escopos com bandeira de livre acesso.
         * Caso houver erro na validação de autenticação será apresentado para o usuário uma visão para realizar
         * uma nova entrada. Sendo assim nós apenas manipularemos os escopos em caso de sucesso.
         */
        this.manipularOsEscopos(escopos, cd);
      }
    }).bind(this));
  };
  
  /* @Método {Publico} sePossuiAcessoAoEscopo().
   *
   * Verificaremos aqui se o usuário possui realmente acesso a o escopo.
   *
   * @Parametro {Texto} [modulo] O nome do modulo.
   * @Parametro {Texto} [modelo] O nome do modelo.
   * @Parametro {Pilha} [acoes] Contêm as ações.
   * @Parametro {Pilha} [livre] Contêm as bandeiras de livre acesso.
   * @Parametro {Função} [cd] Chamada depois que a requisição de acesso terminar.
   */
  Escopos.prototype.sePossuiAcessoAoEscopo = function(modulo, modelo, acoes, livre, cd) {
    
    // Inicialmente iremos requisitar os nossos escopos.
    this.requisitarOsEscopos((function(erro, escopos) {
      var seSim = false;
      
      // Aqui nós iremos verificar se o acesso a este escopo é livre. Fazemos isto porque uma rota livre 
      // é sempre publica e não requer nenhum privilegio.
      seSim = this.sePossuiAcesso(modulo, modelo, acoes, this.pegarValorDaBandeiraPelasAcoes(modulo, modelo, livre));
      
      if (seSim) {
        // A rota é livre.
        cd(seSim);
      } else if (erro) {
        // Um erro pode significar diversas coisas, uma delas é que a verificação da sessão do usuário
        // não deu certo. De qualquer forma se houver qualquer erro nós apenas impedimos o usuário
        // de acessar esta rota, porque ela não é livre e requer bandeira de acesso.
        cd(seSim);
      } else {
        // Aqui significa que a rota não é livre e que não ha erro algum. Por isso nós iremos verificar
        // as bandeiras de acesso do usuário para determinado escopo.
        seSim = this.sePossuiAcesso(modulo, modelo, acoes, ((this.escopos && this.escopos[modelo]) ? this.escopos[modelo].bandeira : parseInt(0, 16)));
        cd(seSim);
      }
      
    }).bind(this));
  };
  
  /* @Método [Publico] remBandeiraParaUmModulo(). 
   *
   * Remove da lista de bandeiras todos os dados de determinado modulo.
   *
   * @Parametro {Texto} [modulo] O modulo que possui as bandeiras.
   * @Retorna {verdadeiro|falso} Verdadeiro em caso de sucesso. Falso se não houve sucesso.
   */
  Escopos.prototype.remBandeiraParaUmModulo = function(modulo) {
    // return this.bandeiras.removerBandeiraParaUmModulo(modulo);
  };
  
  return Escopos;
});