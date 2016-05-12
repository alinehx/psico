'use strict';


function classObject(classBody) {
  return {
    name: classBody.name,
    location: classBody.location,
    typeClass: classBody.typeClass,
    size: classBody.size,
    description: classBody.description    
  };
};

function callbackGet(err, findClass, callback) {
  if (err) {
    return callback(err);
  } else {
    return callback(null, !findClass ?'Busca não retornou resultado' : findClass);
  }     
}

function getAll(callback) {
  Class.find().exec(function (err, findClass) { callbackGet(err, findClass, callback);});
}

function findClass(name, location, callback) {
  Class.findOne({name: name, location: location}).exec(function (err, findClass) { callbackGet(err, findClass, callback);});  
}

function updateClass(name, location, classUpdate, callback) {
  findClass(name, location, function (err, classFind) {
    if (err) {
      return callback(err);
    } else if (classFind !== 'Busca não retornou resultado') {
      Class.update({name: name, location: location}, classUpdate).exec(function (err, classUpdate) {
        if (err) {
          return callback(err);
        } else if (classUpdate) {
          return callback(null, classUpdate);
        }
      });
    } else {
      return callback(null, classFind);
    }
  });
}




function createClass(classObject, callback) {
  findClass(classObject.name, classObject.location, function (err, findClass) {
    if ( err ) {
      return callback(err);
    } else  if (findClass === 'Busca não retornou resultado') {
      Class.create(classObject).exec(function(err, createClass) {
        if (err) {
          return callback(err);
        }
        else if(createClass) {
          return callback(null, createClass);
        }
      });
    } else {
      return callback('Sala já cadastrada');
    }    
  });
}
module.exports = {
  classObject: classObject,
  createClass: createClass,
  updateClass : updateClass,
  findClass: findClass,
  getAll: getAll
};