const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const OffersSchema = new Schema({
			name: {
				type: 'string',
				required: true
			},
			id: {
				type: Number,
				required: true
			},
			title: {
				type: 'string',
				required: true
			},
			terms: {
				type: 'string',
				required: true
			},
			createdBy: {
				type: 'string',
				required: true
			},
			updatedAt : { type: Date, default: Date.now() },
			createdAt : { type: Date, default: Date.now() }
},{ collection: 'offers' });

mongoose.model('offers', OffersSchema);
 
