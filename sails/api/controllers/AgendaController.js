 'use strict';

 var validateAgenda = require ('../validate/Agenda');

 //Cria agendamento
 function createAgenda(req, res) {
  var erro = validateAgenda.Register(req.body);
   if (erro.length > 0) { // Bate no metodo Register do Validate(/validade/x.js) e verifica se houveram erros.
     return res.status(403).send({
       message: erro
     });
   } else { // Caso o Register nao apresente erros, entao executa este bloco.
    AgendaService.findAgenda(req.body.id, function (err, agenda) { //Tenta procurar o obj a ser inserido.
      if (err) {
        if (err !== 'Agenda não encontrada') { 
          return res.status(503).send({
            message: err
          });
        } // Se for um erro diferente do mencionado, entao:
        var agendaObject = AgendaService.agendaObject(req.body); // Criamos um objeto da classe com os dados do request.
        Agenda.create(agendaObject).exec(function(err, agenda) { // Envia o objeto para ser criado na base.
          if (err) {
            return res.status(503).send({
              message: err
            });
           } else {
             return res.status(200).send({ // Devolve o objeto como um json
               agenda: agenda.toJSON()
             });
           }
        });
      } else { // Caso retorne um objeto, nao devemos cadastrar.
        return res.status(409).send({
          message: 'Agenda já cadastrada'
        });
      } 
    });
   }
 }

 function getAgenda(req, res) {
   var id = req.param('id'); // separa o atributo
   AgendaService.findAgenda(id, function(err, agenda) { // busca um deste objeto na base.
     if (err) { // caso nao encontre.
       return res.status(503).send({
         message: err
       });
     }
     if (agenda) { // se for encontrado o mesmo é retornado
       return res.status(200).send(agenda);
     }
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
   getAll: getAll,
   getAgenda: getAgenda,
   createAgenda: createAgenda
 }