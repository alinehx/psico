 'use strict';

 var validateConstant = require ('../validate/Constants');

 //Add Guest
 function createConstant(req, res){
   var erro = validateConstant.Register(req.body);
   if (erro.length > 0) {
     return res.status(403).send({
       message: erro
     });
   } else {
     ConstantsService.findConstants(req.body.constantType, req.body.constantValue, function(err, constant){
       if(err){
         if (err !== 'Constante não encontrado') { 
          return res.status(404).send({
            message: err
          });
         }
          var constanteObject = ConstantsService.ConstantsObject(req.body);
          Constants.create(constanteObject).exec(function(err, constants){
          if (err) {
          return res.status(503).send({
            message: err
          });
          } else {
            return res.status(200).send({
              constants: constants.toJSON()
            });
          }
         });
       } else {
        return res.status(409).send({
          message: 'Constante já Existe'
        });
       }
     });
   }
 }

  function getAll(req, res){
    ConstantsService.findAll(function (err, constanteObject) {
      if (err) {
        return res.status(503).send({
          message: err
        });
      }
      return res.status(200).send(constanteObject);
    });
  }

function getByType(req, res) {
    var constantType = req.param('constantType');
    ConstantsService.findByType(constantType, function(err, remanejaList) {
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

function getValue(req, res) {
    var constantValue = req.param('constantValue');
    ConstantsService.findValue(constantValue, function(err, remanejaList) {
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
 function updateConstant(req, res) {
   var idConstants = req.param('id');
   var constants = req.body;
   var error = [];
   var validate = validateConstant.ID(idConstants);
   
   error = validateConstant.validateStructConstants(constants, error);
   if (validate && error.length === 0) {
     ConstantsService.updateConstant(idConstants, constants, function(err, updateConstant) {
       if (err) {
         return res.status(404).send({
           message: err
         });
       }
       return res.status(200).send({
         message: 'Constante atualizado com sucesso'
       });
     });
   } else {
     return res.status(403).send({
       message: validate === false  ? 'Constante inconsistente' : error
     });
   }
 }

module.exports = {
   createConstant: createConstant,
   getAll: getAll,
   getByType: getByType,
   getValue: getValue,
   updateConstant: updateConstant
 }