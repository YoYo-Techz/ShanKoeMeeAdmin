const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ClubchipstransactionSchema = new Schema({
		  	club: {
		  		type: 'string',
		  		required: true
		  	},
		  	Sys : {
		  		type: 'string',
		  		required: true
		  	},
		  	chipsquantity : {
		  		type : 'number',
		  		required : true
		  	},
			diamondquantity : {
		  		type : 'number',
		  		required : true
		  	},
		  	newChipsBalance : {
		  		type : 'number',
		  		required : true
		  	},
			newDiamondsBalance : {
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
},{ collection: 'clubchipstransaction' });

mongoose.model('clubchipstransaction', ClubchipstransactionSchema);
 
