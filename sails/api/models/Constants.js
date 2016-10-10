'use strict';

module.exports = {
	tableName: 'Constants',
	  attributes: {
	    constantType: {
	      type: 'string',
	      required: true
	    },
	    constantValue: {
	      type: 'string',
	      required: true,
				unique: true
			},
			active: {
	      type: 'boolean',
	      required: true,
				defaultsTo: true
			}
	}
};