const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const TDSSettingSchema = new Schema({
    point_rummy: {
    	Drop_me_on_3_missed_moves:{type : Boolean},
    	Auto_Play_till_the_game_ends:{type : Boolean}
    },
	pool_rummy: {
		Drop_me_on_3_missed_moves:{type : Boolean},
    	Auto_Play_till_the_game_ends:{type : Boolean}
	},
	deal_rummy:{
		Drop_me_on_3_missed_moves:{type : Boolean},
    	Auto_Play_till_the_game_ends:{type : Boolean}
	}
},{ collection: 'disconnectionSettings', versionKey: false });

mongoose.model('disconnectionSettings', TDSSettingSchema);
