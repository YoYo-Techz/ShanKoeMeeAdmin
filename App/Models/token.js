const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const TokenSchema = new Schema({
			user: {
				model: { type: Schema.Types.ObjectId, ref: 'user' }
				
			},
			token: {
				type: 'string',
				required: true
			},
			type: {
				type: 'string',
				required: true
			},
			is_revoked:{
				type:'boolean',
				required:true
			}

},{ collection: 'token' });
mongoose.model('token', TokenSchema);
 