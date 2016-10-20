'use strict';

function agendaObject(agenda) {
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
	if(m==12){
		am = 1;
		ay = y+1;
	} else {
		am = m+1;
		ay = y;
	}
  
	Agenda.find({
		responsable: user,
		date: { 
			'>=': new Date('1/'+am+'/'+ay), 
			'<': new Date('1/'+am+'/'+ay)
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
  findAgendaByResponsable: findAgendaByResponsable,
  findAgendaByStartDate: findAgendaByStartDate,
  findAgendaByEndDate: findAgendaByEndDate,
  findExtractionRange: findExtractionRange,
  getAll: getAll,
  agendaObject: agendaObject
};