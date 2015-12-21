var bcrypt = require('bcrypt-nodejs');

var utilitarios = {
  inicializar: null,
  verificarSenha: null
};

utilitarios.inicializar = function(bancoDados) {
   this.bd = bancoDados;
};

utilitarios.verificarSenha = function(usuario, senha, cd) {
  var i = this.bd;
  //bcrypt.compare(password, this.password, function(err, isMatch) {
  //  if (err) return cb(err);
  //  cb(null, isMatch);
  //});
  cd(true);
};

module.exports = utilitarios;