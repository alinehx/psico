'use strict';

module.exports = {
  tableName: 'Agenda',
  attributes: {
    date: {
      type: 'date',
      required: true
    },
    timestamp: {
      type: 'string',
      required: true
    },
    subject: {
      type: 'string',
      required: true
    },
    description: {
      type: 'string',
      required: true
    },
    type: {
      type: 'string',
      required: true
    },
    responsable: {
      type: 'string',
      required: true
    },
    room: {
      type: 'string',
      required: true
    }
  }
};