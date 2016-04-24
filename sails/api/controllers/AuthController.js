'use strict';
var findUserByEmail = function(email, sendPassword, callback) {
  User.findOneByEmail(email, function(err, foundUser) {
    if (!foundUser) {
      var error = {
        status: 401,
        message: 'Usuário não encontrado'
      };
      return callback(error, null);
    } else {
      if(sendPassword === null) {
        var error = {
          status:  409,
          message: 'Usuário já cadastrado'
        };
        return callback(error, null);
      } else {
        password.comparePassword(sendPassword, foundUser.password, function(err, success) {
          if (err) {
            var error = {
              status: 503,
              message: err.message
            };
            return callback(error);
          } else {
            if (success) {
              return callback(null, foundUser);
            }
          }
        })
      }
    }
  })
}
module.exports = {
    login: function(req, res) {
      var email = req.body.email;
      var sendPassword = req.body.password;
      if (!email || !password) {
        return res.status(401).send({
          message: 'Email e Senha são obrigatórios'
        });
      }
      findUserByEmail(email, sendPassword, function(err, user) {
        if (err) {
          return res.status(err.status).send({
            message: err.message
          });
        } else {
          createSendToken(user, res);
        }
      });
    },
    register: function(req, res) {
      var email = req.body.email;
      var password = req.body.password;
      if (!email || !password) {
        return res.status(401).send({
          message: 'Email e senha não obrigatórios'
        });
      } else {
        findUserByEmail(email, null, function(err, user) {
          if (err && err.message === 'Usuário não encontrado') {
              User.create({
                email: email,
                password: password
              }).exec(function(err, user) {
                if (err) {
                  return res.status(403);
                } else {
                  createSendToken(user, res);
                }
              });
          }else {
            return res.status(409).send({
              message: 'Email já cadastrado'
            });
          }
          
        })
      }
    }
}