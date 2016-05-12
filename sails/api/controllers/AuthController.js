'use strict';
module.exports = {
  login: function(req, res) {
    var email = req.params.email,
       passwordUser = req.params.password;
          
    if (!email || !passwordUser) {
      return res.status(403).send({
        message: 'Email e Senha são obrigatórios'
      });
    } else {      

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
        password.comparePassword(passwordUser, user.password, function(err, success) {
          if (err) {           
            return res.status(503).send(err);
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

//sei o que é vamo debugar so pra confirmar 