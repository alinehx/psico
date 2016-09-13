'use strict';

function Register (agenda) {
  var errors = [];
  if (!agenda.date) {
    errors.push('Data é obrigatória');
  }
  if (!agenda.timestamp) {
    errors.push('Timestamp é obrigatória');
  }
  if (!agenda.responsable) {
    errors.push('Reponsable é obrigatório');
  }
  if (!agenda.room) {
    errors.push('Room é obrigatória');
  }
  if (!agenda.type) {
    errors.push('Type é obrigatório');
  }
  if (!agenda.subject) {
    errors.push('Assunto é obrigatório');
  }
  if (!agenda.description) {
    errors.push('Descrição é obrigatória');
  }
  errors = valideStructAgenda(agenda, errors);
  return errors;
};

var propertiesAgenda = [
  'date',
  'timestamp',
  'responsable',
  'room',
  'type',
  'subject',
  'description'
]

function valideStructAgenda(obj, error) { 
  Object.keys(obj).forEach(function(key) {    
    if(propertiesAgenda.indexOf(key) === -1) {
      error.push('Propriedade ' +key+ ' não faz parte dos atributos da Agenda');
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
  valideStructAgenda: valideStructAgenda
}
