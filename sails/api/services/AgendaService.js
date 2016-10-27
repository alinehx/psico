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
function findExtractionRange(user, m, y, callback) {
  var am = 0, ay = 0;
  var year = parseInt(y);
  var month = parseInt(m);

	if(m==12){
		am = 1;
		ay = year+1;
	} else {
		am = month+1;
		ay = y;
	}
  var initial = month+'/1'+'/'+year;
  var final = am+'/1'+'/'+ay;

	Agenda.find({
		responsable: user,
		date: { 
			'>=': new Date(initial), 
			'<': new Date(final)
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

function findExtrationByRoom(roomID, initDate, endDate, callback) {
	Agenda.find({
		roomID: roomID,
		date: {
			'>=': new Date(initDate), 
			'<': new Date(endDate)
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
  findAgendaByResponsable: findAgendaByResponsable,
  findAgendaByStartDate: findAgendaByStartDate,
  findAgendaByEndDate: findAgendaByEndDate,
  findExtractionRange: findExtractionRange,
  getAll: getAll,
  agendaObject: agendaObject
};