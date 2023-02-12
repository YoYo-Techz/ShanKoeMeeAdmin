'use strict';
var Sys = require('../../../Boot/Sys');
const mongoose = require('mongoose');
const playerModel  = mongoose.model('player');
const socketModel  = mongoose.model('socket');
const cashManageModel  = mongoose.model('playerCashManage');
const cashDepositModel  = mongoose.model('playerDepositManage');
const playerChipsCashHistoryModel  = mongoose.model('playerChipsCashHistory');
const playerSettingModel  = mongoose.model('playerTableSetting');
const roomModel  = mongoose.model('room');
module.exports = {

    create: async function(data){
        try {
            const playerSchema = new playerModel({
                appId : data.appId,
                deviceId : data.deviceId,
                username: data.username,
                email: data.email,
                password: data.password,
                ip : data.ip,
                isFbLogin : data.isFbLogin,
                profilePic: data.profilePic,
                cash: data.cash,
                chips:data.chips,
                cashTransaction: data.cashTransaction,
                rewardPoint: data.rewardPoint,
                status: data.status,
                instance_bonus:data.instance_bonus,
                myReferralCode:data.myReferralCode,
                signUpPromo:data.signUpPromo,
                signupReferralCode:data.signupReferralCode,
                mobile: data.mobile,
              });
              //console.log("playerSchema ->",playerSchema);
              let newPlayer = await playerSchema.save();
              if(newPlayer){
                //  New Player Register So Create New Entry in Socket DB
                 const playerSchema = new socketModel({
                    playerId : newPlayer.id,
                    socketId: '123'
                  });
                  playerSchema.socketId = '123';
                  playerSchema.playerId = newPlayer.id;

                  let newSocket = await playerSchema.save();
                newPlayer.socketId = '123';
                newPlayer.playerId = newPlayer.id;
                  //console.log("newPlayer ->",newPlayer);

                  return newPlayer;
              }else{
                return newPlayer;
              }

        } catch (error) {
            Sys.Log.info('Error in Create  Player : ' + error);
        }
    },
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
        Sys.Log.info('Error in getById : ' + error);
      }
    },
 	  update: async function(id,query){
        try {
            let updateplayer = await playerModel.findOneAndUpdate({_id: id},query, {new: true});
            return updateplayer;
        } catch (error) {
            Sys.Log.info('Error in Update Player : ' + error);
            return new Error("Error in Update Player");
        }
    },
    getChipsCashHistory: async function(query){
      try {
        return  await playerChipsCashHistoryModel.find(query).limit(10)
      } catch (error) {
        Sys.Log.info('Error in getChipsCashHistory : ' + error);
        return new Error(error);
      }
    },

    createCashManage: async function(data){
          try {
            return await cashManageModel.create(data);
          } catch (e) {
            //console.log("Error",e);
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

    getActiveGame : async function(query){
      let getData =  await roomModel.aggregate([
        { $match: {"players.id":query.id} },
        {
             $project : {
               _id : 1,
               type:1,
               tableType:1,
               minPlayers:1,
               status:1,
               gameType:1,
               currentPlayer:1,
               entryFees:1,
               printedJoker:1,
               name:1,

          }
        }
      ])

      return getData;
    },

    setPlayerSetting : async function(data){
      try {
        let getplayerSetting = await playerSettingModel.find({playerId: data.playerId});
        //console.log("getplayerSetting.length", getplayerSetting.length);
        if (getplayerSetting.length > 0) {
          // update the existing one
          let updateplayerSetting = await playerSettingModel.findOneAndUpdate( {playerId: data.playerId}, {sound: data.sound, vibration: data.vibration, selectedtable: data.selectedtable, selectedbg: data.selectedbg} );
          return updateplayerSetting;
        }else {
          // create a new One
          let updateplayerSetting = await playerSettingModel.create( {playerId: data.playerId, sound: data.sound, vibration: data.vibration, selectedtable: data.selectedtable, selectedbg: data.selectedbg} );
          return updateplayerSetting;
        }
      } catch (e) {
        //console.log("Error in setPlayerSetting", e);
      }
    },

    getPlayerSetting: async function(data){
        try {
          let responseData = {
            // playerId        : data.playerId,
            sound           : 1,
            vibration       : 1,
            selectedtable   : 0,
            selectedbg      : 0
          }
          let playerTableSetting = await playerSettingModel.find({ playerId: data.playerId });
          if (playerTableSetting.length > 0) {
            responseData.sound          = playerTableSetting[0].sound;
            responseData.vibration      = playerTableSetting[0].vibration;
            responseData.selectedtable  = playerTableSetting[0].selectedtable;
            responseData.selectedbg     = playerTableSetting[0].selectedbg;
          }
          return responseData;
        } catch (e) {
          //console.log("Error in getPlayerSetting", e);
        }
      },

}
