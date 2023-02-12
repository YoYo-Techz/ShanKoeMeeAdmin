const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const promocodeSchema = new Schema({
	name:{
		type: 'string',
		required: true,
	},
	status:{
		type: 'string',
		required: true,
	},
	code: {
		type: 'string',
		required: true,
	},
	// image:{
	// 	type: 'string',
	// 	required: true,
	// },
	min_transaction: {
		type: 'number',
		required: true,
	},
	offer: {
		type: 'number',
		required: true,
	},
	maximum_offer: {
		type: 'number',
		required: true,
	},
	usage_limit: {
		type: 'number',
		required: true,
	},
	individual_usage_limit: {
		type: 'number',
		required: true,
	},
    start_date: {
		type: Date,
		required: true
	},
	end_date: {
		type: Date,
		required: true
	},
},{ collection: 'promocode', versionKey: false });
mongoose.model('Promocode',promocodeSchema);
