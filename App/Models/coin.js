const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const CoinSchema = new Schema({
			detail: {
				type: 'string',
				required: true
			},
},{ collection: 'coin' });
mongoose.model('coin', CoinSchema);
 