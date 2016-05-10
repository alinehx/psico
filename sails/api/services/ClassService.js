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


function findClass(name, location, callback) {
  Class.findOne({name: name, location: location}, function (err, findClass) {
    if (err) {
      return callback(err);
    } 
    if(!findClass) {
      return callback('Sala não encontrada');
    } else {
       return callback(undefined, findClass);
    }
  });
}

function updateClass(name, location, classUpdate, callback) {
  findClass(name, location, function (err, classFind) {
    if (err) {
      return callback(err);
    } else {
      Class.update({name: name, location: location}, classUpdate, function (err, classUpdate) {
        if (err) {
          return callback(err);
        } else if (classUpdate) {
          return callback(null, classUpdate);
        }
      });
    }
  });
}




function createClass(classObject, callback) {
  findClass(classObject.name, classObject.location, function (err, findClass) {
    if ( err && err !== 'Sala não encontrada') {
      return callback(err);
    } else  if ( err && err === 'Sala não encontrada') {
      Class.create(classObject).exec(function(err, createClass) {
        if (err) {
          return callback(err);
        }
        if(createClass) {
          return callback(null, createClass);
        }
      });
    } else if (findClass) {
      return callback('Sala já cadastrada');
    }  
  });
}
module.exports = {
  classObject: classObject,
  createClass: createClass,
  updateClass : updateClass
};