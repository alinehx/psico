'use strict';

function agendaObject(agenda) {
  return {
    date: agenda.date,
    timestamp: agenda.timestamp,
    responsable: agenda.responsable,
    room: agenda.room,
    type: agenda.type,
    subject: agenda.subject,
    description: agenda.description
  };
}

function findAgenda(id, callback) {
  Agenda.findOne({
    id: id
  }).exec(function(err, agenda) {
    if (err) {
      return callback(err);
    } else if (!agenda) {
      return callback('Agenda não encontrada');
    } 
    return callback(null, agenda);
  });
};

function findAgendaByResponsable(email, callback) {
  Agenda.find({
    responsable: email
  }).exec(function(err, agenda) {
    if (err) {
      return callback(err);
    } else if (!agenda) {
      return callback('Agenda não encontrada');
    } 
    return callback(null, agenda);
  });
};

function removeAgenda(id, callback) {
  Agenda.remove({
    id: id
  }).exec(function(err, agenda) {
    if (err) {
      return callback(err);
    }
    if (!agenda) {
      return callback('Agenda não encontrada');
    }
    return callback(null, agenda);
  });
};

function updateAgenda (id, agenda, callback) {
  Agenda.update({id: id}, agenda, function (err, agenda) {
   if (err) {
      return callback(err);
    }
    if (!agenda) {
      return callback('Agenda não encontrada');
    }    
    return callback(null, agenda);	
  }); 
};

function getAll(callback) {
  Agenda.find().exec(function (err, agendas) {
    if (err) {
      return callback(err)
    } 
    return callback(null, agendas);
  });
}

module.exports = {
  findAgenda: findAgenda,
  removeAgenda: removeAgenda,
  updateAgenda: updateAgenda,
  findAgendaByResponsable: findAgendaByResponsable,
  getAll: getAll,
  agendaObject: agendaObject
};