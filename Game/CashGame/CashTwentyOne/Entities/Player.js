class Player {
    constructor (id,socketId,username, avatar, status, appid, chips,cash,pointValue,totalPoint,playerScore,cardsString,seatIndex,isBot,cardTurn,declare,dropped,droppedCount,timerPosition,cards,defaultActionCount,extraTime,turnCount,jokercardnumber, uppercardnumber, lowercardnumber,superuppercardnumber,superlowercardnumber, marriageindex, superioindex, valuecards) {
        this.id                     = id;
        this.socketId               = socketId;
        this.username               = username;
        this.avatar                 = avatar;
        this.status                 = status;
        this.appid                  = appid;
        this.chips                  = chips;
        this.cash                   = cash;
        this.pointValue             = (pointValue)?pointValue:0;  // For Deal / Pool
        this.totalPoint             = (totalPoint)?totalPoint:0; //  For Deal / Pool
        this.playerScore            = (playerScore)?playerScore:0;  // Winnig Calualtion Depend on this
        this.cardsString            = (cardsString)?cardsString:'';
        this.seatIndex              = seatIndex;
        this.isBot                  = isBot||false;
        this.cardTurn               = cardTurn||true;
        this.declare                = declare||false;
        this.dropped                = (dropped)?dropped:false;
        this.droppedCount           = (droppedCount)?droppedCount:0;
        this.timerPosition          = (timerPosition)?timerPosition:1;
        this.cards                  = (cards)?cards:[];
        this.defaultActionCount     = (defaultActionCount)?defaultActionCount:0;
        this.extraTime              = extraTime;
        this.turnCount              = turnCount;
        this.wrongfinished          = false;
        this.jokercardnumber        = (jokercardnumber)?jokercardnumber:0;              // TWENTYONE_CHANGE
        this.uppercardnumber        = (uppercardnumber)?uppercardnumber:0;              // TWENTYONE_CHANGE
        this.lowercardnumber        = (lowercardnumber)?lowercardnumber:0;              // TWENTYONE_CHANGE
        this.superuppercardnumber   = (superuppercardnumber)?superuppercardnumber:0;    // TWENTYFOUR_CHANGE
        this.superlowercardnumber   = (superlowercardnumber)?superlowercardnumber:0;    // TWENTYFOUR_CHANGE
        this.marriageindex          = (marriageindex)?marriageindex:0;                  // TWENTYONE_CHANGE
        this.superioindex           = (superioindex)?superioindex:0;                    // TWENTYONE_CHANGE
        this.valuecards             = (valuecards)?valuecards:0;                        // TWENTYONE_CHANGE
    }
     createObject (player) {
     //   //console.log("Player ->>> Obj _:",player)
        return new Player(
            player.id,
            player.socketId,
            player.username,
            player.avatar,
            player.status,
            player.appid,
            player.chips,
            player.cash,
            player.pointValue,
            player.totalPoint,
            player.playerScore,
            player.cardsString,
            player.seatIndex,
            player.isBot,
            player.cardTurn,
            player.declare,
            player.dropped,
            player.droppedCount,
            player.timerPosition,
            player.cards,
            player.defaultActionCount,
            player.extraTime,
            player.turnCount,
            player.wrongfinished,
            player.jokercardnumber,           // TWENTYONE_CHANGE
            player.uppercardnumber,           // TWENTYONE_CHANGE
            player.lowercardnumber,           // TWENTYONE_CHANGE
            player.superuppercardnumber,      // TWENTYFOUR_CHANGE
            player.superlowercardnumber,      // TWENTYFOUR_CHANGE
            player.marriageindex,             // TWENTYONE_CHANGE
            player.superioindex,              // TWENTYONE_CHANGE
            player.valuecards                 // TWENTYONE_CHANGE

        )
    }
    // toJson () {
    //     var player = {
    //         id: this.id,
    //         socketId: this.socketId,
    //         seatIndex: this.seatIndex,
    //         username: this.username,
    //         avatar: this.avatar,
    //         appid:this.appid,
    //         status:this.status,
    //         chips: this.chips,
    //         cash: this.cash,
    //         dropped: this.dropped,
    //         droppedCount: this.droppedCount,
    //         timerPosition: this.timerPosition,
    //         pointValue : this.pointValue,
    //         playerScore : this.playerScore,
    //         cardsString : this.cardsString,
    //         cards: this.cards,
    //         defaultActionCount: this.defaultActionCount,
    //         isBot: this.isBot,
    //         cardTurn: this.cardTurn,
    //         declare: this.declare,
    //     }
    //     return player
    // }

}
module.exports = Player
