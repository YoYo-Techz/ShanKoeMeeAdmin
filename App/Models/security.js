const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const securitySchema = new Schema({
			ip: {
				type: 'string',
				defaultsTo: ''
			},
			status: {
				type: 'string',
				defaultsTo: 'inactive'
			},
			flag: {
				type: 'string',
				defaultsTo: ''
			}
	},{ collection: 'security' });
mongoose.model('security', securitySchema);
 
