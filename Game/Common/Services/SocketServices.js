'use strict';

const mongoose = require('mongoose');
const socketModel  = mongoose.model('socket');


module.exports = { 
    
    update: async function(data){
        try {
            let socketData = await socketModel.findOneAndUpdate({ playerId : data.playerId }, { socketId: data.socketId });
            if(!socketData){
                return new Error('No Record Found!');
            }else{
                return socketData;
            }
           
         } catch (e) {
            //console.log("Error",e);
        }
    },
    getByPlayerID: async function(data){
        //console.log('Find Socekt By Data:',data)
        try {
			return  await socketModel.findOne(data);
        } catch (e) {
            //console.log("Error",e);
            
        }
    } 	
}
 
 
