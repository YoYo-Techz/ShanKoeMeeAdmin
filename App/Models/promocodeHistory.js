const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const promocodeHistorySchema = new Schema({

	playerId: { type: 'string', required: true },
	promocode: { type: 'string', required: true },
	transactionNumber: {type: 'string', required: true},
	offeredChips: {type: 'string', required: true},
	createdAt : { type: Date, default: Date.now() },
	updatedAt : { type: Date, default: Date.now() },

},{ collection: 'promocodeHistory',versionKey: false  });
mongoose.model('promocodeHistory', promocodeHistorySchema);
