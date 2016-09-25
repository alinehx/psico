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

function findByAgenda(id, callback) {
  Remaneja.findOne({
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

function findRemaneja(agenda, target, owner, callback) {
  Remaneja.findOne({
    agenda: agenda,
    target: target,
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

function findByTarget(id, callback) {
  Remaneja.findOne({
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
  Remaneja.findOne({
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

function updateRemaneja (remanejaID, agendaID, remaneja, callback) {
  remanejas.update({
    remaneja: remanejaID,
    agenda: agendaID
  },
  remaneja,
  function (err, remaneja) {
   if (err) {
      return callback(err);
    }
    if (!remaneja) {
      return callback('Convidado não encontrado');
    }    
    return callback(null, remaneja);	
  }); 
};

module.exports = {
  findByAgenda: findByAgenda,
  findByTarget: findByTarget,
  findByOwner: findByOwner,
  updateRemaneja: updateRemaneja,
  remanejaObject: remanejaObject
};