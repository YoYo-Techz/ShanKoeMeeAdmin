const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const SettingSchema = new Schema({
    rackPercent : { type: 'string', required: true },
    // waitAfterRoundComplete :{ type: 'string'},
    // waitAfterGameReset :{ type: 'string'},
    // waitBeforeGameReset :{ type: 'string'},
    waitBeforeGameStart :{ type: 'string'},
    waitBeforGameRestart :{ type: 'string'},
    defualtPrcticesChips :{ type: 'string'},
    turnTime :{ type: 'string'},
    extraTime :{ type: 'string'},
    playerDropPoint :{ type: 'string'},
    declareTimer :{ type: 'string'},
    playerFirstDrop :{ type: 'string'},
    playerSecondDrop :{ type: 'string'},
    playerThirdDrop :{ type: 'string'},
    pointsValue :{ type: 'string'},
    gameOverPoint1 :{ type: 'string'},
    setPointValue1 :{ type: 'string'},
    gameOverPoint2 :{ type: 'string'},
    setPointValue2 :{ type: 'string'},
    defaultTotalPoints :{ type: 'string'},
    playerDropedRoundCount : { type: 'string'},
    currentVersion : { type: 'string'},

},{ collection: 'setting', versionKey: false });

mongoose.model('setting', SettingSchema);
