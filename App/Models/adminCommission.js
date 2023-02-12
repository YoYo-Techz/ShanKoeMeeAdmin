const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const AdminCommissionSchema = new Schema({
			  roomid								: { type	: 'string', required: true },
			  gameid								: { type	: 'string', required: true },
				gameType							: { type	: 'string', required: true },
				prizepool							: { type 	: 'number', required : true },
				commissionAmount 			: { type	: 'number', required: true },
		  	commissionPercentage 	: { type	: 'number', required: true },
			  winnerAmount 					: { type 	: 'number', required : true },
			  createdAt                     : { type : Date }
		  	// winnerId				 			: { type 	: 'string', required : true },
},{ collection: 'adminCommission' });

mongoose.model('adminCommission', AdminCommissionSchema);
