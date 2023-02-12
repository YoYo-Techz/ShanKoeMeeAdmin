const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var x = 6; //or whatever offset
var CurrentDate = new Date();
const PlayerSchema = new Schema({
			deviceId: {	type: 'string',	required: true	},
			appId: {type: 'string',	default: ''	},
			username: {	type: 'string',	default: ''	},
			firstname: {type: 'string',	default: ''	},
			lastname: {	type: 'string',	default: ''	},
			profilePic: {type: 'string'},
			isFbLogin: {type: 'boolean',default: false},
			email: {type: 'string',	default: ''},
			emailverified: {type: 'boolean', default: false },
			emailme: {type: 'boolean', default: false },
			password: {	type: 'string',	default: ''},
			chips: {type: 'string',	required: true	},
			cash: {	type: 'string',	required: true},
			cashTransaction: {	type: 'string',	required: true },
			rewardPoint: {	type: 'number',	required: true },
			status: {	type: 'string',	default: 'inactive'	},
			clubStatus:{type: 'string',	default: 'Jack'	},
			clubStatusValidTill:{type: Date,default: Date.now() },
			sessionId: {type: 'string',	default: ''	},
			socketId: {	type: 'string',	default: ''},
			bankName: {	type: 'string',	default: ''},
			accountNumber: { type: 'string', default: ''},
			accountHolderName: { type: 'string',default: ''},
			ifscCode: {	type: 'string',	default: ''},
			rating: {type: 'number',default: 0	},
			otp: {type: 'number'},
			mobile: {type: 'number',	},
			mobilelverified: {type: 'boolean', default: false },
			tdsAmount: { type: 'string', default: 0},
			birthyear: { type: 'string'},
			gender: { type: 'string'},
			state: { type: 'string'},
			signUpPromo: {type: 'String'},
			signupReferralCode: {type: 'String'},
			myReferralCode: {type: 'String'},
			instance_bonus:{type: 'string'},
			disconnection_settings : {
				point_rummy: {
			    	Drop_me_on_3_missed_moves:{type : Boolean, default: true},
			    	Auto_Play_till_the_game_ends:{type : Boolean, default: false}
			    },
				pool_rummy: {
					Drop_me_on_3_missed_moves:{type : Boolean, default: true},
			    	Auto_Play_till_the_game_ends:{type : Boolean, default: false}
				},
				deal_rummy:{
					Drop_me_on_3_missed_moves:{type : Boolean, default: true},
			    	Auto_Play_till_the_game_ends:{type : Boolean, default: false}
				}
			},
			updatedAt : { type: Date, default: Date.now() },
			createdAt : { type: Date, default: Date.now() }
},{ collection: 'player', versionKey: false });
mongoose.model('player', PlayerSchema);
