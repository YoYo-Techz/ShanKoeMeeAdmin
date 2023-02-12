const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const WithdrawSchema = new Schema({
	
		playerId : {
			type: mongoose.Schema.Types.ObjectId, ref: 'player'
		},
		first_name : {
			type : 'string',
			default : ''
		},
		last_name : {
			type : 'string',
			default : ''
		},
		birth_date : {
			type : Date,
			default : ''
		},
		pincode : {
			type : 'number',
			default : ''
		},
		dist : {
			type : 'string',
			default : ''
		},
		state : {
			type : 'string',
			default : ''
		},
		mobile : {
			type : 'string',
			default : ''
		},
		status : {
			type : 'string',
			default : ''
		},
		amount : {
			type : 'number',
			default : ''
		},
		wonCashDeducted : {
			type : 'number',
			default : ''
		},
		depositCashDeducted : {
			type : 'number',
			default : ''
		},
		withdrawLimitDeducted : {
			type : 'number',
			default : ''
		},

},{ collection: 'withdrawHistory', versionKey: false });

mongoose.model('withdrawHistory', WithdrawSchema);
