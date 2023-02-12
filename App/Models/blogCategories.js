const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const blogCategoriesSchema = new Schema({
	name: { type: 'string',required: true},
	updatedAt : { type: Date, default: Date.now() },
	createdAt : { type: Date, default: Date.now() },
	createdBy: { type: 'string',default: "Admin"},
},{ collection: 'blogCategories', versionKey: false });
mongoose.model('blogCategories', blogCategoriesSchema);
 