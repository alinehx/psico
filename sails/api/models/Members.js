'use strict';
var bcrypt = require('bcrypt-nodejs');

module.exports = {
  tableName: 'Members',
  attributes: {
    email: {
      type: 'string',
      required: true,
      unique: true
    },
    name: {
      type: 'string',
      required: true
    },
    gender: {
      type: 'string',
      required: true
    },
    phone: {
      type: 'string',
      required: true
    },
    zipCode: {
      type: 'string',
      required: true
    },
    numberAddress: {
      type: 'integer',
      required: true
    },
    active: {
      type: 'boolean',
      required: true,
      defaultsTo: true
    }
  }

};