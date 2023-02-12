class Game {
    constructor(id, roomId, status, pot,players,winners,losers,history, gameNumber,type, gameType, jokerCard, openDeck, closeDeck, finishDeck,declare ) {
        this.id = id;
        this.roomId = roomId;
        this.status = (status) ? status : 'waiting';
        this.pot = (pot) ? pot : 0;
        this.players = (players) ? players : []
        this.winners = (winners) ? winners : []
        this.losers = (losers) ? losers : []
        this.history = (history) ? history : []
        this.gameNumber = gameNumber;
        this.type = type;
        this.gameType = gameType || 'cash';
        this.jokerCard = (jokerCard) ? jokerCard : '';
        this.openDeck  = (openDeck) ? openDeck : [];
        this.closeDeck = (closeDeck) ? closeDeck : [];
        this.finishDeck = (finishDeck) ? finishDeck : [];
        this.declare = (declare)?declare : [];
      
    }
 createObject (game) {
        return new Game(
            game.id,
            game.roomId,
            game.status,
            game.pot,
            game.players,
            game.winners,
            game.losers,
            game.history,
            game.gameNumber,
            game.type,
            game.gameType,
            game.jokerCard ,
            game.openDeck ,
            game.closeDeck ,
            game.finishDeck ,
            game.declare,
        )
    }
    toJson() {
        var game = {
            id: this.id,
            roomId: this.roomId,
            status: this.status,
            pot: this.pot,
            players: this.players,
            winners: this.winners,
            losers : this.losers,
            history: this.history,
            gameNumber: this.gameNumber,
            type : this.type,
            gameType: this.gameType,
            jokerCard: this.jokerCard,
            openDeck: this.openDeck,
            closeDeck: this.closeDeck,
            finishDeck: this.finishDeck,
            declare : this.declare,
      }
        return game
    }
}


module.exports = Game
