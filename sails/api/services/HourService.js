'use strict';

function hourObject(hour) {
  return {
      room: hour.room,
      date: hour.date,
      hour: hour.hour,
      agenda: hour.agenda,
      num: hour.num
  };
}

function callbackGet(err, hours, callback) {
  if (err) {
    return callback(err);
  } else if(!hours){
    return callback(null, 'Busca não retornou resultado');
  }
  return callback(null, hours);
}

function findAll(callback) {
  Hour.find().exec(function (err, hours) { 
    callbackGet(err, hours, callback);
  });
}

function findHour(room, date, hour, callback) {
  Hour.findOne({
    room: room,
    date: date,
    hour: hour
  }).exec(function(err, hour) {
    if (err) {
      console.log("[HourService] FindHour returned an error: " + err);
      return callback(err);
    } else if (!hour) {
      return callback('Horário não encontrado');
    }
    console.log("[HourService] an Hour was found for these values.");
    return callback(null, hour);
  });
};

function findByRoomDate(date, room, callback) {
  Hour.find({
    date: date,
    room: room
  }).exec(function(err, hour) {
    if (err) {
      return callback(err);
    } else if (!hour) {
      return callback('Horário não encontrado');
    } 
    return callback(null, hour);
  });
};

function findByAgenda(agenda, callback) {
  Hour.find({
    agenda: agenda
  }).exec(function(err, hour) {
    if (err) {
      console.log("a");
      return callback(err);
    } else if (!hour) {
      console.log("b");
      return callback('Horário não encontrado');
    }
    console.log("c");
    return callback(null, hour);
  });
};

function findByAvailability(available,  callback) {
  Hour.find({
    available: available
  }).exec(function(err, hour) {
    if (err) {
      return callback(err);
    } else if (!hour) {
      return callback('Horários não encontrados');
    } 
    return callback(null, hour);
  });
};

function updateHour(hourID, constantjaObject, callback) {
  Hour.update({id: hourID}, constantjaObject,
  function (err, hour) {
   if (err) {
      return callback(err);
    }
    if (!hour) {
      return callback('Horário não encontrado');
    }    
    return callback(null, hour);	
  }); 
};

module.exports = {
  findAll: findAll,
  findHour: findHour,
  findByRoomDate: findByRoomDate,
  findByAvailability: findByAvailability,
  findByAgenda: findByAgenda,
  updateHour: updateHour,
  hourObject: hourObject
};