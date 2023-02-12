const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const SettingSchema = new Schema({
			minStack: {
				type: 'number',
				defaultsTo: 0
			},
			maxStack: {
				type: 'number',
				defaultsTo: 0
			},
			flag: {
				type: 'string',
				defaultsTo: ''
			},
			gameType:{
				type: 'string',
				defaultsTo: ''
			},
	},{ collection: 'stacks' });
mongoose.model('stacks', SettingSchema);
 
