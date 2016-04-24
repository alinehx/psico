'use strict';
var bcrypt = require('bcrypt-nodejs')
module.exports = {
  tableName: 'Users',
  attributes: {
    email: {
      type: 'string',
      required: true,
      unique: true
    },
    password: {
      type: 'string'
    }
  },
  beforeCreate: function (attributes, next){
      var pass = attributes.password;
      console.log('pass', pass);
      password.generatePasswordWithBcrypt(pass, function (err, hash) {
        if (err) {
          return next(err);
        }        
        attributes.password = hash;
        console.log('attributes', attributes);
        next();
      });      
    }
};

