'use strict';

function Register (constants) {
  var errors = [];
  if (!constants.constantType) {
    errors.push('Agenda é obrigatória');
  }
  if (!constants.constantValue) {
    errors.push('Target é obrigatória');
  }
  errors = validateStructConstants(constants, errors);
  return errors;
};

var propertiesConstants = [
  'constantType',
  'constantValue'
]

function validateStructConstants(obj, error) { 
  Object.keys(obj).forEach(function(key) {    
    if(propertiesConstants.indexOf(key) === -1) {
      error.push('Propriedade ' +key+ ' não faz parte dos atributos de Constantes');
    }
  });
  return error;
}

function ID(id) {
   if (!id) {
     return false;
   } else {
     return true;
   }
 }

module.exports = {
  Register: Register,
  ID: ID,
  validateStructConstants: validateStructConstants
}
