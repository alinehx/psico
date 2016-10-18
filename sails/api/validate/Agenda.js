'use strict';

function Register (agenda) {
  var errors = [];
  if (!agenda.roomID) {
    errors.push('Sala é obrigatória');
  }
  if (!agenda.date) {
    errors.push('Data é obrigatória');
  }
  if (!agenda.initTime) {
    errors.push('Hora de Inicio é obrigatória');
  }
  if (!agenda.endTime) {
    errors.push('Hora de Fim é obrigatória');
  }
  if (!agenda.responsable) {
    errors.push('Responsavel é obrigatório');
  }
  if (!agenda.subject) {
    errors.push('Assunto é obrigatório');
  }
  if (!agenda.description) {
    errors.push('Descrição é obrigatória');
  }
  if (!agenda.type) {
    errors.push('Tipo é obrigatório');
  }
  if (!agenda.timecreation) {
    errors.push('TimeCreation é obrigatório');
  }
  if (!agenda.guestQuantity) {
    errors.push('Quantidade é obrigatória');
  }
  if (!agenda.active) {
    errors.push('Active é obrigatório');
  }
  errors = valideStructAgenda(agenda, errors);
  return errors;
};

var propertiesAgenda = [
  'roomID',
  'date',
  'initTime',
  'endTime',
  'responsable',
  'subject',
  'description',
  'type',
  'timecreation',
  'guestQuantity',
  'active'
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
