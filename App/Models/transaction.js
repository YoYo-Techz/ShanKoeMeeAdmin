const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const TournamentSchema = new Schema({
			 	phone: {
					type: 'number',
					required: true
				},
				amount: {
						type: 'number',
						required: true
					},
				playerId: {
						type: 'string',
						required: true
				},
				firstname: {
						type: 'string',
						required: true
				},
				email: {
					type: 'string',
					required: true
				},
				orderId: {
					type: 'string',
					required: true
				},
       			productinfo: {
					type: 'string',
					required: true
				},
				type: {
					type: 'string',
					// required: true
				},
				status: {
					type: 'string',
					// required: true
				},

				mihpayid: {
					type: 'string',
					// required: true
				},
				hash: {
					type: 'string',
					// required: true
				},
				encryptedPaymentId: {
					type: 'string',
					// required: true
				},
				bank_ref_num: {
					type: 'string',
					// required: true
				},
				payuMoneyId: {
					type: 'string',
					// required: true
				},
				paymentLink:{
					type:'string',
				},
				paymentId:{
					type:'string',
				},
				payment_type:{
					type:'string',
				},
				CHECKSUMHASH:{
					type:'string',
				},
				createdAt : { type: Date },
 				updatedAt : { type: Date },
 				
			 
	},{ collection: 'transaction',versionKey: false });
mongoose.model('transaction', TournamentSchema);
