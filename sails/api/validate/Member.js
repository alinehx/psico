'use strict';

//é o que pe aceito no body acho q se ta passando algo q n tem ai vamos ver  OH DEIXA EU MOSTRA :d
var propertiesMember = [
  'email',
  'name',
  'gender',
  'phone',
  'zipCode',
  'numberAddress',
  'active'
];



function verifyBody(member) {
  var errors = [];
  
  if(!member.email) {
    errors.push('Email é obrigatório');  
  }  
  if (!member.name) {
    errors.push('Nome é obrigatório');  
  }  
  if(!member.gender) {
    errors.push('Sexo é obrigatório');
  }
  if(!member.phone) {
    errors.push('Telefone é obrigatório');
  }
  if(!member.zipCode) {
    errors.push('CEP é obrigatório');
  }
  if(!member.numberAddress) {
    errors.push('Número do endereço é obrigatório');
  }
  var errors = validateStructMember(member, errors);
  return errors;
}

function validateStructMember(obj, error) { 
  Object.keys(obj).forEach(function(key) {    
    if( propertiesMember.indexOf(key) === -1) {
      error.push('Propriedade ' +key+ ' não faz parte dos atributos de membro');
    }
  });
  return error;
}

function verifyEmail(email) {
  if (!email) {
    return false;
  } else {
    return true;
  }
};



module.exports = {
  validateStructMember : validateStructMember,
  verifyBody: verifyBody,
  verifyEmail: verifyEmail
}