const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ClubrelationSchema = new Schema({
		  	clubId: {
		  		type: 'string',
		  		required: true
		  	},
			clubUniqueId: {
		  		type: 'string',
		  		required: true
		  	},
		  	playerId : {
		  		type: 'string',
		  		required: true
		  	},
		  	status : {
		  		type : 'string',
		  		required : true
		  	},
		  	chips : {
		  		type : 'number',
		  		required : true
		  	},
				diamonds : {
		  		type : 'number',
		  		required : true
		  	},
		  	type : {
		  		type : 'string',
		  		required : true // bet/win = slot, comiision, pokerBet, pokerwin, pokerjackpotbuy, pokerjackpotwin, pokerjackpotadd(added by admin) = poker
		  	},
},{ collection: 'clubrelation' });

mongoose.model('clubrelation', ClubrelationSchema);
 
