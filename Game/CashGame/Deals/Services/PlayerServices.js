'use strict';

const mongoose = require('mongoose');
const playerModel  = mongoose.model('player');
const socketModel  = mongoose.model('socket');
const cashManageModel  = mongoose.model('playerCashManage');
const cashDepositModel  = mongoose.model('playerDepositManage');
const playerChipsCashHistoryModel  = mongoose.model('playerChipsCashHistory');

module.exports = {
    getOneByData: async function(data){
        //console.log('Find By Data:',data)
        try {
			return  await playerModel.findOne(data);
        } catch (error) {
            Sys.Log.info('Error in getOneByData : ' + error);
        }
	},
	getByData: async function(data){

        try {
			return  await playerModel.find(data);
        } catch (error) {
            Sys.Log.info('Error in getByData : ' + error);
        }
    },
    getById: async function(id){

        try {
			return  await playerModel.findById(id);
        } catch (error) {
            Sys.Log.info('Error in getByData : ' + error);
        }
	},
    update: async function(id,query){
        try {

            let  player = await playerModel.findOneAndUpdate({_id: id},query, {new: true});
			return player;

        } catch (error) {
            Sys.Log.info('Error in Update Player : ' + error);
        }
    },
    cerateChipsCashHistory: async function(query){
        try {
            //console.log("query :",query);
			const playerChipsCashHistorySchema = new playerChipsCashHistoryModel(query);
            return await playerChipsCashHistorySchema.save();
        } catch (error) {
            Sys.Log.info('Error in cerateChipsCashHistory : ' + error);
            return new Error(error);
        }
	},

  getCashManager: async function(data){
        try {
         return  await cashManageModel.findOne(data);
        } catch (e) {
          //console.log("Error",e);
        }
	},

  updateCashManager: async function(condition, data){
        try {
         return  await cashManageModel.updateOne(condition, data);
        } catch (e) {
          //console.log("Error",e);
        }
	},

  getLastDepositManager: async function(data){
        try {
         return  await cashDepositModel.findOne(data).sort('_id DESC');
        } catch (e) {
          //console.log("Error",e);
        }
	},

  updateDepositManager: async function(condition, data){
        try {
         return  await cashDepositModel.updateOne(condition, data);
        } catch (e) {
          //console.log("Error",e);
        }
	},


}
