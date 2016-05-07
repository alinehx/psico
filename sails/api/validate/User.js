'use strict';

function Register (user) {
  var errors = [];
  if (!user.email) {
    errors.push('E-mail é obrigatório');
  }
  if (!user.password) {
    errors.push('Senha é obrigatória');
  }
  if (!user.name) {
    errors.push('Nome é obrigatório');
  }
  if (!user.crp) {
    errors.push('CRP é obrigatório');
  } 
  if (!user.phone) {
    errors.push('Telefone é obrigatório');
  }
  if(!user.zipCode) {
    errors.push('Cep é obrigatório');
  }
  return errors;
};



module.exports = {
  Register: Register
}
