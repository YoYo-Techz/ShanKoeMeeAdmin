const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const GameSchema = new Schema({
				roomId    : { 	type:'string',required:true },
				type  		: { 	type: 'string' },
				gameType  : { 	type: 'string', default: 'cash'	},
				gameNumber: { 	type : 'string'	},
				status	  : {	type: 'string',	default: ''	},
				history   : Schema.Types.Mixed,
				players   : Schema.Types.Mixed,
				winners   : Schema.Types.Mixed,
				losers    : Schema.Types.Mixed,
				// Rummy Special Fields
				jokerCard : Schema.Types.Mixed,
				openDeck  : Schema.Types.Mixed,
				closeDeck : Schema.Types.Mixed,
				finishDeck: Schema.Types.Mixed,
				declare   : Schema.Types.Mixed,
				updatedAt : { type: Date, default: Date.now() },
				createdAt : { type: Date, default: Date.now() },
				// TWENTYONE_CHANGE
				lowerJoker: Schema.Types.Mixed,
				upperJoker: Schema.Types.Mixed,
				superLowerJoker: Schema.Types.Mixed,
				superUpperJoker: Schema.Types.Mixed,
},{ collection: 'game', versionKey: false });
mongoose.model('game', GameSchema);
