'use strict';

const mongoose = require('mongoose');
var Sys = require('../../Boot/Sys');
const playerModel  = mongoose.model('player');
const pdfEntrymodel = mongoose.model('pdfEntry');
const loginHistory =mongoose.model('loginHistory');


module.exports = {

	getByData: async function(data){
        //console.log('Find By Data:',data)
        try {
          return  await playerModel.find(data);
        } catch (e) {
          //console.log("Error",e);
        }
  },

	getByID: async function(data){
    //console.log('Find By Data:',data)
    try {
      return  await playerModel.findOne({_id: data});
    } catch (e) {
      //console.log("Error",e);
    }
},

  getPlayerData: async function(data){
        try {
          var value=  await playerModel.find(data);
         // //console.log(value);
            return value;

        } catch (e) {
          //console.log("Error",e);
        }
  },


	getSinglePlayerData: async function(data){
        try {
          return  await playerModel.findOne(data);
        } catch (e) {
          //console.log("Error",e);
        }
	},

  getPlayerDatatable: async function(query, length, start){
        try {

          if(length==-1)
          {
            return  await playerModel.find(query).sort({createdAt: -1});
          }else{
           return await playerModel.find(query).skip(start).limit(length).sort({createdAt: -1});
          }
        } catch (e) {
          //console.log("Error",e);
        }
  },


  insertPlayerData: async function(data){
        try {
         let value= await playerModel.create(data);
         ////console.log('value----',value);
         return value;

        } catch (e) {
          //console.log("Error",e);
        }
	},

  deletePlayer: async function(data){
        try {
          await playerModel.deleteOne({_id: data});
        } catch (e) {
          //console.log("Error",e);
        }
  },

	updatePlayerData: async function(condition, data){
        try {
         return await playerModel.update(condition, data);
        } catch (e) {
          //console.log("Error",e);
        }
	},

  getLimitPlayer: async function(data){
        try {
          return  await playerModel.find(data).sort({"createdAt":-1}).limit(10);
        } catch (e) {
          //console.log("Error",e);
        }
  },

  getLimitedPlayerWithSort: async function(data,limit){
        try {
          return  await playerModel.find(data).limit(limit).sort({"cash":-1});
        } catch (e) {
          //console.log("Error",e);
        }
  },
   aggregateQuery : async function(data){
    try {
      return  await playerModel.aggregate(data);
    } catch (e) {
      //console.log("Error",e);
    }
  },

  updateSingleRecord: async function(condition, data){
        try {
         return  await playerModel.updateOne(condition, data);
        } catch (e) {
          //console.log("Error",e);
        }
  },
  update: async function(data){
    try {
     let value= await playerModel.update(data);
    // //console.log('value----',value);
     return value;

    } catch (e) {
      //console.log("Error",e);
    }
},

  insertPdfEntryData: async function(data){
    try {
     let value= await pdfEntrymodel.create(data);
    // //console.log('value----',value);
     return value;

    } catch (e) {
      //console.log("Error",e);
    }
},
getPdfEntryData: async function(data){
  try {
    return  await pdfEntrymodel.find(data);
  } catch (e) {
    //console.log("Error",e);
  }
},
removePdfEntryData: async function(data){
  try {
    return  await pdfEntrymodel.findByIdAndRemove({_id: data});

  } catch (e) {
    //console.log("Error",e);
  }
},


  loginHistory :async function(data){
    try {
      return  await loginHistory.aggregate(data);
    } catch (e) {
      //console.log("Error",e);
    }
  }

}
