const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const DocumentSchema = new Schema({
      playerId : {
      	type: 'string',
	    default: ''
      },
      playerName : {
      	type: 'string',
	    default: ''
      },
      document_type : {
	    type: 'string',
	    default: ''
      },
      other_document : {
      	type: 'string',
	    default: ''
      },
      take_photo : {
      	type: 'string',
	    default: ''
      },
      document : {
      	type: 'string',
	    default: ''
      },
      status : {
      	type: 'string',
	    default: ''
      },
},{ collection: 'uploadDocument', versionKey: false });

mongoose.model('uploadDocument', DocumentSchema);
