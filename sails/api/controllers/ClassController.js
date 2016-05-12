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
    if (err) {
      return res.status(err === 'Sala já cadastrada' ? 409 : 503).send({
        message: err
      });
    } else {
      return res.status(201).send(classCreate); 
    }
  });
}

function updateClass(allValues, typeUpdate, res, req) {
  //var returnValidate = validateClass.update(allValues),
  var name, location;
  if (allValues.name !== undefined && allValues.location !== undefined) {
    name = allValues.name;
    location = allValues.location;
    var classUpdate = typeUpdate === 'disable' ? { active: false  } : req.body;

    ClassService.updateClass(name, location, classUpdate, function(err, data) {
      if (err) {
        return res.status(503).send({
          message: err
        });
      } else if (data !==  'Busca não retornou resultado') {
        return res.status(200).send(typeUpdate === 'disable' ? 'Usuário excluido com sucesso' : data);
      } else {
        return res.status(404).send(data);
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
    updateClass(req.params, 'update', res, req);
  }
}

function disable(req, res) {  
  updateClass(req.params, 'disable', res, req);
}

function getClass(req, res) {
  var  name, location;
  name = req.params.name;
  location = req.params.location;
    if(name && location) {    
    ClassService.findClass(name, location, function (err, objectClass) {
      if (err) {
        return res.status(503).send({
          message: err
        }); 
      }
      return res.status(objectClass ===  'Busca não retornou resultado' ? 404 : 200).send(objectClass);
    });
  } else {
    return res.status(403).send({
      message: 'Nome e Localização são obrigatórios'
    });
  }
};

function getAll(req, res){
  ClassService.getAll(function (err, objectClass) {
    if (err) {
      return res.status(503).send({
        message: err
      });
    }
    return res.status(200).send(objectClass);
  });  
}

module.exports = {
  create: create,
  update: update,
  disable: disable,
  getClass: getClass,
  getAll: getAll
  
};