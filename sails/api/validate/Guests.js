'use strict';

function Register (guests) {
  var errors = [];
  if (!guests.agenda) {
    errors.push('Agenda é obrigatória');
  }
  if (!guests.guest) {
    errors.push('Convidado é obrigatória');
  }
  if (!guests.accepted) {
    errors.push('Aceite é obrigatório');
  }
  errors = valideStructUser(agenda, errors);
  return errors;
};

var propertiesGuests = [
  'agenda',
  'guest',
  'accepted'
]


function valideStructGuest(obj, error) { 
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
  valideStructGuest: valideStructGuest
}
