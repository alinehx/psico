'use strict';

function Register (guests) {
  var errors = [];
  if (!guests.agenda) {
    errors.push('Agenda é obrigatória');
  }
  if (!guests.guest) {
    errors.push('Convidado é obrigatória');
  }
  errors = validateStructGuest(guests, errors);
  return errors;
};

var propertiesGuests = [
  'agenda',
  'guest'
]

function validateStructGuest(obj, error) { 
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
  validateStructGuest: validateStructGuest
}
