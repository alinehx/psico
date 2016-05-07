'use strict';
var bcrypt = require('bcrypt-nodejs');

function comparePassword(passwordSend, passwordUser, callback) {  
  bcrypt.compare(passwordSend, passwordUser, function (err, valid) {
    
    if(err) {
      var error = {
        status: 403,
        message: 'Erro ao comparar as senhas'
      };
      return callback(error);
    }

    if(!valid) {
      var error = {
        status: 403,
        message: 'Usuário ou senha inválidos'
      }
      callback(error);
    }
    callback(null, valid);
  }); 
}

function generatePasswordWithBcrypt(password, callback) {
    bcrypt.genSalt(10, function (err, salt) {
    if (err) {      
      return callback(err);
    }
    bcrypt.hash(password, salt, null, function (err, hash) {
      if(err) {      	
        return callback(err);
      }      
      return callback(null, hash);
    })
  });
}
module.exports = {
  comparePassword : comparePassword,
  generatePasswordWithBcrypt: generatePasswordWithBcrypt
}