'use strict';

module.exports = {
	tableName: 'Guests',
	  attributes: {
	    agenda: {
	      type: 'string',
	      required: true
	    },
	    guest: {
	      type: 'string',
	      required: true
	    },
			accepted: {
				type: 'boolean',
				required: true,
				defaultsTo: false
			}
	}
};