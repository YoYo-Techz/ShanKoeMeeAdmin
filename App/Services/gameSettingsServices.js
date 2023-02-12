'use strict';

const mongoose = require('mongoose');
var Sys = require('../../Boot/Sys');
const gameSettingsModel  = mongoose.model('gameSettings');


module.exports = {


	getSettingsData: async function(data){
        try {
          return  await gameSettingsModel.findOne(data);
        } catch (e) {
          console.log("Error",e);
        }
	 },

  getByData: async function(data){
        try {
          return  await gameSettingsModel.find(data);
        } catch (e) {
          console.log("Error",e);
        }
  },

  getSettingsDataTable: async function(query, length, start){
        try {
          return  await gameSettingsModel.find(query).skip(start).limit(length);
        } catch (e) {
          console.log("Error",e);
        }
  },

  updateSettingsData: async function(condition, data){
        try {
          await gameSettingsModel.update(condition, data);
        } catch (e) {
          console.log("Error",e);
        }
  },

  insertSettingsData: async function(data){
        try {
          await gameSettingsModel.create(data);
        } catch (e) {
          console.log("Error",e);
        }
  },

  deleteSetting : async function(data){
      try {
        await gameSettingsModel.deleteOne({_id: data});
      } catch (e) {
        console.log("Error",e);
      }
  }


}
