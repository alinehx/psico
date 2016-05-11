'use strict';


function callbackGet(err, users, callback) {
  if (err) {
    return callback(err);
  } else if(!users){
    return callback(null, 'Busca não retornou resultado');
  }
  return callback(null, users);
}

function createMember(memberSend, callback) {
  findMember(memberSend.email, function(err, success) {
    if (err) {
      callback(err);
    } else if (success === 'Busca não retornou resultado') {
      Members.create(memberSend).exec(function(err, member) {
        if (err) {
          return callback(err);
        }
        if (!member) {
          return callback('Membro não criado');
        }
        return callback(null, member);
      });
    } else {
      callback('Membro já cadastrado');
    }
  });
}

function getAll(callback) {
  Members.find().exec(function (err, users){ callbackGet(err, users, callback)});
}


function findMember(email, callback) {
  Members.findOneByEmail(email).exec(function (err, users){ callbackGet(err, users, callback)});
}

function updateMember(email, member, callback) {
  findMember(email, function (err, findMember) {
    if (err) {
      return callback(err);
    } else if (findMember === 'Busca não retornou resultado') {
      return callback(findMember);
    } else {
      Members.update({ email: email}, member).exec(function(err, memberUpdate) {
        if (err) {
          return callback(err);
        } else  if(memberUpdate) {
          return callback(null, memberUpdate);  
        }
      });
    }
  });  
}




module.exports = {
  createMember: createMember,
  updateMember: updateMember,
  findMember: findMember,
  getAll: getAll
};