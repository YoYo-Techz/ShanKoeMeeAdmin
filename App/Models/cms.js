const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const CmsSchema = new Schema({
			identifier: {
				type: 'string',
				required: true
			},
			content: {
				type: 'string',
				required: true
			},
			status: {
				type: 'string',
				required: true
			}
			 
},{ collection: 'cms' });
mongoose.model('cms', CmsSchema);
 