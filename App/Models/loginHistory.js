const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const loginHistorySchema = new Schema({
	 		player: {
				// model: 'player',
				// required: true 
				type: 'string',
				defaultsTo: ''
			},
			ip: {
				type: 'string',
				defaultsTo: ''
			},
			date: {
				type: 'string',
				defaultsTo: ''
			},
			flag: {
				type: 'string',
				defaultsTo: ''
			},
			client: {
				type: 'string',
				defaultsTo: ''
			}

},{ collection: 'loginhistory' });

mongoose.model('loginHistory', loginHistorySchema);