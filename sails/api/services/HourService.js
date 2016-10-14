'use strict';

function hourObject(hour) {
  return {
      room: hour.room,
      date: hour.date,
      hour: hour.hour,
      num: hour.num
  };
}

function findAll(callback) {
  Hour.find().exec(function (err, findHour) { 
    callbackGet(err, findHour, callback);
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

function findByDate(date, callback) {
  Hour.find({
    date: date
  }).exec(function(err, hour) {
    if (err) {
      return callback(err);
    } else if (!hour) {
      return callback('Horário não encontrado');
    } 
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
  findByDate: findByDate,
  findByAvailability: findByAvailability,
  updateHour: updateHour,
  hourObject: hourObject
};