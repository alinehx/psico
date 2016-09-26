 'use strict';

 var validateRemaneja = require ('../validate/Remaneja');

 //Add Guest
 function createRemaneja(req, res){
   var erro = validateRemaneja.Register(req.body);
   if (erro.length > 0) {
     return res.status(403).send({
       message: erro
     });
   } else {
     RemanejaService.findRemaneja(req.body.agenda, req.body.target, req.body.owner, function(err, guest){
       if(err){
         if (err !== 'Remanejamento não encontrado') { 
          return res.status(404).send({
            message: err
          });
         }
          var remanejaObject = RemanejaService.RemanejaObject(req.body); // Verificar se o accepted inicia como false
          Remaneja.create(remanejaObject).exec(function(err, remaneja){
          if (err) {
          return res.status(503).send({
            message: err
          });
          } else {
            return res.status(200).send({
              remaneja: remaneja.toJSON()
            });
          }
         });
       } else {
        return res.status(409).send({
          message: 'Remanejamento já Existe'
        });
       }
     });
   }
 }

  function getAll(req, res){
    RemanejaService.findAll(function (err, remanejaObject) {
      if (err) {
        return res.status(503).send({
          message: err
        });
      }
      return res.status(200).send(remanejaObject);
    });
  }

  function getRemaneja(req, res) {
    var idAgenda = req.param('agenda');
    var idTarget = req.param('target');
    var idOwner = req.param('owner');
    RemanejaService.findRemaneja(idAgenda, idTarget, idOwner, function(err, remanejaObject) {
      if (err) {
        return res.status(503).send({
          message: err
        });
      }
      if (remanejaObject) { 
        return res.status(200).send(remanejaObject);
      }
    });
 }

 function getForTarget(req, res) {
    var target = req.param('target');
    RemanejaService.findByTarget(target, function(err, remanejaList) {
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

  function getForOwner(req, res) {
    var owner = req.param('owner');
    RemanejaService.findByOwner(owner, function(err, remanejaList) {
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

  function getForAgenda(req, res) {
    var agenda = req.param('agenda');
    RemanejaService.findByAgenda(agenda, function(err, remanejaList) {
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
 function updateRemaneja(req, res) {
   var idRemaneja = req.param('id');
   var remaneja = req.body;
   var error = [];
   var validate = validateRemaneja.ID(idRemaneja);
   
   error = validateRemaneja.validateStructRemaneja(remaneja, error);
   if (validate && error.length === 0) {
     RemanejaService.updateRemaneja(idRemaneja, remaneja, function(err, updateRemaneja) {
       if (err) {
         return res.status(404).send({
           message: err
         });
       }
       return res.status(200).send({
         message: 'Remanejamento atualizado com sucesso'
       });
     });
   } else {
     return res.status(403).send({
       message: validate === false  ? 'Remanejamento inconsistente' : error
     });
   }
 }

module.exports = {
   createRemaneja: createRemaneja,
   getAll: getAll,
   getRemaneja: getRemaneja,
   getForTarget: getForTarget,
   getForOwner: getForOwner,
   getForAgenda: getForAgenda,
   updateRemaneja: updateRemaneja
 }