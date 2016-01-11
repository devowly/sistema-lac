# Servidor
Contêm a parte do servidor do nosso aplicativo. O nosso servidor irá fornecer os serviços de rotas REST, armazenamento e também o serviços XMPP para a nossa visão.

#### Como configurar?
É necessário apenas editar o arquivo '/configuracao/configuracao.js' setando as diretivas de acordo com o seu ambiente. 

#### Como iniciar?
Para iniciar o servidor você deve executar o comando 'node iniciar.js' no diretório raiz /sistema-lac/servidor/. 

#### Nossos diretórios
Temos aqui a divisão dos diretórios em 3 arquivos principais. listamos eles abaixo:
* /servidor/ferramentas/ (Contêm ferramentas diversas para auxiliar no desenvolvimento, testes e manutenção do nosso servidor).
* /servidor/fonte/ (Contêm tudo que for necessário para o servidor, incluindo armazenamento e também o serviço REST).
* /servidor/utilitarios/ (Contêm utilitarios diversos para o nosso servidor).
