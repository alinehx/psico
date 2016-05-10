'use strict';

function memberObject(member) {
  return {
    email: user.email,
    name: user.name,
    gender: user.gender,
    phone: user.phone,
    zipCode: user.zipCode,
    numberAddress: user.numberAddress
  };
};

function createMember(memberSend, callback) {
  findMember(memberSend.email, function(err, success) {
    if (err) {
      callback(err);
    } else if (success === 'Membro não encontrado') {
      Members.create(user).exec(function(err, member) {
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
      if (foundMember.active === true) {
        return callback(null, foundMember);
      } else {
        return callback('Membro desativado');
      }
    } else {
      return callback(null, 'Membro não encontrado');
    }
  });
}

function updateMember(email, member, callback) {
  Members.update({
    email: email
  }, member, function(err, memberUpdate) {
    if (err) {
      return callback(err);
    }
    if (!memberUpdate) {
      return callback('Membro não encontrado');
    }
    return callback(null, memberUpdate);
  });
}


function removeMember(id, callback) {
  Members.update({
    id: id
  }, {
    active: false
  }).exec(function(err, member) {
    if (err) {
      return callback(err);
    }
    if (!member) {
      return callback('Membro não encontrado');
    }
    return callback(null, member);
  });
};

module.exports = {
  memberObject: memberObject,
  createMember: createMember,
  updateMember: updateMember,
  removeMember: removeMember,
  findMember: findMember
};