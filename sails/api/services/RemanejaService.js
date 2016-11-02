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

function replaceAll(text, cTarget, cNew){
  while(text.match(cTarget) != null){
    var res = text.search(cTarget);
    if(res != -1){
    text = text.replace(cTarget, cNew);
    }
  }
  return text;
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

function findByRange(initTime, endTime, callback) {

  sails.log.info("[RemanejaService] findByRange from " + initTime + " to " + endTime);
  var formatedInitTime = replaceAll(initTime, '-', '/');
  var formatedEndTime = replaceAll(endTime, '-', '/');

  Remaneja.find({
    createdAt: { 
			'>=': new Date(formatedInitTime),
			'<': new Date(formatedEndTime)
		}
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
  findByRange: findByRange,
  findOne: findOne,
  updateRemaneja: updateRemaneja,
  remanejaObject: remanejaObject
};