'use strict';

module.exports = {
  tableName: 'Agenda',
  attributes: {
    date: {
      type: 'date',
      required: true
    },
    timestamp: {
      type: 'timestamp',
      required: true,
      unique: true
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