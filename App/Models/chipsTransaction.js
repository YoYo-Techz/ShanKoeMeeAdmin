const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ChipsTransactionSchema = new Schema({
		  	player: {
		  		type: 'string',
		  		required: true
		  	},
		  	Sys : {
		  		type: 'string',
		  		required: true
		  	},
		  	quantity : {
		  		type : 'number',
		  		required : true
		  	},
		  	remaining : {
		  		type : 'number',
		  		required : true
		  	},
		  	remark : {
		  		type : 'string',
		  		required : true
		  	},
		  	type : {
		  		type : 'string',
		  		required : true // bet/win = slot, comiision, pokerBet, pokerwin, pokerjackpotbuy, pokerjackpotwin, pokerjackpotadd(added by admin) = poker
		  	}
},{ collection: 'chipstransaction' });

mongoose.model('chipstransaction', ChipsTransactionSchema);
 
