const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const TdsChargeSchema = new Schema({
			  roomid								: { type	: 'string' },
				gameid								: { type	: 'string' },
				username							: { type	: 'string' },
				gameType							: { type	: 'string', required: true },
				prizepool							: { type 	: 'number', required : true },
			  winnerAmount 					: { type 	: 'number', required : true },
			  afterWinAmount				: { type 	: 'number', required : true },
			  createdAt                     : { type : Date },
		  	 tds				 			: { type 	: 'string', required : true },
},{ collection: 'tdsChargeSchema' });

mongoose.model('tdsChargeSchema', TdsChargeSchema);
