'use strict';

const mongoose = require('mongoose');
const Sys = require('../../Boot/Sys');
const promocodeModel = mongoose.model('Promocode');
const promocodeHistoryModel  = mongoose.model('promocodeHistory');

module.exports = {
	getByData: async function(data){
        console.log('Find By Data:',data)
        try {
          return  await promocodeModel.find(data);
        } catch (e) {
          console.log("Error",e);
        }
	},

  getPromocodeData: async function(data){
        try {
          return  await promocodeModel.find(data);
        } catch (e) {
          console.log("Error",e);
        }
	},

  getPromocodeCount: async function(data){
    try {
          return  await promocodeModel.countDocuments(data);
        } catch (e) {
          console.log("Error",e);
    }
  },

	getSinglePromocodeData: async function(data){
        try {
          return  await promocodeModel.findOne(data);
        } catch (e) {
          console.log("Error",e);
        }
	},

  getPromocodeDatatable: async function(query, length, start){
        try {
          if(length==-1)
          {
            return  await promocodeModel.find(query);
          }else{
            return  await promocodeModel.find(query).skip(start).limit(length);
          }
        } catch (e) {
          console.log("Error",e);
        }
	},

  insertPromocodeData: async function(data){
        try {
          return await promocodeModel.create(data);
        } catch (e) {
          console.log("Error",e);
          throw e;
        }
	},

  deletePromocode: async function(data){
        try {
          await promocodeModel.deleteOne({_id: data});
        } catch (e) {
          console.log("Error",e);
        }
  },

	updatePromocodeData: async function(condition, data){
        try {
          await promocodeModel.update(condition, data);
        } catch (e) {
          console.log("Error",e);
        }
	},

  getLimitPromocode: async function(data){
        try {
          return  await promocodeModel.find(data).limit(8).sort({createdAt:-1});
        } catch (e) {
          console.log("Error",e);
        }
  },

  getHistoryPopulatedData: async function(query, select, setOption, populateWith){
    try {
      return  await promocodeHistoryModel.find(query,select, setOption).populate(populateWith);
    } catch (e) {
      console.log("Error",e);
      throw new Error('error in getPopulatedData'+ e.message);
    }
  },

  getHistoryCount: async function(data){
    try {
          return  await promocodeHistoryModel.countDocuments(data);
        } catch (e) {
          console.log("Error",e);
    }
  },

	createPromoApplyHistory: async function(data){
        try {
          return await promocodeHistoryModel.create(data);
        } catch (e) {
          console.log("Error",e);
          throw e;
        }
	},

}
