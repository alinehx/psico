'use strict';

module.exports = {
  tableName: 'Agenda',
  attributes: {
    roomID: {
      type: 'string',
      required: true
    },
    date: {
      type: 'date',
      required: true
    },
    initTime: {
      type: 'string',
      required: true
    },
    endTime: {
      type: 'string',
      required: true
    },
    responsable: {
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
    timecreation: {
      type: 'string',
      required: true
    },
    isAccepted:{
      type: 'boolean',
      required: true,
      defaultsTo: false
    }
  }
};