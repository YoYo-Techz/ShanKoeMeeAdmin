const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const TDSSettingSchema = new Schema({
    amount: {type: 'string'},
	rack: {type: 'string'},

},{ collection: 'tdsSettings', versionKey: false });

mongoose.model('tdsSettings', TDSSettingSchema);
