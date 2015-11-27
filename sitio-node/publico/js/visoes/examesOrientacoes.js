'use strict'

/* @arquivo examesOrientacoes.js */

/* Versão 0.0.1-Beta
 */

Visao.ExamesOrientacoes = Backbone.View.extend({

  // União dos dados carregados do banco de dados.
  exameOrientacaoUniaoDB: [],

  // Aqui armazenamos a lista do templante de modais que contem as orientações de cada exame.
  listaModais: [],
  
  initialize: function () {
    
  },

  carregarTemplantesModais: function(cd) {
    
    var visoes = [];   // Cada modal possui uma visão que é o conteúdo em html.
    var esteObj = this;
    
    var exames = this.model.models;  // Necessitamos dos modelos de exames desta coleção
    var quantidadeExames = exames.length;
    var exameJson = null;
    
    // Para cada um dos nossos exames
    for (var ca = 0; ca < quantidadeExames; ca++) {
      
      // Transforma em JSON para podermos manipular e acessar as propriedades do modelo.
      exameJson = exames[ca].toJSON();
      
      var orientacoes = exames[ca].exameOrientacoes.models;
      var quantidadeOrientacoes = orientacoes.length;
      
      for (var cb = 0; cb < quantidadeOrientacoes; cb++) {
         var orientacaoJson = orientacoes[cb].toJSON();
        
         // Pegamos o nome da nossa visão
         var nomeElemento = orientacaoJson.nome_elemento;
         
         // Vai armazenar o nome de cada uma das visões em visoes[i].
         visoes[ca] = nomeElemento;
         
         // Para cada visão iremos armazenar aqui os templantes.
         this.listaModais[nomeElemento] = {};
      }
    }
     
    // Procura no diretorio pagsOrientacoesExames os templates dos modais e os carrega, salvando-os na listaModais.
    // Logo após carregados nós chamamos o método render().
    Global.utilitarios.carregarTemplantesDinamicamente(this.listaModais, 'pagsOrientacoesExames/', visoes, function(){
      esteObj.render(cd);
    });
  },
  
  render: function (cd) {
    
    // Renderiza este template
    $(this.el).html(this.template());
    
    var esteObj = this;
    var exames = this.model.models; // Os modelos de exames desta coleção
    var ind = 0;
    
    // Percorremos todos os exames.
    _.each(exames, function(exame) {
      
      // Armazenamos em JSON para podermos manipulalo e ter acesso a suas propriedades.
      var exameJson = exame.toJSON();
      
       // Para cada um dos exames temos orientação
       _.each(exame.exameOrientacoes.models, function(exameOrientacao) {
         
         // Armazenamos em json para podermos manipula-lo e ter acesso as suas propriedades.
         var exameOrientacaoJson = exameOrientacao.toJSON();
         
         // Armazenamos o templante.
         exameOrientacaoJson.minha_visao = esteObj.listaModais[exameOrientacaoJson.nome_elemento];  
         
         // Contem a união dos dados necessarios para carregar os dados dos templantes.
         var exameOrientacaoUniaoLocal = {
           nome: exameJson.nome,                               // Nome do exame. Exemplo: 1,25 DIHIDROXI VITAMINA D3.
           pagina_html: exameOrientacaoJson.pagina_html,       // Página html desta orientação para exame. Exemplo: orientacao0001.html
           nome_elemento: exameOrientacaoJson.nome_elemento,   // Nome do elemento html utilizado para esta orientação. Exemplo: orientacao0001
           minha_visao: exameOrientacaoJson.minha_visao,
           indice: ind                                         // Indice deste exame
         };
           
         ind++;
         
         // Armazenamos os dados ao nivel global para serem utilizados por outros métodos
         esteObj.exameOrientacaoUniaoDB.push(exameOrientacaoUniaoLocal);
         
         // Adicionamos as linhas da tabela
         $('tbody#corpoTabelaExamesOrientacoes', esteObj.el).append(new Visao.ExameLinhaTabela({model: exameOrientacaoUniaoLocal}).render().el); 
         
         // Adicionamos o XML dos modais.
         $('div#orientacoesExmModais', esteObj.el).append(new Visao.ExameOrientacaoModal({model: exameOrientacaoUniaoLocal}).render().el); 
         
       });
    });
    
    cd(this);
  }

});

/* @Elemento
 *  <tr>
 *    <td>1,25 DIHIDROXI VITAMINA D3</td>
 *     <td>
 *         <button type="button" class="btn btn-success btn-sm" aria-label="Right Align" data-toggle="modal" data-target="#ModalExemplo1">
 *           Ver as instruções deste exame <span class="glyphicon glyphicon-modal-window"></span> 
 *         </button>
 *     </td>
 *  </tr>
 */
Visao.ExameLinhaTabela = Backbone.View.extend({

  tagName: 'tr',
  
  initialize: function () {
    
  },

  render: function () {
    
    var meuModelo = this.model;
    
    // Coluna do nome do exame.    
    var colunaNomeExame = '<td>'+ meuModelo.nome +'</td>';
    
    // Coluna de orientação do exame.
    var colunaOrientacaoExame = '<td>';
    
    // Botão
    var botaoOrientacao = '<button type="button" class="btn btn-success btn-sm" aria-label="Right Align" data-toggle="modal" data-target="#'+ meuModelo.nome_elemento +'">';
    botaoOrientacao += 'Ver as instruções deste exame <span class="glyphicon glyphicon-modal-window"></span> ';
    botaoOrientacao += '</button>';
    
    // Adicionamos o botão nessa coluna
    colunaOrientacaoExame += botaoOrientacao; 
    colunaOrientacaoExame += '</td>';
    
    var colunas = colunaNomeExame + colunaOrientacaoExame;
 
    // Adicionamos as duas colunas nesta linha
    $(this.el).append(colunas);
     
    return this;
  }

}); 
 
/* @Elemento:
 * <div class="modal fade" id="ModalExemplo1" tabindex="-1" role="dialog" aria-labelledby="ModalExemplo1Etiqueta"> </div>
 *
 * @Carrega:
 * 
 *  <div class="modal-dialog" role="document">
 *    <div class="modal-content">
 *      <div class="modal-header" style="border-color: #5cb85c; color: #5cb85c;">
 *        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
 *        <h4 class="modal-title" id="ModalExemplo1Etiqueta">Orientações para o exame</h4>
 *      </div>
 *      <div class="modal-body">
 *        <p>Material: Sangue. </p>
 *        <p>
 *          Preparo:
 *          <ul>
 *            <li> Jejum de 8 horas. </li>
 *            <li> Informar medicamentos em uso. </li>
 *          </ul>
 *        </p>
 *      </div>
 *      <div class="modal-footer" style="border-color: #5cb85c;">
 *        <button type="button" class="btn btn-success" data-dismiss="modal">Fechar</button>
 *      </div>
 *    </div>
 *  </div>
 *     
**/ 
Visao.ExameOrientacaoModal = Backbone.View.extend({
  tagName: 'div',
  
  initialize: function () {
    
    $(this.el).addClass('modal'); 
    $(this.el).addClass('fade'); 
    $(this.el).attr('role', 'dialog');
    $(this.el).attr('tabindex', '-1');
  },

  render: function () {
    var meuModelo = this.model;
  
    $(this.el).attr('id', meuModelo.nome_elemento);
    $(this.el).attr('aria-labelledby', meuModelo.nome_elemento);
    

    // Carregamos o templante
    $(this.el).html(meuModelo.minha_visao.template(meuModelo));
    
    return this;
  }

});