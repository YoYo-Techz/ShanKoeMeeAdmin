const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const PlayerSchema = new Schema({



			playerId											: {	type: 'string',	required: true	},
			transactionId									:	{	type: 'string' },
			depositCash										: {	type: 'number',	required: true	},
			lockCash											: {	type: 'number',	required: true	},
			requiredRewardPoint						: {	type: 'number',	required: true	},
			status												:	{	type: 'string',	required: true	},
			requiredRewardPointReached		:	{	type: 'boolean',	required: true	},
			updatedAt 										: { type: Date },
			createdAt 										: { type: Date }
},{ 	collection										: 'playerDepositManage', versionKey: false });
mongoose.model('playerDepositManage', PlayerSchema);
