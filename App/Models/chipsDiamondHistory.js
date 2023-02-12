const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ChipsDiamondHistorySchema = new Schema({
		  	player: { type: 'string', required: true },
            gameId: { type: 'string', default: '' }, // For Sys Transection Only
            type: { type: 'string', default: '' }, // Credit/Debit/Move
            flag: { type: 'string', default: '' },
			currency: { type: 'string', default:''}, // chip/diamond
			direction: {type: 'string', default:''}, // credit/debit/''
            amount: { type: 'number', default: 0 }, 
            transactionNumber: { type: 'string', default:'' }, // Null for Sys Transections
            status: { type: 'string', default: 'success' } // if trasection require some conditions
},{ collection: 'chipsdiamondhistory' });

mongoose.model('chipsdiamondhistory', ChipsDiamondHistorySchema);
 

 