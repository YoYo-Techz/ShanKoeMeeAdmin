const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const GiftsSchema = new Schema({
			giftName: {
				type: 'string',
				required: true
			},
			image: {
				type: 'string',
				default: ''
			},
			// key: {
			// 	type: 'string',
			// 	required: true
			// },
			// value: {
			// 	type: 'string',
			// 	default: ''
			// },
			categoryId: {
				type: 'string',
				required: true
			}
},{ collection: 'gifts' });
mongoose.model('gifts', GiftsSchema);
 
