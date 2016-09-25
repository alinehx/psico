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
				type: 'string',
				required: true,
			},
			status: {
				type: 'string',
				required: true,
				defaultsTo: false
			}
	}
};