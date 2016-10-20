'use strict';
module.exports = {
  login: function(req, res) {
    var email = req.params.email,
       passwordUser = req.params.password;
          
    if (!email || !passwordUser) {
      sails.log.warn("Mail and Password are not filled.");
      return res.status(403).send({
        message: 'Email e Senha são obrigatórios'
      });
    } else {      

      UserService.findUser(email, function(err, user) {
        if (err) {
          sails.log.warn("User "+ email +" not found.");
          return res.status(err === 'Usuário não encontrado' ? 404 : 503).send({
            message: err
          });
        } else if (user.active === false) {
          sails.log.warn("User "+ email +" is not activated.");
          return res.status(409).send({
            message: 'Usuário desativado'
          });
        }
        password.comparePassword(passwordUser, user.password, function(err, success) {
          if (err) {
            console.log('User entered a wrong password');
            return res.status(503).send(err);
          } else {
            if (success) {
              sails.log.info("User "+ email +" logged in.");
              createSendToken(user, res);
            }
          }
        });
      });
    }
  }
}