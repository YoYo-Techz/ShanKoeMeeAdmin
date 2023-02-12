'use strict';

const mongoose = require('mongoose');
var Sys = require('../../Boot/Sys');
const disconnectionSettingsModel  = mongoose.model('disconnectionSettings');


module.exports = {


	// getSettingsData: async function(data){
 //        try {
 //          return  await tdsSettingsModel.findOne(data);
 //        } catch (e) {
 //          console.log("Error",e);
 //        }
	//  },

 //  getByData: async function(data){
 //        try {
 //          return  await tdsSettingsModel.find(data);
 //        } catch (e) {
 //          console.log("Error",e);
 //        }
 //  },

 //  getSettingsDataTable: async function(query, length, start){
 //        try {
 //          return  await tdsSettingsModel.find(query).skip(start).limit(length);
 //        } catch (e) {
 //          console.log("Error",e);
 //        }
 //  },

 //  updateSettingsData: async function(condition, data){
 //        try {
 //          await tdsSettingsModel.update(condition, data);
 //        } catch (e) {
 //          console.log("Error",e);
 //        }
 //  },

  insertDisconnectionSettingsData: async function(data){
        try {
          await disconnectionSettingsModel.create(data);
        } catch (e) {
          console.log("Error",e);
        }
  },

  // deleteSetting : async function(data){
  //     try {
  //       await tdsSettingsModel.deleteOne({_id: data});
  //     } catch (e) {
  //       console.log("Error",e);
  //     }
  // }


}
