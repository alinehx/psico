'use strict';

var validateClass = require('../validate/Class');

function create(req, res) {
  var erro = validateClass.verifyBody(req.body);
  if (erro.length > 0) {
    return res.status(403).send({
      message: erro
    });
  }
  var classObject = ClassService.classObject(req.body);
  
  ClassService.createClass(classObject, function(err, classCreate) {
    console.log('err', err);
    console.log('classCreate', classCreate)
    if (err) {
      return res.status(err === 'Sala já cadastrada' ? 409 : 503).send({
        message: err
      });
    }
    return res.status(201).send(classCreate);
  });
}

function updateClass(allValues, typeUpdate, res, req) {
  var returnValidate = validateClass.update(allValues),
   name, location;

  if (returnValidate.length === 2) {
    name = returnValidate[0];
    location = returnValidate[1];
    var classUpdate = typeUpdate === 'disable' ? { active: false  } : req.body;

    ClassService.updateClass(name, location, classUpdate, function(err, data) {
      if (err) {
        return res.status(err === 'Sala não encontrada' ? 404 : 503).send({
          message: err
        });
      } else if (data) {
        return res.status(200).send(data);
      }
    });
  } else {
    return res.status(403).send({
      message: 'Nome e Localização são obrigatórios'
    });
  }
}



function update(req, res) {
  var error = [];
  error = validateClass.validateStructClass(req.body, error);
  if(error.length > 0 ) {
    return res.status(409).send(error);
  } else {
    updateClass(req.params.id, 'update', res, req);
  }
}

function disable(req, res) {  
  updateClass(req.params.id, 'disable', res, req);
}



module.exports = {
  create: create,
  update: update,
  disable: disable
};