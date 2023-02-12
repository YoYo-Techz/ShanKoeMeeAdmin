'use strict';
var Sys = require('../../../Boot/Sys');

const mongoose = require('mongoose');
const roomModel  = mongoose.model('room');
 

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
 
   
    get: async function(id){
        try {
			if(Sys.Rooms[id]){
 
                return Sys.Rooms[id];
                
			}else{
                let room = await roomModel.findOne({'_id' :id});
             

                Sys.Rooms[room.id]  = new Sys.Game.Practice.Points.Entities.Room(room.id, room.tableType,room.name, room.tableNumber, room.dealer, room.minPlayers, room.maxPlayers, room.type, room.owner, room.gameType, room.entryFees, room.currentPlayer, room.players,   room.gameWinners, room.gameLosers, room.status, room.game, room.varient,room.numberOfDecks,room.printedJoker,room.timerStart,room.gameOverPoint); // Save room in Game object
				return Sys.Rooms[room.id];
			}
        } catch (error) {
            Sys.Log.info('Error in Get Room : ' + error);
        }
	},
 	
}
 
 
