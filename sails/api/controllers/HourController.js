 'use strict';

 var validateHour = require ('../validate/Hour');


 function createHour(req, res){
   var erro = validateHour.Register(req.body);
   if (erro.length > 0) {
     return res.status(403).send({
       message: erro
     });
   } else {
     HourService.findHour(req.body.room, req.body.date, req.body.hour, function(err, hour){
       if(err){
         if (err !== 'Horário não encontrado') { 
          return res.status(404).send({
            message: err
          });
         }
          var hourObject = HourService.hourObject(req.body);
          Hour.create(hourObject).exec(function(err, hour){
          if (err) {
          console.log("err", err);
          return res.status(503).send({
            message: err
          });
          } else {
            return res.status(200).send({
              hour: hour.toJSON()
            });
          }
         });
       } else {
         console.log("[HourController] Hour already exists.");
        return res.status(409).send({
          message: 'Horário já Existe'
        });
       }
     });
   }
 }

  function getAll(req, res){
    HourService.findAll(function (err, constanteObject) {
      if (err) {
        return res.status(503).send({
          message: err
        });
      }
      return res.status(200).send(constanteObject);
    });
  }

function getByRoomDate(req, res) {
    var date = req.param('date');
    var room = req.param('room');
    HourService.findByRoomDate(date, room, function(err, hourList) {
      if (err) {
        return res.status(503).send({
          message: err
        });
      }
      if (hourList) { 
        return res.status(200).send(hourList);
      }
    });
 }

 function getByAgenda(req, res) {
    var agenda = req.param('agenda');
    HourService.findByAgenda(agenda, function(err, hourList) {
      if (err) {
        return res.status(503).send({
          message: err
        });
      }
      if (hourList) {
        return res.status(200).send(hourList);
      }
    });
 }

function getByAvailability(req, res) {
    var availability = req.param('available');
    HourService.findValue(available, function(err, remanejaList) {
      if (err) {
        return res.status(503).send({
          message: err
        });
      }
      if (remanejaList) { 
        return res.status(200).send(remanejaList);
      }
    });
 }

 //updateGuestFromAgenda
 function updateHour(req, res) {
   var idHour = req.param('id');
   var hour = req.body;
   var error = [];
   var validate = validateHour.ID(idHour);
   error = validateHour.validateStructHour(hour, error);
   if (validate && error.length === 0) {
     HourService.updateHour(idHour, hour, function(err, updateHour) {
       if (err) {
         return res.status(404).send({
           message: err
         });
       }
       return res.status(200).send({
         message: 'Horário atualizado com sucesso'
       });
     });
   } else {
     return res.status(403).send({
       message: validate === false  ? 'Horário inconsistente' : error
     });
   }
 }

module.exports = {
   createHour: createHour,
   getAll: getAll,
   getByRoomDate: getByRoomDate,
   getByAvailability: getByAvailability,
   getByAgenda: getByAgenda,
   updateHour: updateHour
 }