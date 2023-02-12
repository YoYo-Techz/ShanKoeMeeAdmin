'use strict';

const mongoose = require('mongoose');
var Sys = require('../../Boot/Sys');
const entryFeesSettingsModel  = mongoose.model('entryChipsSettings');


module.exports = {


	getSettingsData: async function(data){
        try {
          return  await entryFeesSettingsModel.findOne(data);
        } catch (e) {
          console.log("Error",e);
        }
	 },

  getByData: async function(data){
        try {
          return  await entryFeesSettingsModel.find(data);
        } catch (e) {
          console.log("Error",e);
        }
  },

  getSettingsDataTable: async function(query, length, start){
        try {
          return  await entryFeesSettingsModel.find(query).skip(start).limit(length);
        } catch (e) {
          console.log("Error",e);
        }
  },

  updateSettingsData: async function(condition, data){
        try {
          await entryFeesSettingsModel.update(condition, data);
        } catch (e) {
          console.log("Error",e);
        }
  },

  insertSettingsData: async function(data){
        try {
          await entryFeesSettingsModel.create(data);
        } catch (e) {
          console.log("Error",e);
        }
  },

  deleteSetting : async function(data){
      try {
        await entryFeesSettingsModel.deleteOne({_id: data});
      } catch (e) {
        console.log("Error",e);
      }
  }


}
