const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const RoomSchema = new Schema({
            tableType     : { type: 'string', required: true },
            name          : { type: 'string', required: true },
            tableNumber   : { type: 'string', required: true },
            dealer        : { type: 'number', required: true },
            minPlayers    : { type: 'number', required: true },
            maxPlayers    : { type: 'number', required: true },
            type          : { type: 'string' },
            owner         : { type: 'string' }, // admin or user
            gameType      : { type: 'string' },
            entryFees     : { type: 'string' }, // admin or user
            currentPlayer : { type: 'number', allowNull: true },
            players       : { type: 'array' },
            gameWinners   : { type: 'array' },
            gameLosers    : { type: 'array' },
            status        : { type: 'string' }, // closed for deleted rooms
            game          : { type: 'string' },
            varient       : { type: 'string'},
            numberOfDecks : { type: 'number', required: true },
            printedJoker  : { type: 'string', required: true },
            timerStart    : { type: 'boolean'},
            gameOverPoint : { type: 'number'},
            gamecount     : { type: 'number'},
            pointsValue   : { type: 'number'},
            rack          : { type: 'number'},
            // TWENTYONE_CHANGE
            lowerJoker    : { type: 'string'},
            upperJoker    : { type: 'string'},
            valueCards    : { type: 'array' },
            // TWENTYFOUR_CHANGE
            superLowerJoker    : { type: 'string'},
            superUpperJoker    : { type: 'string'},
      },{
            collection: 'room',
            versionKey: false
      });
mongoose.model('room', RoomSchema);
