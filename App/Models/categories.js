const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const CategoriesSchema = new Schema({
			categoryName: {
				type: 'string',
				required: true
			},
			status: {
				type: 'string',
				required: true
			}
},{ collection: 'categories' });

mongoose.model('categories', CategoriesSchema);
 
