'use strict';

const mongoose = require('mongoose');
var Sys = require('../../Boot/Sys');
const chipsModel  = mongoose.model('chipsHistory');
const loginHistoryModel  = mongoose.model('loginHistory');


module.exports = {

	getByData: async function(data){
        console.log('Find By Data:',data)
        try {
          return  await chipsModel.find(data);
        } catch (e) {
          console.log("Error",e);
        }
	},

  getChipsData: async function(data){
        try {
          return  await chipsModel.find(data);
        } catch (e) {
          console.log("Error",e);
        }
	},

	getSingleChipsData: async function(data){
        try {
          return  await chipsModel.findOne(data);
        } catch (e) {
          console.log("Error",e);
        }
  },

  getChipsDatatable: async function(query, length, start){
        try {
          return  await chipsModel.find(query).skip(start).limit(length);
        } catch (e) {
          console.log("Error",e);
        }
	},

  insertChipsData: async function(data){
        try {
          await chipsModel.create(data);
        } catch (e) {
          console.log("Error",e);
        }
	},

  deleteChips: async function(data){
        try {
          await chipsModel.deleteOne({_id: data});
        } catch (e) {
          console.log("Error",e);
        }
  },

	updateChipsData: async function(condition, data){
        try {
          await chipsModel.update(condition, data);
        } catch (e) {
          console.log("Error",e);
        }
	},

  getLoginHistoryData: async function(data){
        try {
          return  await loginHistoryModel.find(data);
        } catch (e) {
          console.log("Error",e);
        }
  },

  getLoginDatatable: async function(query, length, start){
        try {
          return  await loginHistoryModel.find(query).skip(start).limit(length);
        } catch (e) {
          console.log("Error",e);
        }
  }

}
