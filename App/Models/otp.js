const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const OtpSchema = new Schema({
    playerId : { 
      	type: 'string',
      	default: ''
    },
    otp : { 
    	type: 'number',
    	default: '' 
    },
    createAt : { 
    	type: Date,
    	default: Date.now 
    },
},{ collection: 'otp', versionKey: false });

mongoose.model('otp', OtpSchema);