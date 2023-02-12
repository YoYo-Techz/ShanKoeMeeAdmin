const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const AvatarSchema = new Schema({
		avatarName: {
			type: 'string',
			required: true
		},
		image: {
			type: 'string',
			default: ''
		}
},{ collection: 'avatar' });

mongoose.model('avatar', AvatarSchema);

