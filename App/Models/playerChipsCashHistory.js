const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ChipsSchema = new Schema({
      playerId           : { type: 'string', required: true },
      gameId             : { type: 'string' },
      userName:{type: 'string'},
      chips              : { type: 'string' },
      cash              : { type: 'string', required: true },
      gameType           : { type: 'string' }, // practice
      tableType         : { type: 'string' }, // points/ pool / deal
      tranType          :  { type: 'string' },   //cash/chips
      type              : { type: 'string' },   //debit/credit
      message            : { type: 'string', required: true },
      tableNumber         : { type: 'string' },
      transactionNumber : { type: 'string' },
      beforeBalance      : { type: 'string' },
      afterBalance      : { type: 'string' },
      status           : { type: 'string', required: true },
	createdAt  		: { type : Date, default : Date.now }

},{ collection: 'playerChipsCashHistory',versionKey: false });

mongoose.model('playerChipsCashHistory', ChipsSchema);
