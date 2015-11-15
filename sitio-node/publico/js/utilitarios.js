'use strict'

window.utilitarios = {

  // Carrega assincronamente os templates encontrados em arquivos .html separados.
  // Depois de carregado ele chama a função cd().
  carregaTemplantes: function(visoes, cd) {

    var deferidos = [];

    $.each(visoes, function(indice, visao) {
      if (window[visao]) {
        deferidos.push($.get('templantes/' + visao + '.html', function(dados) {
            window[visao].prototype.template = _.template(dados);
        }));
      } else {
        alert(visao + " não foi encontrado");
      }
    });

    $.when.apply(null, deferidos).done(cd);
  }
};