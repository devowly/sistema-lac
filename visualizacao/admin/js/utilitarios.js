'use strict'

/* Versão 0.0.1-Beta
 * - Armazenado as variaveis das visões para a variavel global window.Visao. (4b8b93591a770d86e67f00fca33e90acb45a9e46) [FEITO]
 * - Desenvolver o método carregarArquivosXml. (issue #20) [AFAZER]
 */

define([
  'jquery' 
, 'underscore'
, 'backbone'
], function($, _, BackBone){
  
  /* @Função carregarTemplantes().
   *
   * Carrega assincronamente os templates encontrados em arquivos .html separados.
   * Depois de carregado ele chama a função cd().
   *
   * @Parametro {Pilha} [visoes] Lista contendo o nome das visões a serem carregadas.
   * @Parametro {Função} [cd] Chamda logo após todas as visões forem carregadas.
   */
  var carregarTemplantes = function(visoes, cd) {

    var deferidos = [];
    
    $.each(visoes, function(indice, visao) {
      if (window.Visao[visao]) {
        deferidos.push($.get('templantes/Visao.' + visao + '.html', function(dados) {
          window.Visao[visao].prototype.template = _.template(dados);
        }));
      } else {
        console.log(visao + ' não foi encontrado');
      }
    });

    $.when.apply(null, deferidos).done(cd);
  };
  
  /* @Função carregarTemplantesExtras().
   *
   * Carrega assincronamente o(s) template(s) encontrado(s) em arquivos .html separados do diretorio informado.
   * Ele armazena em cada objeto da lista um template. Depois de carregado ele chama a função cd().
   * Este método é designado para uso daquelas visões que precisam carregar mais arquivos quando não utiliza o banco de dados.
   * É interessante usa-lo pois isso faz o desenvolvimento ser mais produtivo porque não precisamos adicionar modelos e coleções e 
   * também faz com que não seja necessário carregar dados para o banco de dados.
   *
   * @Parametro {Pilha} [lista] Aqui, serão salvos os arquivos de templante carregados.
   * @Parametro {Texto} [diretorio] O nome do diretorio onde os arquivos de templante estão armazenados.
   * @Parametro {Pilha} [visoes] Contêm o nome das visões a serem carregadas.
   * @Parametro {Função} [cd] Será chamada logo após serem carregadas todas as visões.
   */
  var carregarTemplantesExtras = function(lista, diretorio, visoes, cd) {

    var deferidos = [];
 
    $.each(visoes, function(indice, visao) {
      if (lista[visao]) {
        deferidos.push($.get('templantes/' + diretorio + 'Visao.' + visao + '.html', function(dados) {
          lista[visao].template = _.template(dados);
        }));
      } else {
        console.log(visao + ' não foi encontrado');
      }
    });

    $.when.apply(null, deferidos).done(cd);
  };
  
  /* @Função carregarColecaoAninhada(). 
   *
   * Carrega apenas as coleções aninhadas de um determinado modelo. Ele não carrega as coleções dos sub-níveis.
   *
   * @Parametro {Objeto} [colecao] Uma coleção de modelos.
   * @Parametro {Pilha} [colecoesAninhadas] Aquelas coleções aninhadas aos modelos de uma coleção.
   * @Parametro {Função} [cd] Será chamada quando se estiver carregado todas colecoes aninhadas.
   */
  var carregarColecaoAninhada = function(colecao, colecoesAninhadas, cd) { 
    
    var quantidadeModelos = colecao.models.length;               // Quantidade de modelos desta colecao.
    var quantidadeColecoesAninhadas = colecoesAninhadas.length;  // Quantidade de coleções que cada modelo possui.
    
    // Para cada modelo
    for (var ca = 0; ca < quantidadeModelos; ca++) {
      var modelo = colecao.models[ca];
      
      // Para cada modelo temos colecao aninhada.
      for (var cb = 0; cb < quantidadeColecoesAninhadas; cb++) {
        
        var colecaoAninhada = colecoesAninhadas[cb];
        
        if (modelo[colecaoAninhada]) {
          modelo[colecaoAninhada].fetch({
            async: false, success: function() {}
          , error: function(colecao, resp, opcs){ console.log('carregarColecaoAninhada(): Não foi possivel carregar dados para a coleção aninhada.') }
          });  
        }
      }
    }
    // Quando carregarmos todas as coleções aninhadas, chamamos cd().
    cd();
  };
  
  /* @Função carregarTodasColecoesAninhadasSinc().  
   *
   * Carrega *todas* as coleções aninhadas de um determinado modelo de forma recursiva.
   *
   * @Parametro {Pilha} [colecoes] Contêm um conjunto de coleções.
   * @Parametro {Função} [cd] Chamada logo após aquelas coleções aninhadas serem totalmente carregadas.
   */
  var carregarTodasColecoesAninhadasSinc = function(colecoes, cd) {
     var esteObj = this;
     
    // Sempre que houver mais coleções nós iremos continuar a carregar
    if (colecoes) {
      var listaColecoesParaCarregar = [];   // Iremos carregar cada uma das colecoes aninhadas a estas colecoes.
      var quantidadeModelos = 0;            // Quantos modelos cada coleção possui?
      var quantidadeColecoesAninhadas = 0;  // Quantas coleções cada um dos modelos possui?
      
      // Para cada uma das nossas coleções nós teremos um número de modelos.
      for (var ca = 0; ca < colecoes.length; ca++) {
        
        // para esta coleção, qual a quantidade de modelos?
        quantidadeModelos = (colecoes[ca] && colecoes[ca].models ? colecoes[ca].models.length : 0);
        
        // Vamos percorrer os modelos de cada uma das coleções
        for (var cb = 0; cb < quantidadeModelos; cb++) {
          
          // Agora nós acessamos a quantidade de coleções que cada um dos modelos possui.
          quantidadeColecoesAninhadas = (colecoes[ca].models[cb].colecoesAninhadas ? colecoes[ca].models[cb].colecoesAninhadas.length : 0);
          
          for (var cc = 0; cc < quantidadeColecoesAninhadas; cc++) {
            var colecoesAninhadas = colecoes[ca].models[cb].colecoesAninhadas;
            
            // Armazenamos as coleções que serão carregadas.
            listaColecoesParaCarregar.push(colecoes[ca].models[cb][colecoesAninhadas[cc]]);
          }  
        }
      }
      
      var quatTotalColecoes = listaColecoesParaCarregar.length;  // Quantas coleções temos para carregar
      
      // Se nenhum modelo possui coleção, então retornamos.
      if (quatTotalColecoes === 0) cd();  
      
      for (var ca = 0; ca < quatTotalColecoes; ca++) {
        if (listaColecoesParaCarregar[ca]) {
          listaColecoesParaCarregar[ca].fetch({
            async: false, success: function() { }
          , error: function(colecao, resp, opcs){
            console.log('carregarTodasColecoesAninhadasSinc(): Não foi possivel carregar dados para a coleção aninhada.') }
          });  
        }
      }
      
      // Chama este método recursivamente passando a lista de coleções carregadas.
      carregarTodasColecoesAninhadasSinc(listaColecoesParaCarregar, cd);
    } else {
      // Aqui nós não temos mais coleções para carregar. Então retornamos.
      cd(); 
    }  
  };
  
  /* @Função carregarColecaoSinc(). 
   *
   * Carrega a coleção e depois todas as suas coleções aninhadas de forma sincrona.
   *
   * @Parametro {Pilha} [colecoes] Contêm aquele conjunto de coleções que serão carregadas.
   * @Parametro {Função} [cd] Chamada logo após as coleções serem carregadas.
   */
  var carregarColecaoSinc = function(colecoes, cd) {
    
    if (colecoes.length === 0) {
      console.log('carregarColecaoSinc(): É necessário informar uma lista de colecões');
      cd(); 
    } 
    
    // Percorremos todas aquelas coleções e as carregamos.
    // Lembre-se que estamos carregando de formas sincrona.
    for (var ca = 0; ca < colecoes.length; ca++) {
      colecoes[ca].fetch({
        async: false, success: function() { }
      , error: function(colecao, resp, opcs){ console.log('carregarColecaoSinc(): Não foi possivel carregar dados para a coleção.') }
      });
    }
    // Agora nós iremos carregar as coleções aninhadas a estas coleções que já carregamos.
    carregarTodasColecoesAninhadasSinc(colecoes, cd); 
  };
  
  /* @Função carregarTodasColecoesAninhadasAssinc().  
   *
   * Carrega *todas* as coleções aninhadas de um determinado modelo de forma recursiva e assincrona.
   *
   * @Parametro {Pilha} [colecoes] Contêm um conjunto de coleções.
   * @Parametro {Função} [cd] Chamada logo após aquelas coleções aninhadas serem totalmente carregadas.
   */
  var carregarTodasColecoesAninhadasAssinc = function(colecoes, cd) {
    
    // se houver mais coleções
    if (colecoes) {
      var listaColecoesParaCarregar = [];        // Iremos carregar cada uma das colecoes aninhadas a estas colecoes.
      var quantidadeColecoes = colecoes.length;  // Quantas coleções nós possuimos
      var quantidadeModelos = 0;                 // Quantos modelos cada coleção possui?
      var quantidadeColecoesAninhadas = 0;       // Quantas coleções cada um dos modelos possui?
      
      // Para cada uma das nossas coleções nós teremos um número de modelos.'
      for (var ca = 0; ca < quantidadeColecoes; ca++) {
        
        // para esta coleção, qual a quantidade de modelos?
        quantidadeModelos = (colecoes[ca] && colecoes[ca].models ? colecoes[ca].models.length : 0);
        
        // Vamos percorrer os modelos de cada uma das coleções
        for (var cb = 0; cb < quantidadeModelos; cb++) {
        
          // Agora nós acessamos a quantidade de coleções que cada um dos modelos possui.
          quantidadeColecoesAninhadas = (colecoes[ca].models[cb].colecoesAninhadas ? colecoes[ca].models[cb].colecoesAninhadas.length : 0);
          
          for (var cc = 0; cc < quantidadeColecoesAninhadas; cc++) {
            var colecoesAninhadas = colecoes[ca].models[cb].colecoesAninhadas;
            
            // Armazenamos as coleções que serão carregadas.
            listaColecoesParaCarregar.push(colecoes[ca].models[cb][colecoesAninhadas[cc]]);
          }  
        }
      }
      
      var quatTotalColecoes = listaColecoesParaCarregar.length;  // Quantas coleções temos para carregar
      
      if (quatTotalColecoes === 0) { cd() };  // Se nenhum modelo possui coleção, então retornamos.
      
      // Ao concluirmos o carregamento, nós chamamos este método novamente passando a lista de coleções carregadas.
      var aoConcluirCarregamentoDaColecoes = function() { carregarTodasColecoesAninhadasAssinc(listaColecoesParaCarregar, cd) };
      
      // Quando carregarmos todas as coleções, chamamos aoConcluirCarregamentoDaColecoes()
      var contarCarregamentos = _.after(quatTotalColecoes, aoConcluirCarregamentoDaColecoes);
      
      for (var ca = 0; ca < quatTotalColecoes; ca++) {
        if (listaColecoesParaCarregar[ca]) {
          listaColecoesParaCarregar[ca].fetch({
            async: true, success: contarCarregamentos
          , error: function(colecao, resp, opcs) { console.log('carregarTodasColecoesAninhadasAssinc(): Não foi possivel carregar dados para a coleção aninhada.') }
          });  
        }
      }
    } else {
      cd(); // Não temos mais coleções, retornar.
    }
  };
  
  /* @Função carregarColecaoAssinc(). 
   *
   * Carrega a coleção e depois todas as suas coleções aninhadas de forma assincrona.
   *
   * @Parametro {Pilha} [colecoes] Contêm aquele conjunto de coleções que serão carregadas.
   * @Parametro {Função} [cd] Chamada logo após as coleções serem carregadas.
   */
  var carregarColecaoAssinc = function(colecoes, cd) {
    
    var quantidadeColecoes = colecoes.length;
    
    if (quantidadeColecoes === 0) {
      console.log('carregarColecaoAssinc(): É necessário informar uma lista de colecões');
      cd(); 
    } 
    
    // Depois de concluirmos o carregar estas coleções nós agora carregaremos todas coleções aninhadas.
    var aoConcluirCarregamentoDaColecoes = function() { carregarTodasColecoesAninhadasAssinc(colecoes, cd) }
    
    // Quando carregarmos todas as coleções, chamamos aoConcluirCarregamentoDaColecoes()
    var contarCarregamentos = _.after(quantidadeColecoes, aoConcluirCarregamentoDaColecoes);
   
    // Aqui nós carregamos todas as coleções.
    for (var ca = 0; ca < quantidadeColecoes; ca++) {
      colecoes[ca].fetch({
        async: true, success: contarCarregamentos
      , error: function(colecao, resp, opcs){ console.log('carregarColecaoAssinc(): Não foi possivel carregar dados para a coleção.') }
      });
    }
  }; 
  
  /* @Função carregarArquivosXml(). 
   *
   * Responsavel por carregar arquivos xml.
   */
  var carregarArquivosXml = function() {

  };

  return { 
    carregarTemplantes: carregarTemplantes
  , carregarTemplantesExtras: carregarTemplantesExtras
  , carregarColecaoAninhada: carregarColecaoAninhada
  , carregarColecaoAssinc: carregarColecaoAssinc
  , carregarColecaoSinc: carregarColecaoSinc
  , carregarArquivosXml: carregarArquivosXml
  };
});