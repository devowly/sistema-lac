'use strict'

/* Versão 0.0.1-Beta
 * - Armazenado as variaveis das visões para a variavel global window.Visao. (4b8b93591a770d86e67f00fca33e90acb45a9e46) [FEITO]
 */

Global.utilitarios = {

  /* @função carregarTemplantes()
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
  
  /* @função carregarTemplantesDinamicamente()
   * @descrição Carrega assincronamente o(s) template(s) encontrado(s) em arquivos .html separados do diretorio informado.
   * Ele armazena em cada objeto da lista um template. Depois de carregado ele chama a função cd().
   * Este método é designado para uso daquelas visões que precisam carregar mais arquivos quando não utiliza o banco de dados.
   * É interessante usa-lo pois isso faz o desenvolvimento ser mais produtivo porque não precisamos adicionar modelos e coleções e 
   * também faz com que não seja necessário carregar dados para o banco de dados.
   */
  carregarTemplantesDinamicamente: function(lista, diretorio, visoes, cd) {

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
  
  /* @funcao carregarColecaoAninhada()
   * @descrição Carrega as coleções aninhadas de um determinado modelo
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
            console.log('Não foi possivel carregar dados para a coleção aninhada.');
          }} );  
        }
      }
    }
  },
  
  /* @função carregarColecao()
   * @Descrição Carrega a coleção e depois as suas coleções aninhadas.
   */
  carregarColecao: function(colecao, colecoesAninhadas, cd) {
    var esteObj = this;
    
    // Carrega esta coleção e depois chama o método de carregar as coleções aninhadas.
    colecao.fetch({success: function(){
      if (colecoesAninhadas) {
        esteObj.carregarColecaoAninhada(colecao, colecoesAninhadas, cd);
      } else {
        cd(); //Não temos coleções aninhadas para carregar.
      }
    }}, {error: function(){
      // <umdez> Como fazer em caso de erro?
      console.log('Não foi possivel carregar dados para a coleção.');
    }} );
  },
  
  /* @função pegarImagemB64()
   * @Descrição retorna uma imagem em base64 para cada nome de arquivo
   */
  pegarImagemB64: function(arquivo) {
    
    // Armazenamos aqui o tipo da imagem e sua representação em base 64
    var imgBase64 = null;
    
    // Percorremos cada uma das imagems
    _.each(Global.IMAGEMS_BASE, function(imagem) {
      
      // Retornamos o valor da imagem de determinado arquivo.
      if (imagem.arquivo === arquivo) {
        imgBase64 = imagem.tipo + ',' + imagem.base64;
      }
    });
    
    return imgBase64;
  }
  
};