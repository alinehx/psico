'use strict';
module.exports = {
  login: function(req, res) {
    var allValues = req.params.id,
      email, password;
          
    if (!allValues || allValues.indexOf('&') === -1) {
      return res.status(403).send({
        message: 'Email e Senha são obrigatórios'
      });
    } else {
      allValues = allValues.split('&');
      email = allValues[0];
      password = allValues[1];

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
}