var bcrypt = require('bcrypt-nodejs');

var utilitarios = {
  verificarSenha: function(usuario, senha, cd) {
    //bcrypt.compare(password, this.password, function(err, isMatch) {
    //  if (err) return cb(err);
    //  cb(null, isMatch);
    //});
    cd(true);
  }
};

module.exports = utilitarios;