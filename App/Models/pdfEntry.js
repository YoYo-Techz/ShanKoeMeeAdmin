const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const pdfEntrySchema = new Schema({
			pdfname: {	type: 'string',	required: true	},
			
},{ collection: 'pdfEntry', versionKey: false });
mongoose.model('pdfEntry', pdfEntrySchema);