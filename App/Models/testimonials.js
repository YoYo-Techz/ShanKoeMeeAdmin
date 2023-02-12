const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const testimonialsSchema = new Schema({
	username: { type: 'string',required: true},
	photo: { type: 'string',required: true},
	description: { type: 'string',required: true},
	updatedAt : { type: Date, default: Date.now() },
	createdAt : { type: Date, default: Date.now() },
	createdBy: { type: 'string',default: "Admin"},
},{ collection: 'testimonials' });
mongoose.model('testimonials', testimonialsSchema);
 