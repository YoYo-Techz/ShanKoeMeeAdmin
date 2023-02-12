const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const seoSchema = new Schema({
	url  : String,
	title : String,
	description : String,
	keywords: String,
	createdAt : { type : Date , default: Date.now} ,
	modifiedAt : { type : Date , default: Date.now}
			 
},{ collection: 'SEO' });
mongoose.model('SEO', seoSchema);
 