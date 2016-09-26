'use strict';

function remanejaObject(remaneja) {
  return {
      agenda: remaneja.agenda,
      target: remaneja.target,
      owner: remaneja.owner,
      resp: remaneja.resp,
      status: remaneja.status
  };
}

function findAll(callback) {
  Remaneja.find().exec(function (err, findRemaneja) { 
    callbackGet(err, findRemaneja, callback);
  });
}

function findByAgenda(id, callback) {
  Remaneja.find({
    agenda: id
  }).exec(function(err, remaneja) {
    if (err) {
      return callback(err);
    } else if (!remaneja) {
      return callback('Remanejamento não encontrado');
    } 
    return callback(null, remaneja);
  });
};

function findByTarget(id, callback) {
  Remaneja.find({
    target: id
  }).exec(function(err, remaneja) {
    if (err) {
      return callback(err);
    } else if (!remaneja) {
      return callback('Remanejamento não encontrado');
    } 
    return callback(null, remaneja);
  });
};

function findByOwner(id, callback) {
  Remaneja.find({
    target: id
  }).exec(function(err, remaneja) {
    if (err) {
      return callback(err);
    } else if (!remaneja) {
      return callback('Remanejamento não encontrado');
    } 
    return callback(null, remaneja);
  });
};

function findRemaneja(idAgenda, idTarget, idOwner, callback) {
  Remaneja.findOne({
    agenda: idAgenda,
    target: idTarget,
    owner: idOwner
  }).exec(function(err, remaneja) {
    if (err) {
      return callback(err);
    } else if (!remaneja) {
      return callback('Remanejamento não encontrado');
    } 
    return callback(null, remaneja);
  });
};

function updateRemaneja(remanejaID, remanejaObject, callback) {
  Remaneja.update({remaneja: remanejaID}, remanejaObject,
  function (err, remaneja) {
   if (err) {
      return callback(err);
    }
    if (!remaneja) {
      return callback('Remanejamento não encontrado');
    }    
    return callback(null, remaneja);	
  }); 
};

module.exports = {
  findAll: findAll,
  findByAgenda: findByAgenda,
  findByTarget: findByTarget,
  findByOwner: findByOwner,
  findRemaneja: findRemaneja,
  updateRemaneja: updateRemaneja,
  remanejaObject: remanejaObject
};