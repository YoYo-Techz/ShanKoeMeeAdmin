'use strict';
var Sys = require('../../../../Boot/Sys');

const mongoose = require('mongoose');
const roomModel  = mongoose.model('room');
const gameModel  = mongoose.model('game');
const settingModel  = mongoose.model('gameSettings');
const comissionModel  = mongoose.model('adminCommission');
const tdsModel  = mongoose.model('tdsChargeSchema');
const tdsSettingsModel  = mongoose.model('tdsSettings');

module.exports = {
    getAllRoom: async function(data){
        try {
			return  await roomModel.find({});
        } catch (error) {
            Sys.Log.info('Room Service Error in getAllRoom : ' + error);
        }
    },
    getByData: async function(data){
        try {
			return  await roomModel.find(data);
        } catch (error) {
            Sys.Log.info('Room Service Error in getByData : ' + error);
        }
    },

    getCount: async function(){
        try {
			return  await roomModel.countDocuments({});
        } catch (error) {
            Sys.Log.info('Room Service Error in getCount : ' + error);
        }
    },
    create: async function(data){
        //console.log('Create Room Called -------:',data)
        try {
            let tableCount = await roomModel.countDocuments({'gameType': 'pool'});
            let settings = await settingModel.findOne({'score': data.score});

            Sys.Log.info('<=> tableCount|| '+tableCount);
            let tableNumber = 'RPP' + (tableCount + 1);
            //console.log('settings', settings);
            //console.log('rack', settings.rack);
            let roomObj = {
                "id": null,
                "tableType": data.gameType.toLowerCase(),
                "name": data.gameType+' Rummy',
                "dealer" : 0,
                "minPlayers": 2,
                "maxPlayers": data.noOfSeats,
                "tableNumber": tableNumber,
                "status": "waiting",
                "type": "CashGame",
                "owner": "user",
                "gameType" : data.gameType.toLowerCase(),
                "rack"  : settings.rack,
                "players": [],
                "gameWinners": [],
                "gameLosers": [],
                "game": null,
                "currentPlayer": 0,
                "isLimitGame": false,
                "entryFees" :data.entryFees,
                "varient" : "",
                "numberOfDecks" : 1,
                "printedJoker" : 2,
                "timerStart" : false,
                "gameOverPoint" : data.gameOverPoint,
                "gamecount" : 0,
                "participantPlayers"  : [],

            }
            let room = await roomModel.create(roomObj)
            room.id = room._id;

			       // let room =  new Sys.Game.CashGame.Pool.Entities.Room(null,roomObj.tableType,roomObj.name, roomObj.tableNumber, roomObj.dealer, roomObj.minPlayers, roomObj.maxPlayers, roomObj.type, roomObj.owner, roomObj.gameType, roomObj.entryFees, roomObj.currentPlayer, roomObj.players,   roomObj.gameWinners, roomObj.gameLosers, roomObj.status, roomObj.game, roomObj.varient,roomObj.numberOfDecks,roomObj.printedJoker,roomObj.timerStart,roomObj.gameOverPoint);
            let roomSave = new roomModel(roomObj);
            // room = await roomSave.save(); // Save Room
            ;
            if(room){

              Sys.Rooms[room.id] = new Sys.Game.CashGame.Pool.Entities.Room().createObject(room);
                    // Sys.Rooms[room.id]  = new Sys.Game.CashGame.Pool.Entities.Room(room.id, room.tableType,room.name, room.tableNumber, room.dealer, room.minPlayers, room.maxPlayers, room.type, room.owner, room.gameType, room.entryFees, room.currentPlayer, room.players,   room.gameWinners, room.gameLosers, room.status, room.game, room.varient,room.numberOfDecks,room.printedJoker,room.timerStart,room.gameOverPoint); // Save room in Rooms object

                    return Sys.Rooms[room.id]; // return Room

            }else{
                return new Error("Room Not Created !");
            }


        } catch (error) {
            Sys.Log.info('Error in Create Room : ' + error);
           // return  error;
        }
	},
    get: async function(id){

        try {

			if(Sys.Rooms[id]){
				return Sys.Rooms[id];
			}else{
                let room = await roomModel.findOne({'_id' :id});
                Sys.Rooms[room.id] = new Sys.Game.CashGame.Pool.Entities.Room().createObject(room);
                //  Sys.Rooms[room.id]  = new Sys.Game.CashGame.Pool.Entities.Room(room.id, room.tableType,room.name, room.tableNumber, room.dealer, room.minPlayers, room.maxPlayers, room.type, room.owner, room.gameType, room.entryFees, room.currentPlayer, room.players,   room.gameWinners, room.gameLosers, room.status, room.game, room.varient,room.numberOfDecks,room.printedJoker,room.timerStart,room.gameOverPoint); // Save room in Game object
				return Sys.Rooms[room.id];
			}
        } catch (error) {
            Sys.Log.info('Error in Get Room : ' + error);
        }
	},
    update: async function(room){

        let tempRoom = room.toJson();
        try {
			if(tempRoom){
                if (tempRoom.game) {
                  let  updatedGame = await gameModel.updateOne({_id: room.game.id},tempRoom.game, {new: true});
                  tempRoom.game = updatedGame.id; // Store Game ID for Save Room
                }
                let updatedtempRoom = await roomModel.updateOne({_id: tempRoom.id},tempRoom, {new: true});
				return room;
			}else{
                Sys.Log.info('No Room Updated : ');
                return room;
			}
        } catch (error) {
            Sys.Log.info('Error in Update Room : ' + error);
        }
	},

  createCommission : async function(data){
    try {
      await comissionModel.create(data);
    } catch (error) {
      Sys.Log.info('Error in createCommission  : ' + error);
      return new Error("Error in Update Room !");
    }
  },

  createTds : async function(data){
    try {
      await tdsModel.create(data);
    } catch (error) {
      Sys.Log.info('Error in createCommission  : ' + error);
      return new Error("Error in Update Room !");
    }
  },
  getSettingsData: async function(data){
    try {
      return  await tdsSettingsModel.findOne(data);
    } catch (e) {
      //console.log("Error",e);
    }
  },

}
