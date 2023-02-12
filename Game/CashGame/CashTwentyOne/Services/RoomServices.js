'use strict';
var Sys = require('../../../../Boot/Sys');

const mongoose = require('mongoose');
const roomModel  = mongoose.model('room');
const gameModel  = mongoose.model('game');
const settingModel  = mongoose.model('gameSettings');
const comissionModel  = mongoose.model('adminCommission');
const tdsModel  = mongoose.model('tdsChargeSchema');
const tdsSettingsModel  = mongoose.model('tdsSettings');
const entryFeesSettingsModel  = mongoose.model('entryChipsSettings');

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
            let tableCount = await roomModel.countDocuments({'gameType': 'cash_points21'});
            let settings = await settingModel.findOne({'points': data.pointsValue});
            //console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
            //console.log("data.pointsValue", data.pointsValue);
            //console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
            //console.log("settings", settings);
            //console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
            Sys.Log.info('<=> tableCount|| '+tableCount);
            let tableNumber = 'RPP' + (tableCount + 1);

            let roomObj = {
                "tableType"               : data.gameType.toLowerCase(),
                "name"                    : data.gameType+' Rummy',
                "dealer"                  : 0,
                "minPlayers"              : 2,
                "maxPlayers"              : data.noOfSeats,
                "tableNumber"             : tableNumber,
                "status"                  : "waiting",
                "type"                    : "CashGame",
                "owner"                   : "user",
                "gameType"                : data.gameType.toLowerCase(),
                "rack"                    : settings.rack,
                "pointsValue"             : data.pointsValue,
                "players"                 : [],
                "gameWinners"             : [],
                "gameLosers"              : [],
                "game"                    : null,
                "currentPlayer"           : 0,
                "isLimitGame"             : false,
                "entryFees"               : data.entryFees,
                "varient"                 : "",
                "numberOfDecks"           : 2,
                "printedJoker"            : 2,
                "timerStart"              : false,
                "gameOverPoint"           : 0,
                // TWENTYONE_CHANGE
                "lowerJoker"              : 3,
                "upperJoker"              : 4,
                "valueCards"              : [],

            }

			// let room =  new Sys.Game.CashGame.CashTwentyOne.Entities.Room(null,roomObj.tableType,roomObj.name, roomObj.tableNumber, roomObj.dealer, roomObj.minPlayers, roomObj.maxPlayers, roomObj.type, roomObj.owner, roomObj.gameType, roomObj.entryFees, roomObj.currentPlayer, roomObj.players,   roomObj.gameWinners, roomObj.gameLosers, roomObj.status, roomObj.game, roomObj.varient,roomObj.numberOfDecks,roomObj.printedJoker,roomObj.timerStart,roomObj.gameOverPoint);
            let room = await roomModel.create(roomObj)
            room.id = room._id;

            let roomSave = new roomModel(roomObj);
            // let room = await roomSave.save(); // Save Room
            //console.log("room", room);
            // room.id = room._id
            if(room){
                Sys.Rooms[room.id] = new Sys.Game.CashGame.CashTwentyOne.Entities.Room().createObject(room);
                return Sys.Rooms[room.id]; // return Room
            }else{
                return new Error("Room Not Created !");
            }

        } catch (error) {
            Sys.Log.info('Error in Create Room : ' + error);
           return new Error("Error in Create Room !");
        }
	},
    get: async function(id){
        try {
			if(Sys.Rooms[id]){
               		return Sys.Rooms[id];
			}else{
                let room = await roomModel.findOne({'_id' :id});
                Sys.Rooms[room.id] = new Sys.Game.CashGame.CashTwentyOne.Entities.Room().createObject(room);
				return Sys.Rooms[room.id];
            }
        } catch (error) {
            Sys.Log.info('Error in Get Room : ' + error);
            return new Error("Error in Get Room !");
        }
	},
    update: async function(room){
        try {
          ////console.log("Rooms Update Called ->",room.id);
          let tempRoom = room.toJson();
			if(room){
                if (room.game) {
                  let  updatedGame = await gameModel.updateOne({_id: room.game.id},tempRoom.game, {new: true});
                  tempRoom.game = room.game.id;
                }
                let updatedtempRoom = await roomModel.updateOne({_id: room.id},tempRoom, {new: true});
				return room;
			}else{
                Sys.Log.info('No Room Updated : ');
                return room;
			}
        } catch (error) {
            Sys.Log.info('Error in Update Room : ' + error);
            return new Error("Error in Update Room !");
        }
    },
    resetAllRoom : async function(){
        try {
            let rooms = await roomModel.find({});
            rooms.forEach( async function(room) {
                room.status = 'Finished';
                room.players = [];
                room.gameWinners = [];
                room.dealer = 0;
                room.game = null;
                room.timerStart = false;
                let  updatedGame = await roomModel.updateOne({_id: room.id},room,{new: true});
            });
        } catch (error) {
            Sys.Log.info('Error in reset All Room  : ' + error);
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

     getData: async function(data){
        try {
          return  await entryFeesSettingsModel.find(data);
        } catch (e) {
          //console.log("Error",e);
        }
      },

}
