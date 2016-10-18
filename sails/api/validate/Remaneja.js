'use strict';

function Register (remaneja) {
  var errors = [];
  if (!remaneja.agenda) {
    errors.push('Agenda é obrigatória');
  }
  if (!remaneja.target) {
    errors.push('Target é obrigatória');
  }
  if (!remaneja.owner) {
    errors.push('Source é obrigatória');
  }
  errors = validateStructRemaneja(remaneja, errors);
  return errors;
};

var propertiesGuests = [
  'agenda',
  'target',
  'owner',
  'resp',
  'status'
]

function validateStructRemaneja(obj, error) { 
  Object.keys(obj).forEach(function(key) {    
    if(propertiesGuests.indexOf(key) === -1) {
      error.push('Propriedade ' +key+ ' não faz parte dos atributos do Guests');
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
  validateStructRemaneja: validateStructRemaneja
}
