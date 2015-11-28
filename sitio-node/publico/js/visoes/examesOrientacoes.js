'use strict'

/* @arquivo examesOrientacoes.js */

/* Versão 0.0.1-Beta
 * - Para cada templante carregado dinamicamento vamos criar uma nova visão. (issue #13)
 * - Remover conteúdo em HTML do código das visões. (issue #12)
 */

/* @Visão ExamesOrientacoes
 *
 * @Descrição Responsável pela apresentação dos exames aceitos por este laboratorio.
 */
Visao.ExamesOrientacoes = Backbone.View.extend({

  // União dos dados carregados do banco de dados.
  exameOrientacaoUniaoDB: [],

  // Aqui armazenamos a lista do templante de modais que contem as orientações de cada exame.
  listaModais: [],
  
  // Armazenamos as linhas da tabela
  listaLinhaTabela: [],
  
  initialize: function () {
    
  },

  carregarTemplantesModais: function(cd) {
    
    var visoes = [];   // Cada modal possui uma visão que é o conteúdo em html.
    var esteObj = this;
    
    var exames = this.model.models;  // Necessitamos dos modelos de exames desta coleção
    var quantidadeExames = exames.length;
    var exameJson = null;
    
    var ind = 0;  // Indice dos exames
    
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
         
         // Contem a união dos dados necessarios para carregar os dados dos templantes.
         var exameOrientacaoUniaoLocal = {
           nome: exameJson.nome,                          // Nome do exame. Exemplo: 1,25 DIHIDROXI VITAMINA D3.
           pagina_html: orientacaoJson.pagina_html,       // Página html desta orientação para exame. Exemplo: orientacao0001.html
           nome_elemento: orientacaoJson.nome_elemento,   // Nome do elemento html utilizado para esta orientação. Exemplo: orientacao0001
           minha_visao: orientacaoJson.minha_visao,
           indice: ind                                    // Indice deste exame
         };
          
         ind++;
         
         // Armazenamos os dados ao nivel global para serem utilizados por outros métodos
         esteObj.exameOrientacaoUniaoDB.push(exameOrientacaoUniaoLocal);
         
         // Armazenamos cada uma das linhas
         this.listaLinhaTabela[nomeElemento] = new Visao.ExameLinhaTabela({model: exameOrientacaoUniaoLocal});
         
         // Armazenar para depois carregar cada visão modal
         this.listaModais[nomeElemento] = new Visao.ExameOrientacaoModal({model: exameOrientacaoUniaoLocal});
         
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
    
    // Percorremos todos os exames.
    _.each(exames, function(exame) {
      
      // Armazenamos em JSON para podermos manipulalo e ter acesso a suas propriedades.
      var exameJson = exame.toJSON();
      
       // Para cada um dos exames temos orientação
       _.each(exame.exameOrientacoes.models, function(exameOrientacao) {
         
         // Armazenamos em json para podermos manipula-lo e ter acesso as suas propriedades.
         var exameOrientacaoJson = exameOrientacao.toJSON();
         
         var nome_elemento = exameOrientacaoJson.nome_elemento;
         
         // Adicionamos as linhas da tabela
         $('tbody#corpoTabelaExamesOrientacoes', esteObj.el).append(esteObj.listaLinhaTabela[nome_elemento].render().el); 
         
         // Adicionamos o XML dos modais.
         $('div#orientacoesExmModais', esteObj.el).append(esteObj.listaModais[nome_elemento].render().el); 
         
       });
    });
    
    this._iniciarMeusComponentes();
    this._iniciarMinhaEscutaEventos();
    
    cd(this);
  },

  /* @função _iniciarMeusComponentes()
   * @descrição Iniciamos componentes para esta visão. 
   *  Os componentes podem ser do bootstrap, jQuery e outros frameworks utilizados
   */ 
  _iniciarMeusComponentes: function(){
    
  },
  
  /* @função _iniciarMinhaEscutaEventos()
   * @descrição Iniciamos as escutas de eventos para esta visão. 
   *  Os eventos podem ser de elementos do bootstrap, jQuery e outros frameworks utilizados
   */ 
  _iniciarMinhaEscutaEventos: function() {
    
  }

});

/* @Elemento
 *  <tr> </tr>
 *
 * @Carrega
 * <td>1,25 DIHIDROXI VITAMINA D3</td>
 * <td>
 *   <button type="button" class="btn btn-success btn-sm" aria-label="Right Align" data-toggle="modal" data-target="#ModalExemplo1">
 *      Ver as instruções deste exame <span class="glyphicon glyphicon-modal-window"></span> 
 *   </button>
 * </td>
 */
Visao.ExameLinhaTabela = Backbone.View.extend({

  tagName: 'tr',
  
  attributes: {
    
  },
  
  initialize: function () {
    
  },

  render: function () {
    
    var meuModelo = this.model;
    
    $(this.el).html(this.template(meuModelo));
     
    return this;
  }

}); 
 
/* @Visao ExameOrientacaoModal
 *
 * @Elemento:
 * <div class="modal fade" id="ModalExemplo1" tabindex="-1" role="dialog" aria-labelledby="ModalExemplo1Etiqueta"> </div>
 *
 * @Carrega:
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
  
  attributes: {
    'class': 'modal fade',
    'role': 'dialog',
    'tabindex': '-1'
  },
  
  initialize: function () {
    
  },

  render: function () {
    var meuModelo = this.model;
  
    $(this.el).attr('id', meuModelo.nome_elemento);
    $(this.el).attr('aria-labelledby', meuModelo.nome_elemento);

    // Carregamos o templante
    $(this.el).html(this.template(meuModelo));
    
    return this;
  }

});