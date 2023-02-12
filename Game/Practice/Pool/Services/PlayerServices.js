'use strict';

const mongoose = require('mongoose');
const playerModel  = mongoose.model('player');
const socketModel  = mongoose.model('socket');
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

}
 
 
