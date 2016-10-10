'use strict';

function Register (hour) {
  var errors = [];
  if (!hour.date) {
    errors.push('Agenda é obrigatória');
  }
  if (!hour.hour) {
    errors.push('Target é obrigatória');
  }
  errors = validateStructHour(hour, errors);
  return errors;
};

var propertiesHour = [
  'date',
  'hour',
  'available',
  'agenda'
]

function validateStructHour(obj, error) { 
  Object.keys(obj).forEach(function(key) {    
    if(propertiesHour.indexOf(key) === -1) {
      error.push('Propriedade ' +key+ ' não faz parte dos atributos de Horarios');
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
  validateStructHour: validateStructHour
}
