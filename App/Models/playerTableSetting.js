const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const TableSettingSchema = new Schema({
  playerId        : { type: 'string', required: true },
  sound           : { type: 'number', required: true },
  vibration       : { type: 'number', required: true },
  selectedtable   : { type: 'number', required: true },
  selectedbg      : { type: 'number', required: true },

},{ collection: 'playerTableSetting', versionKey: false });

mongoose.model('playerTableSetting', TableSettingSchema);
