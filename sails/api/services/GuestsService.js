'use strict';

function guestObject(guest) {
  return {
      agenda: guest.agenda,
      guest: guest.guest
  };
}

// Retorna um guest de uma determinada agenda. -> Usado para validar se existe na agenda.
function findGuest(guest, agendaID, callback) {
  Guests.findOne({
    guest: guest,
    agenda: agendaID
  }).exec(function(err, guest) {
    if (err) {
      return callback(err);
    } else if (!guest) {
      return callback('Convidado não encontrado');
    } 
    return callback(null, guest);
  });
};

function findAndDelete(guest, agendaID, callback) {
  Guests.find({
    guest: guest,
    agenda: agendaID
  }).exec(function(err, guest) {
    if (err) {
      return callback(err);
    } else if (!guest) {
      return callback('Convidado não encontrado');
    } 
    return callback(null, guest);
  });
};

// Retorna todos os guests de uma agenda.
function findGuestForAgenda(agendaID, callback) {
  Guests.find({
    agenda: agendaID
  }).exec(function(err, guest) {
    if (err) {
      return callback(err);
    } else if (!guest) {
      return callback('Convidado não encontrado');
    } 
    return callback(null, guest);
  });
};

// Remove um guest de uma agenda.
function removeGuest(id, callback) {
  Guests.destroy({
    id: id
  }).exec(function(err, guest) {
    if (err) {
      return callback(err);
    }
    if (!guest) {
      return callback('Convidado não encontrada');
    }
    return callback(null, guest);
  });
};

// Altera o status do aceite do cliente para a agenda, basta passar o true/false pelo objeto guest.
function updateGuest (guestID, agendaID, guest, callback) {
  Guests.update({
    guest: guestID,
    agenda: agendaID
  },
  guest, // Novo objeto o qual será atualizado.
  function (err, guest) {
   if (err) {
      return callback(err);
    }
    if (!guest) {
      return callback('Convidado não encontrado');
    }    
    return callback(null, guest);	
  }); 
};

module.exports = {
  findGuestForAgenda: findGuestForAgenda,
  findAndDelete: findAndDelete,
  findGuest: findGuest,
  removeGuest: removeGuest,
  updateGuest: updateGuest,
  guestObject: guestObject
};