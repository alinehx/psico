 'use strict';

 var validateAgenda = require ('../validate/Agenda');

 //Cria agendamento
 function createAgenda(req, res) {
  var erro = validateAgenda.Register(req.body);
   if (erro.length > 0) {
     return res.status(403).send({
       message: erro
     });
   } else { 
    AgendaService.findAgenda(req.body.id, function (err, agenda) {
      if (err) {
        if (err !== 'Agenda não encontrada') { 
          return res.status(503).send({
            message: err
          });
        } 
        var agendaObject = AgendaService.agendaObject(req.body);
        Agenda.create(agendaObject).exec(function(err, agenda) {
          if (err) {
            return res.status(503).send({
              message: err
            });
           } else {
             return res.status(200).send({
               agenda: agenda.toJSON()
             });
           }
        });
      } else {
        return res.status(409).send({
          message: 'Agenda já cadastrada'
        });
      } 
    });
   }
 }

 function getAgendaById(req, res) {
   var id = req.params.agenda;
   AgendaService.findAgenda(id, function(err, agenda) {
     if (err) {
       return res.status(503).send({
         message: err
       });
     }
    return res.status(200).send(agenda);
   });
 }

 function getAgendaListByRoom(req, res) {
   var id = req.params.room;
   var initDate = req.param.initDate;
   var endDate = req.param.endDate;
   AgendaService.findByRoom(id, initDate, endDate, function(err, agenda) {
     if (err) {
       return res.status(503).send({
         message: err
       });
     }
    return res.status(200).send(agenda);
   });
 }

  function extractReportForMonth(req, res) {
    var user = req.params.user;
    var m = req.params.month;
    var y = req.params.year
    AgendaService.findExtractionRange(user, m, y, function(err, agenda) {
    if (err) {
      return res.status(503).send({
        message: err
      });
    }
      return res.status(200).send(agenda);
    });
  }

 function getAgendaByResponsable(req, res) {
   var email = req.param('email');
   AgendaService.findAgendaByResponsable(email, function(err, agendas) {
     if (err) {
       return res.status(503).send({
         message: err
       });
     }
     return res.status(200).send(agendas);
   });
 }

 function getAll(req, res) { // tenta buscar todos esses objetos na base.
   AgendaService.getAll(function(err, agendas) {
     if (err) {
       return res.status(503).send({
         message: err
       });
     }
     return res.status(200).send(agendas);
   });
 }

 //Alterar detalhes do agendamento.
 function updateAgenda(req, res) {
   var id = req.param('id');
   var agenda = req.body;
   var error = [];
   var validate = validateAgenda.ID(id);
   
   error = validateAgenda.valideStructAgenda(agenda, error); //Verifica se há erros ao validar o objeto.
   if (validate && error.length === 0) {
     AgendaService.updateAgenda(id, agenda, function(err, updateAgenda) { // Quando nao houver erros ele executa o update.
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

 //Deletar o agendamento
 function deleteAgenda(req, res) {
   var id = req.param('id');
   if (validateAgenda.ID(id)) {
     AgendaService.findAgenda(id, function(err, agenda) {
       if (err) {
         return res.status(503).send({
           message: err
         });
       }
       AgendaService.removeAgenda(agenda.id, function(err, agendaDelete) {
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
   deleteAgenda: deleteAgenda,
   updateAgenda: updateAgenda,
   getAgendaListByRoom: getAgendaListByRoom,
   getAgendaByResponsable: getAgendaByResponsable,
   getAll: getAll,
   getAgendaById: getAgendaById,
   createAgenda: createAgenda,
   extractReportForMonth: extractReportForMonth
 }