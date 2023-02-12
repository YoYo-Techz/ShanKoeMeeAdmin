const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const PlayerSchema = new Schema({
	playerId			: {	type: 'string',	required: true	},
	refferalPlayerId	: {	type: 'string',	required: true	},
	refferalCode	    : {	type: 'string',	required: true	},
	refferalBonus		: {	type: 'number',	required: true	},
	transactionId		: {	type: 'string' },
	status              : {	type: 'string', required: true},
	updatedAt 			: { type:  Date   , default: Date.now() },
	createdAt 			: { type:  Date   , default: Date.now() }
},{ collection : 'playerInstanceBonusDepositManage', versionKey: false });
mongoose.model('playerInstanceBonusDepositManage', PlayerSchema);
