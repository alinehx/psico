'use strict';

function constantsObject(constants) {
  return {
      constantType: constants.constantType,
      constantValue: constants.constantValue
  };
}

function findAll(callback) {
  Constants.find().exec(function (err, findConstants) { 
    callbackGet(err, findConstants, callback);
  });
}

function findConstant(constantType, constantValue, callback) {
  Constants.find({
    constantType: constantType,
    constantValue:constantValue
  }).exec(function(err, constants) {
    if (err) {
      return callback(err);
    } else if (!constants) {
      return callback('Constante não encontrada');
    } 
    return callback(null, constants);
  });
};

function findByType(constantType, callback) {
  Constants.find({
    constantType: constantType
  }).exec(function(err, constants) {
    if (err) {
      return callback(err);
    } else if (!constants) {
      return callback('Constante não encontrada');
    } 
    return callback(null, constants);
  });
};

function findValue(constantValue,  callback) {
  Constants.find({
    constantValue: constantValue
  }).exec(function(err, constants) {
    if (err) {
      return callback(err);
    } else if (!constants) {
      return callback('Constante não encontrada');
    } 
    return callback(null, constants);
  });
};

function updateConstant(constantID, constantjaObject, callback) {
  Constants.update({constants: constantID}, constantjaObject,
  function (err, constants) {
   if (err) {
      return callback(err);
    }
    if (!constants) {
      return callback('Constante não encontrada');
    }    
    return callback(null, constants);	
  }); 
};

module.exports = {
  findAll: findAll,
  findByType: findByType,
  findValue: findValue,
  updateRemaneja: updateConstant,
  remanejaObject: constantsObject
};