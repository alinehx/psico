'use strict';

module.exports = {
  tableName: 'Class',
  attributes: {
    name: {
      type: 'string',
      required: true,
      unique: true
    },
    location: {
      type: 'string',
      required: true,
    },
    typeClass: {
      type: 'string',
      required: true,
    },
    size: {
      type: 'integer',
      required: true,
    },
    description: {
      type: 'string',
      required: true,
    },
    active: {
      type: 'boolean',
      required: true,
      defaultsTo: true
    }
  }
}



