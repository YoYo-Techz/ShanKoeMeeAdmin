const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const SettingSchema = new Schema({
    /*minPoints:{type: 'string'},
    maxPoints:{type: 'string'},
    poolMinEntryFee:{type: 'string'},
    poolMaxEntryFee:{type: 'string'},
    dealMinEntryFee:{type: 'string'},
    dealMaxEntryFee:{type: 'string'},*/
		points: {type: 'string'},
    score: {type: 'string'},
    deals: {type: 'string'},
    players: {type: 'string'},
    entryFee: {type: 'string'},
    prize: {type: 'string'},
    gameType: {type: 'string'},
		rack: {type: 'string'},
		firstprize: {type: 'string'},
		secondprize: {type: 'string'},
		thirdprize: {type: 'string'},

},{ collection: 'gameSettings', versionKey: false });

mongoose.model('gameSettings', SettingSchema);
