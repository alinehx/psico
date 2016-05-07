'use strict';
var bcrypt = require('bcrypt-nodejs');

module.exports = {
  tableName: 'Users',
  attributes: {
    email: {
      type: 'string',
      required: true,
      unique: true
    },
    password: {
      type: 'string',
      defaultsTo: '123'
    },
    name: {
      type: 'string',
      required: true
    },
    crp: {
      type: 'string',
      required: true,
      unique: true
    },
    phone: {
      type: 'string',
      required: true
    },
    zipCode: {
      type: 'string',
      required: true
    },
    active: {
      type: 'boolean',
      required: true,
      defaultsTo: true
    }
  },
  beforeCreate: function(attributes, next) {
    var pass = attributes.password;
    password.generatePasswordWithBcrypt(pass, function(err, hash) {
      if (err) {
        return next(err);
      }
      attributes.password = hash;
      next();
    });
  }
};