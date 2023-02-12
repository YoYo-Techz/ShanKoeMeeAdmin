const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const entryChipsSettingSchema = new Schema({
    entryFees: {type: 'string'},
    gameType: {type: 'string'},
},{ collection: 'entryChipsSettings', versionKey: false });

mongoose.model('entryChipsSettings', entryChipsSettingSchema);
