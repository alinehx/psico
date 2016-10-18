'use strict';

module.exports = {
	tableName: 'Remaneja',
	  attributes: {
	    agenda: {
	      type: 'string',
	      required: true
	    },
	    target: {
	      type: 'string',
	      required: true
	    },
			owner: {
				type: 'string',
				required: true,
			},
			resp: {
				type: 'string'
			},
			status: {
				type: 'boolean',
				required: true,
				defaultsTo: false
			}
	}
};