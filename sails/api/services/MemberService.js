'use strict';



function createMember(memberSend, callback) {
  findMember(memberSend.email, function(err, success) {
    if (err) {
      callback(err);
    } else if (success === 'Membro não encontrado') {
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




function findMember(email, callback) {
  Members.findOneByEmail(email, function(err, foundMember) {
    if (err) {
      return callback(err);
    }
    if (foundMember) {      
      return callback(null, foundMember);    
    } else {
      return callback(null, 'Membro não encontrado');
    }
  });
}

function updateMember(email, member, callback) {
  findMember(email, function (err, findMember) {
    if (err) {
      return callback(err);
    } else if (findMember === 'Membro não encontrado') {
      return callback(findMember);
    } else {
      Members.update({ email: email}, member, function(err, memberUpdate) {
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
  findMember: findMember
};