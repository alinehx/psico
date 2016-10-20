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

function callbackGet(err, remaneja, callback) {
  if (err) {
    return callback(err);
  } else if(!remaneja){
    return callback(null, 'Busca não retornou resultado');
  }
  return callback(null, remaneja);
}

function findAll(callback) {
  Hour.find().exec(function (err, remaneja) { 
    callbackGet(err, remaneja, callback);
  });
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

function findByTarget(target, callback) {
  Remaneja.find({
    target: target
  }).exec(function(err, remaneja) {
    if (err) {
      return callback(err);
    } else if (!remaneja) {
      return callback('Remanejamento não encontrado');
    } 
    return callback(null, remaneja);
  });
};

function findByOwner(owner, callback) {
  Remaneja.find({
    owner: owner
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

function findOne(id, callback) {
  Remaneja.findOne({
    id: id
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
  Remaneja.update({id: remanejaID}, remanejaObject,
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
  findOne: findOne,
  updateRemaneja: updateRemaneja,
  remanejaObject: remanejaObject
};