 'use strict';

 var validateGuest = require ('../validate/Guests');

 //updateGuestFromAgenda
 function update(req, res) {
   var idAgenda = req.param('agenda');
   var idGuest = req.param('guest');
   var guest = req.body;
   var error = [];
   var validate = validateGuest.ID(idAgenda);
   
   error = validateGuest.validateStructGuest(guest, error); //Verifica se há erros ao validar o objeto.
   if (validate && error.length === 0) {
     GuestsService.updateGuest(idGuest, idAgenda, guest, function(err, updateGuest) { // Quando nao houver erros ele executa o update.
       if (err) {
         return res.status(404).send({ //Em caso de erros.
           message: err
         });
       }
       return res.status(200).send({ //Em caso de sucesso a mensagem é disparada.
         message: 'Convidado atualizado com sucesso'
       });
     });
   } else { // Quando encontrado erros na estrutura do objeto, nao é feito o update.
     return res.status(403).send({
       message: validate === false  ? 'Convidado inconsistente' : error
     });
   }
 }
 
 function getGuest(req, res) {
    var idAgenda = req.param('agenda');
    var guest = req.param('guest');
    GuestsService.findGuest(guest, idAgenda, function(err, guests) { // busca um deste objeto na base.
      if (err) {
        return res.status(503).send({
          message: err
        });
      }
      if (guests) { // se for encontrado o mesmo é retornado
        return res.status(200).send(guests);
      }
    });
 }



module.exports = {
   update: update,
   getGuest: getGuest
}