const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const PlayerSchema = new Schema({
			playerId						: {	type: 'string',	required: true	},
			totalCash						: {	type: 'number',	required: true	},
			wonCash							: {	type: 'number',	required: true	},
			depositedCash				: {	type: 'number',	required: true	},
			lockCash						: {	type: 'number',	required: true	},
			withdrawLimit				: {	type: 'number',	required: true	},
			rewardPoint					: {	type: 'number', required: true  },
			requiredRewardPoint	:	{	type: 'number', required: true  },
			releasedCash				:	{	type: 'number', required: true  },
			updatedAt 					: { type: Date },
			createdAt 					: { type: Date }
},{ 	collection					: 'playerCashManage', versionKey: false });
mongoose.model('playerCashManage', PlayerSchema);
