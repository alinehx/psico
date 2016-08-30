 'use strict';

 var validateGuest = require ('../validate/Guests');

 function addGuest(req, res){
   var erro = validateGuest.Register(req.body);
   if (erro.length > 0) {
     return res.status(403).send({
       message: erro
     });
   } else {
     GuestsService.findGuest(req.body.email, req.body.idAgenda, function(err, guest){
       if(err){
         if (err !== 'Convidado não encontrado') { 
          return res.status(503).send({
            message: err
          });
         }
          var guestObject = GuestsService.guestObject(req.body); // Verificar se o accepted inicia como false
          Guests.create(guestObject).exec(function(err, guest){
          if (err) {
          return res.status(503).send({
            message: err
          });
          } else {
            return res.status(200).send({
              guest: guest.toJSON()
            });
          }
         });
       } else {
        return res.status(409).send({
          message: 'Convidado já cadastrado'
        });
       }
     });
   }
 }

 function getGuestFromAgenda(req, res) {
   var idAgenda = req.param('agenda');
   GuestsService.findGuestForAgenda(idAgenda, function(err, guests) { // busca um deste objeto na base.
     if (err) { // caso nao encontre.
       return res.status(503).send({
         message: err
       });
     }
     if (guests) { // se for encontrado o mesmo é retornado
       return res.status(200).send(guests);
     }
   });
 }

 function updateGuestFromAgenda(req, res) {
   var id = req.param('id');
   var idAgenda = req.param('agenda');
   var idGuest = req.param('guest');
   var guest = req.body;
   var error = [];
   var validate = validateGuest.ID(id);
   
   error = validateGuest.valideStructGuest(guest, error); //Verifica se há erros ao validar o objeto.
   if (validate && error.length === 0) {
     GuestsService.updateGuest(idGuest, idAgenda, guest, function(err, updateGuest) { // Quando nao houver erros ele executa o update.
       if (err) {
         return res.status(404).send({ //Em caso de erros.
           message: err
         });
       }
       return res.status(200).send({ //Em caso de sucesso a mensagem é disparada.
         message: 'Agenda atualizada com sucesso'
       });
     });
   } else { // Quando encontrado erros na estrutura do objeto, nao é feito o update.
     return res.status(403).send({
       message: validate === false  ? 'Agenda inconsistente' : error
     });
   }
 }

 function deleteGuestFromAgenda(req, res) {
   var id = req.param('id');
   var idAgenda = req.param('agenda');
   var idGuest = req.param('guest');
   if (validateGuest.ID(id)) {
     GuestsService.findGuest(idAgenda, idGuest, function(err, guest) {
       if (err) {
         return res.status(503).send({
           message: err
         });
       }
       GuestsService.removeGuest(guest.id, function(err, guestDelete) {
         if (err) {
           return res.status(503).send({
             message: err
           });
         }
         return res.status(200).send({
           message: 'Agenda excluida com sucesso'
         });
       });
     });
   } else {
     return res.status(403).send({
       message: 'Agenda inconsistente.'
     });
   }
 }


module.exports = {
   deleteGuestFromAgenda: deleteGuestFromAgenda,
   updateGuestFromAgenda: updateGuestFromAgenda,
   getGuestFromAgenda: getGuestFromAgenda,
   addGuest: addGuest
 }