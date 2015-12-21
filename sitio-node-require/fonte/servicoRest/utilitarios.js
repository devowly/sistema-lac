var bcrypt = require('bcrypt-nodejs');

var utilitarios = {
  inicializar: null,
  verificarSenha: null
};

utilitarios.inicializar = function(bancoDados) {
   this.bd = bancoDados;
};

utilitarios.verificarUsuario = function(moduloNome, usuario, senha, cd) {
  var i = this.bd;
  var dadosUsuario = null;
  //bcrypt.compare(password, this.password, function(err, isMatch) {
  //  if (err) return cb(err);
  //  cb(null, isMatch);
  //});
  cd(true, dadosUsuario);
};

module.exports = utilitarios;