'use strict';
var Sys = require('../../../../Boot/Sys');

const mongoose = require('mongoose');
const gameModel  = mongoose.model('game');


module.exports = {

    create: async function(data){
        //console.log('Create Game Called -------:',data)
        try {
            let gameCount = await gameModel.countDocuments({'gameType': data.gameType});

            Sys.Log.info('<=> gameCount|| '+gameCount);
            let gameNumber = 'RPP' + (gameCount + 1);
            //console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&");
            //console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&");
            //console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&");
            //console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&");
            //console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&");
            //console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&");
            //console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&");
            //console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&");
            //console.log("data.type", data.type);
            let gameObj = {
              "roomId": data.roomId,
              "status": data.status,
              "pot": 0,
              "players": [],
              "winners": [],
              "losers" : [],
              "history": [],
              "gameNumber": gameNumber,
              "type"  : data.type,
              "gameType": data.gameType,
              "jokerCard": [],
              "openDeck": [],
              "closeDeck": [],
              "finishDeck": [],
              "declare": [],
            }

			// let game =  new Sys.Game.CashGame.Pool.Entities.Game(null,gameObj.roomId,gameObj.status, gameObj.pot, gameObj.history, gameObj.gameNumber, gameObj.gameType, gameObj.jokerCard, gameObj.openDeck, gameObj.closeDeck, gameObj.finishDeck, gameObj.declare);

            let gameSave = new gameModel(gameObj);
            let game = await gameSave.save(); // Save Game
            if(game){
              return new Sys.Game.CashGame.Pool.Entities.Game().createObject(game);


                    // return new Sys.Game.CashGame.Pool.Entities.Game(game.id,game.roomId,game.status, game.pot, game.history, game.gameNumber, game.gameType, game.jokerCard, game.openDeck, game.closeDeck, game.finishDeck, game.declare); // return Room

            }else{
                return new Error("Game Not Created !");
            }


        } catch (error) {
            Sys.Log.info('Error in Create Game : ' + error);
           // return  error;
        }
	},
    get: async function(id){
        //console.log("Room Get Called ->",id);
        try {

			if(Sys.Rooms[id]){
				return Sys.Rooms[id];
			}else{
                let room = await roomModel.findOne({'_id' :id});
                 Sys.Rooms[room.id]  = new Sys.Game.CashGame.Pool.Entities.Room(room.id, room.tableType,room.name, room.tableNumber, room.dealer, room.minPlayers, room.maxPlayers, room.type, room.owner, room.gameType, room.entryFees, room.currentPlayer, room.players,   room.gameWinners, room.gameLosers, room.status, room.game, room.varient,room.numberOfDecks,room.printedJoker,room.timerStart,room.gameOverPoint); // Save room in Game object
				return Sys.Rooms[room.id];
			}
        } catch (error) {
            Sys.Log.info('Error in Get Room : ' + error);
        }
	},



}
