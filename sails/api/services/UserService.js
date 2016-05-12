'use strict';




function userObject(user) {
  return {
    email: user.email,
    password: user.password,
    name: user.name,
    crp: user.crp,
    phone: user.phone,
    zipCode: user.zipCode
  };
}

function findUser(email, callback) {
  Users.findOne({
    email: email
  }).exec(function(err, user) {
    if (err) {
      return callback(err);
    } else if (!user) {
      return callback('Usuário não encontrado');
    } 
    return callback(null, user);
  });
};

function removeUser(id, callback) {
  Users.update({
    id: id
  }, {
    active: false
  }).exec(function(err, user) {
    if (err) {
      return callback(err);
    }
    if (!user) {
      return callback('Usuário não encontrado');
    }
    return callback(null, user);
  });
};

function updateUser (email, user, callback) {
  Users.update({email: email}, user, function (err, user) {
   if (err) {
      return callback(err);
    }
    if (!user) {
      return callback('Usuário não encontrado');
    }    
    return callback(null, user);	
  }); 
};


function getAll(callback) {
  Users.find().exec(function (err, users) {
    if (err) {
      return callback(err)
    } 
    users.forEach(function(v){ delete v.password });
    return callback(null, users);
  });
}




module.exports = {
  findUser: findUser,
  removeUser: removeUser,
  updateUser: updateUser,
  getAll: getAll,
  userObject: userObject
};