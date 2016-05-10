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
  errors = valideStructUser(user, errors);
  return errors;
};

var propertiesUser = [
  'email',
  'password',
  'name',
  'crp',
  'phone',
  'zipCode',
  'active'
]


function valideStructUser(obj, error) { 
  Object.keys(obj).forEach(function(key) {    
    if( propertiesUser.indexOf(key) === -1) {
      error.push('Propriedade ' +key+ ' não faz parte dos atributos de usuário');
    }
  });
  return error;
}




function Email(email) {
   if (!email) {
     return false;
   } else {
     return true;
   }
 }


module.exports = {
  Register: Register,
  Email: Email,
  valideStructUser: valideStructUser
}
