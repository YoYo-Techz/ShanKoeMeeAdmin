'use strict';

const mongoose = require('mongoose');
var Sys = require('../../Boot/Sys');
const room  = mongoose.model('room');


module.exports = {

	getByData: async function(data){
        console.log('Find By Data:',data)
        try {
          return  await room.find(data);
        } catch (e) {
          console.log("Error",e);
        }
	},

  getRoomData: async function(data){
        try {
          return  await room.find(data);
        } catch (e) {
          console.log("Error",e);
        }
	},

	getSingleRoomData: async function(data){
        try {
          return  await room.findOne(data);
        } catch (e) {
          console.log("Error",e);
        }
	},

  getRoomDatatable: async function(query, length, start){
        try {
          return  await room.find(query).skip(start).limit(length);
        } catch (e) {
          console.log("Error",e);
        }
	},

  insertRoomData: async function(data){
        try {
          await room.create(data);
        } catch (e) {
          console.log("Error",e);
        }
	},

  deleteRoom: async function(data){
        try {
          await room.deleteOne({_id: data});
        } catch (e) {
          console.log("Error",e);
        }
  },

	updateRoomData: async function(condition, data){
        try {
          await room.update(condition, data);
        } catch (e) {
          console.log("Error",e);
        }
	}

}
