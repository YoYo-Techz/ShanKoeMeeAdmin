const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const BlogsSchema = new Schema({
			title: {
				type: 'string',
				required: true
			},
			title_url: {
				type: 'string'
			},
			id: {
				type: Number,
				required: true
			},
			description: {
				type: 'string',
				required: true
			},
			page_meta_title: {
				type: 'string'
			},
			page_meta_keywords: {
				type: 'string'
			},
			page_meta_description: {
				type: 'string'
			},
			page_meta_url: {
				type: 'string'
			},
			createdBy: {
				type: 'string',
				required: true
			},
			tag: {
				type: 'string'
			},
			isDisplayHomePage: {
				type: Boolean,
				required: true
			},
			categoryName : { type: mongoose.Schema.Types.ObjectId, ref: 'blogCategories' },
			// categoryName: {
			// 	type: 'string',
			// 	required: true
			// },
			photo:{
				type:'string'
			},
			photo1:{
				type:'string'
			},
			updatedAt : { type: Date, default: Date.now() },
			createdAt : { type: Date, default: Date.now() }
},{ collection: 'blogs' });

mongoose.model('blogs', BlogsSchema);
 
