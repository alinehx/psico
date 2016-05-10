'use strict';
module.exports = {
  login: function(req, res) {
    var email = req.body.email;
    var sendPassword = req.body.password;
    if (!email || !password) {
      return res.status(401).send({
        message: 'Email e Senha são obrigatórios'
      });
    }
    UserService.findUser(email, function(err, user) {
      if (err) {
        return res.status(err === 'Usuário não encontrado' ? 404 : 503).send({
          message: err
        });
      } else if (user.active === false) {
        return res.status(409).send({
          message: 'Usuário desativado'
        });
      }
      password.comparePassword(sendPassword, user.password, function(err, success) {
        if (err) {
          var error = {
            status: 503,
            message: err.message
          };
          return callback(error);
        } else {
          if (success) {
            createSendToken(user, res);
          }
        }
      });
    });
  }
}