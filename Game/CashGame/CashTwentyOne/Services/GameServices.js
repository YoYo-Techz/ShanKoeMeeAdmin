'use strict';
var Sys = require('../../../../Boot/Sys');

const mongoose = require('mongoose');
const gameModel  = mongoose.model('game');


module.exports = {

    create: async function(data){
       // //console.log('Create Game Called -------:',data)
        try {
            let gameCount = await gameModel.countDocuments({'gameType': data.gameType});

            Sys.Log.info('<=> gameCount|| '+gameCount);
            let gameNumber = 'RPP' + (gameCount + 1);

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
                // TWENTYONE_CHANGE
                "lowerJoker": [],
                "upperJoker": []
            }



			// let game =  new Sys.Game.CashGame.CashTwentyOne.Entities.Game(null,gameObj.roomId,gameObj.status, gameObj.pot, gameObj.history, gameObj.gameNumber, gameObj.gameType, gameObj.jokerCard, gameObj.openDeck, gameObj.closeDeck, gameObj.finishDeck, gameObj.declare);

            let gameSave = new gameModel(gameObj);
            let game = await gameSave.save(); // Save Game

            if(game){
                    return new Sys.Game.CashGame.CashTwentyOne.Entities.Game().createObject(game);
                   // return new Sys.Game.CashGame.CashTwentyOne.Entities.Game(game.id,game.roomId,game.status, game.pot, game.history, game.gameNumber, game.gameType, game.jokerCard, game.openDeck, game.closeDeck, game.finishDeck, game.declare); // return Room

            }else{
                return new Error("Game Not Created !");
            }


        } catch (error) {
            Sys.Log.info('Error in Create Game : ' + error);
            return new Error("Error in Create Game !");
           // return  error;
        }
	}
 }
