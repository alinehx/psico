'use strict';

module.exports = {
	tableName: 'Hour',
	  attributes: {
	    date: {
	      type: 'date',
	      required: true
	    },
	    hour: {
	      type: 'string',
	      required: true
			},
			available: {
	      type: 'boolean',
	      required: true,
				defaultsTo: true
			},
			agenda: {
	      type: 'string'
			}
	}
};