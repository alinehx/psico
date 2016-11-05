'use strict';

function agendaObject(agenda) {
  sails.log.info("[AgendaService] Retrieving agendaObject");
  return {
    roomID : agenda.roomID,
    date : agenda.date,
    initTime : agenda.initTime,
    endTime : agenda.endTime,
    responsable : agenda.responsable,
    subject : agenda.subject,
    description : agenda.description,
    type : agenda.type,
    guestQuantity: agenda.guestQuantity,
    timecreation : agenda.timecreation,
    active: agenda.active
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

function findAgendaByStartDate(date, initTime, callback) {
  Agenda.find({
    date: date,
    initTime: initTime
  }).exec(function(err, agenda) {
    if (err) {
      return callback(err);
    } else if (!agenda) {
      return callback('Agenda não encontrada');
    } 
    return callback(null, agenda);
  });
};

function findAgendaByEndDate(date, endTime, callback) {
  Agenda.find({
    date: date,
    endTime: endTime
  }).exec(function(err, agenda) {
    if (err) {
      return callback(err);
    } else if (!agenda) {
      return callback('Agenda não encontrada');
    } 
    return callback(null, agenda);
  });
};

function replaceAll(text, cTarget, cNew){
		while(text.match(cTarget) != null){
			var res = text.search(cTarget);
			if(res != -1){
			text = text.replace(cTarget, cNew);
			}
		}
		return text;
}

function findByRoomAndRange(roomID, initTime, endTime, callback) {
  sails.log.info("[AgendaService] findByRoomAndRange for [" + roomID + " and " + initTime + " -> " + endTime);
  var formatedInitTime = replaceAll(initTime, '-', '/');
  var formatedEndTime =replaceAll(endTime, '-', '/');
  Agenda.find({
    roomID: roomID,
    date: { 
			'>=': new Date(formatedInitTime),
			'<': new Date(formatedEndTime)
		}
  }).exec(function(err, agenda) {
    if (err) {
      return callback(err);
    } else if (!agenda) {
      return callback('Agenda não encontrada');
    }
    return callback(null, agenda);
  });
};

function findByRoom(roomID, initTime, endTime, callback) {
  Agenda.find({
    roomID: roomID,
    date: { 
			'>=': new Date(initTime), 
			'<': new Date(endTime)
		}
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


//ExtractionQuery
function findExtractionRange(user, initTime, endTime, callback) {
  sails.log.info("[AgendaService] findExtractionRange for [" + user + "] and " + initTime + " -> " + endTime);
  var formatedInitTime = replaceAll(initTime, '-', '/');
  var formatedEndTime =replaceAll(endTime, '-', '/');

	Agenda.find({
		responsable: user,
		date: { 
			'>=': new Date(formatedInitTime), 
			'<': new Date(formatedEndTime)
		}
	}).exec(function(err, agenda) {
		if (err) {
			return callback(err);
		} else if (!agenda) {
			return callback('Agenda não encontrada');
		}
		return callback(null, agenda);
	});
};

module.exports = {
  findAgenda: findAgenda,
  removeAgenda: removeAgenda,
  updateAgenda: updateAgenda,
  findByRoom: findByRoom,
  findByRoomAndRange: findByRoomAndRange,
  findAgendaByResponsable: findAgendaByResponsable,
  findAgendaByStartDate: findAgendaByStartDate,
  findAgendaByEndDate: findAgendaByEndDate,
  findExtractionRange: findExtractionRange,
  getAll: getAll,
  agendaObject: agendaObject
};