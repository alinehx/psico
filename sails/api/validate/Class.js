'use strict';


function verifyBody (classBody) {
  var error = [];
  if (!classBody.name) {
    error.push('Nome é obrigatório');
  }
  if(!classBody.location) {
   error.push('Localização é obrigatória')
  }
  if(!classBody.typeClass) {
    error.push('Tipo de classe é obrigatório');
  }
  if(!classBody.size) {
    error.push('Tamanho é obrigatório');
  }
  if(!classBody.description) {
    error.push('Descrição é obrigatório')
  }
  return error;
};

function update(allValues) {
  
  if(!allValues || allValues.indexOf('&') === -1) {
    return false;
  }
  return allValues.split('&');
  
}




module.exports = {
  verifyBody: verifyBody,
  update: update
}


