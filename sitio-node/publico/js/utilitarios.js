'use strict'

window.utilitarios = {

  // Carrega assincronamente os templates encontrados em arquivos .html separados.
  // Depois de carregado ele chama a função cd().
  carregarTemplantes: function(visoes, cd) {

    var deferidos = [];

    $.each(visoes, function(indice, visao) {
      if (window[visao]) {
        deferidos.push($.get('templantes/' + visao + '.html', function(dados) {
          window[visao].prototype.template = _.template(dados);
        }));
      } else {
        console.log(visao + " não foi encontrado");
      }
    });

    $.when.apply(null, deferidos).done(cd);
  },
  
  /* Carrega assincronamente o(s) template(s) encontrado(s) em arquivos .html separados do diretorio informado.
   * Ele armazena em cada objeto da lista um template.
   * Depois de carregado ele chama a função cd().
   */
  carregarTemplantesVisao: function(lista, diretorio, visoes, cd) {

    var deferidos = [];

    $.each(visoes, function(indice, visao) {
      if (lista[visao]) {
        deferidos.push($.get('templantes/' + diretorio + visao + '.html', function(dados) {
          lista[visao].template = _.template(dados);
        }));
      } else {
        console.log(visao + " não foi encontrado");
      }
    });

    $.when.apply(null, deferidos).done(cd);
  }
};