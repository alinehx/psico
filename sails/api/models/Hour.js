'use strict';

module.exports = {
	tableName: 'Hour',
	  attributes: {
			room:{
				type:'string',
				required: true
			},
	    date: {
	      type: 'string',
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
			},
			num: {
				type: 'integer',
				required: true
			}
	}
};