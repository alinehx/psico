'use strict';

var propertiesClass = [
  'name',
  'location',
  'size',
  'description',
  'price',
  'active'
];

function validateStructClass(obj, error) { 
  Object.keys(obj).forEach(function(key) {    
    if( propertiesClass.indexOf(key) === -1) {
      error.push('Propriedade ' +key+ ' não faz parte dos atributos de sala');
    }
  });
  return error;
}

function verifyBody (classBody) {
  var error = [];
  if (!classBody.name) {
    error.push('Nome é obrigatório');
  }
  if(!classBody.location) {
   error.push('Localização é obrigatória')
  }
  if(!classBody.size) {
    error.push('Tamanho é obrigatório');
  }
  if(!classBody.price) {
    error.push('Preço é obrigatório')
  }
  if(!classBody.description) {
    error.push('Descrição é obrigatória')
  }
  error = validateStructClass(classBody, error);
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
  update: update,
  validateStructClass: validateStructClass
}