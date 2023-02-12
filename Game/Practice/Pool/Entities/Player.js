class Player {
    constructor (id,socketId,username, avatar, status, appid, chips,cash,pointValue,totalPoint,playerScore,cardsString,seatIndex,isBot,cardTurn,declare,dropped,droppedCount,timerPosition,cards,defaultActionCount,extraTime,turnCount) {
        this.id = id;
        this.socketId = socketId;
        this.username = username;
        this.avatar = avatar;
        this.status = status;
        this.appid = appid;
        this.chips = chips;
        this.cash = cash;
        this.pointValue = (pointValue)?pointValue:0;  // For Not /Use in Pool Update
        this.totalPoint = (totalPoint)?totalPoint:0; //  Sum Of Total Points . When Player point sum is over then game over points
        this.playerScore = (playerScore)?playerScore:0;  //
        this.cardsString =  (cardsString)?cardsString:'';
        this.seatIndex = seatIndex;
        this.isBot = isBot||false;
        this.cardTurn = cardTurn||true;
        this.declare = declare||false;
        this.dropped = (dropped)?dropped:false;
        this.droppedCount = (droppedCount)?droppedCount:0;
        this.timerPosition = (timerPosition)?timerPosition:1;
        // this.room = room; //Circular reference to allow reference back to parent object.
        this.cards = (cards)?cards:[];
        this.defaultActionCount = (defaultActionCount)?defaultActionCount:0;
        this.extraTime = extraTime;
        this.turnCount = turnCount;
        this.wrongfinished = false;
    }
    // static createObject (player) {
    //     return new Player(
    //         player.id,
    //         player.socketId,
    //         player.seatIndex,
    //         player.username,
    //         player.avatar,
    //         player.appid,
    //         player.status,
    //         player.chips,
    //         player.cash,
    //         player.dropped,
    //         player.droppedCount,
    //         player.timerPosition,
    //         player.pointValue,
    //         player.playerScore,
    //         player.cardsString,
    //        // player.room,
    //         player.cards,
    //         player.defaultActionCount,
    //         player.isBot,
    //         player.cardTurn,
    //         player.declare,

    //     )
    // }
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
