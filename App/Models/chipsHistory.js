const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ChipsSchema = new Schema({
                  user_id           : { type: 'string', required: true },
      username          : { type: 'string', required: true },
      chips             : { type: 'number', required: true },
      type              : { type: 'string', required: true },   //debit/credit
      reason            : { type: 'string', required: true },   //deposit/won on game <game_id>, deposit/withdraw coins
      gameId            : { type: 'string' },                   //in case of deposit/won on game
      transactionNumber : { type: 'string' },                   //If deposit/withdraw
      previousBalance   : { type: 'number' },
      afterBalance      : { type: 'number' },
      isValid           : { type: 'string', required: true },
                  createdAt                     : { type : Date, default : Date.now }

},{ collection: 'chipshistory' });

mongoose.model('chipsHistory', ChipsSchema);
