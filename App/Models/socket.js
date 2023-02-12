const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const SocketSchema = new Schema({
      playerId : { type: 'string', required: true },
      socketId : { type: 'string', required: true }
      
},{ collection: 'socket', versionKey: false });

mongoose.model('socket', SocketSchema);