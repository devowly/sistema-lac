'use strict'

/* Versão 0.0.1-Beta
 * - Armazenado as variaveis das visões para a variavel global window.Visao. (4b8b93591a770d86e67f00fca33e90acb45a9e46) [FEITO]
 * - Desenvolver o método carregarArquivosXml. [AFAZER]
 */

Global.utilitarios = {

  /* @método carregarTemplantes()
   * @descrição Carrega assincronamente os templates encontrados em arquivos .html separados.
   * Depois de carregado ele chama a função cd().
   */
  carregarTemplantes: function(visoes, cd) {

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
  },
  
  /* @método carregarTemplantesExtras()
   * @descrição Carrega assincronamente o(s) template(s) encontrado(s) em arquivos .html separados do diretorio informado.
   * Ele armazena em cada objeto da lista um template. Depois de carregado ele chama a função cd().
   * Este método é designado para uso daquelas visões que precisam carregar mais arquivos quando não utiliza o banco de dados.
   * É interessante usa-lo pois isso faz o desenvolvimento ser mais produtivo porque não precisamos adicionar modelos e coleções e 
   * também faz com que não seja necessário carregar dados para o banco de dados.
   */
  carregarTemplantesExtras: function(lista, diretorio, visoes, cd) {

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
  },
  
  /* @método carregarColecaoAninhada()
   * @descrição Carrega apenas as coleções aninhadas de um determinado modelo
   * Chama funcao cd() se estiver carregado todas colecoes aninhadas.
   */
  carregarColecaoAninhada: function(colecao, colecoesAninhadas, cd) {
    
    // Quantidade de modelos desta colecao.
    var quantidadeModelos = colecao.models.length;
    
    // Quantidade de coleções que cada modelo possui.
    var quantidadeColecoesAninhadas = colecoesAninhadas.length;
    
    // Quando carregarmos todas as coleções aninhadas, chamamos cd()
    var quantBuscas = _.after(quantidadeModelos * quantidadeColecoesAninhadas, cd);
    
    // Para cada modelo
    for (var ca = 0; ca < quantidadeModelos; ca++) {
      var modelo = colecao.models[ca];
      
      // Para cada modelo temos colecao aninhada.
      for (var cb = 0; cb < quantidadeColecoesAninhadas; cb++) {
        
        var colecaoAninhada = colecoesAninhadas[cb];
        
        if (modelo[colecaoAninhada]) {
          modelo[colecaoAninhada].fetch({success: quantBuscas}, {error: function(){
            // <umdez> Como fazer em caso de erro?
            console.log('carregarColecaoAninhada(): Não foi possivel carregar dados para a coleção aninhada.');
          }} );  
        }
      }
    }
  },
  
  /* @método carregarTodasColecoesAninhadas()
   * @descrição Carrega todas as coleções aninhadas de um determinado modelo
   * Chama funcao cd() se estiver carregado todas colecoes aninhadas.
   */
  carregarTodasColecoesAninhadas: function(colecoes, cd) {
     var esteObj = this;
     
    // se houver mais coleções
    if (colecoes) {
      
      // Iremos carregar cada uma das colecoes aninhadas a estas colecoes.
      var listaColecoesParaCarregar = [];
      
      // Quantas coleções nós possuimos
      var quantidadeColecoes = colecoes.length;  
      
      // Quantos modelos cada coleção possui?
      var quantidadeModelos = 0;
      
      // Quantas coleções cada um dos modelos possui?
      var quantidadeColecoesAninhadas = 0;
      
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
            
            listaColecoesParaCarregar.push(colecoes[ca].models[cb][colecoesAninhadas[cc]]);
            
          }  
        }
      }
      
      // Quantas coleções temos para carregar
      var quatTotalColecoes = listaColecoesParaCarregar.length;
      
      // Se nenhum modelo possui coleção, então retornamos.
      if (quatTotalColecoes === 0) {
        cd(); // Aqui Não temos mais o que fazer.
      } 
      
      var chamarMais = function() {
        // Chama este método novamente passando a lista de coleções carregadas.
        esteObj.carregarTodasColecoesAninhadas(listaColecoesParaCarregar, cd);
      }
      
      // Quando carregarmos todas as coleções, chamamos chamarMais()
      var contarCarregamentos = _.after(quatTotalColecoes, chamarMais);
      
      for (var ca = 0; ca < quatTotalColecoes; ca++) {
        if (listaColecoesParaCarregar[ca]) {
          listaColecoesParaCarregar[ca].fetch({success: contarCarregamentos}, {error: function(){
            // <umdez> Como fazer em caso de erro?
            console.log('carregarTodasColecoesAninhadas(): Não foi possivel carregar dados para a coleção aninhada.');
          }} );  
        }
      }
     
    } else {
      cd(); // Não temos mais coleções, retornar.
    }
        
  },
  
  /* @método carregarColecao()
   * @Descrição Carrega a coleção e depois todas as suas coleções aninhadas.
   */
  carregarColecao: function(colecoes, cd) {
    var esteObj = this;
    
    var quantidadeColecoes = colecoes.length;
    
    if (quantidadeColecoes === 0) {
      console.log('carregarColecao(): É necessário informar uma lista de colecões');
      cd(); //Retornar.
    } 
    
    var chamarMais = function() {
      // Carregaremos todas coleções aninhadas        
      esteObj.carregarTodasColecoesAninhadas(colecoes, cd); 
    }
    
    // Quando carregarmos todas as coleções, chamamos chamarMais()
    var contarCarregamentos = _.after(quantidadeColecoes, chamarMais);
   
    // Carregamos todas as coleções
    for (var ca = 0; ca < quantidadeColecoes; ca++) {
      
      colecoes[ca].fetch({success: contarCarregamentos }, {error: function(){
        // <umdez> Como fazer em caso de erro?
        console.log('carregarColecao(): Não foi possivel carregar dados para a coleção.');
      }} );
    }
    
  },
  
  /* @método pegarImagemB64()
   * @Descrição retorna uma imagem em base64 para cada nome de arquivo em uma lista especificada.
   */
  pegarImagemB64: function(arquivo, lista) {
    
    // Armazenamos aqui o tipo da imagem e sua representação em base 64
    var imgBase64 = null;
    
    // Percorremos cada uma das imagems
    _.each(Global.IMAGEMS_BASE[lista], function(imagem) {
      
      // Retornamos o valor da imagem de determinado arquivo.
      if (imagem.arquivo === arquivo) {
        imgBase64 = imagem.tipo + ',' + imagem.base64;
      }
    });
    
    return imgBase64;
  },
 
  /* @metodo carregarArquivosXml
   *
   * @descricao Responsavel por carregar arquivos xml.
   */
  carregarArquivosXml: function() {

  }
};