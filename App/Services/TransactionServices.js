'use strict';

const mongoose = require('mongoose');
var Sys = require('../../Boot/Sys');
const transactionModel  = mongoose.model('transaction');
const cashManageModel  = mongoose.model('playerCashManage');
const cashDepositModel  = mongoose.model('playerDepositManage');
const playerChipsCashHistoryModel  = mongoose.model('playerChipsCashHistory');
const instanceBonusDepositModel  = mongoose.model('playerInstanceBonusDepositManage');

module.exports = {
  createTransaction :  async function(data){
    try {
      const transactionSchema = new transactionModel({
        phone       : data.phone,
        amount      : data.amount,
        playerId    : data.playerId,
        firstname   : data.firstname,
        email       : data.email,
        productinfo : data.productinfo,
        status      : data.status,
        type        : data.type,
        orderId     : data.orderId,
        paymentLink : data.paymentLink,
        createdAt   : data.createdAt,
        updatedAt   : data.updatedAt,
        payment_type:data.payment_type,
        CHECKSUMHASH:data.CHECKSUMHASH
      });
      return await transactionSchema.save();
    } catch (error) {
      console.log("Error in User Create",error);
      return new Error("Use Not Created!");
    }
  },
  // createUser :  async function(data){
  //   try {
  //     const userSchema = new userModel({
  //       name : data.name,
  //       email : data.email,
  //       password : data.password,
  //       role : data.role
  //     });
  //     return await userSchema.save();
  //   } catch (error) {
  //     console.log("Error in User Create",error);
  //     return new Error("Use Not Created!");
  //   }
  // },
	getByData: async function(data){
        console.log('Find By Data:',data)
        try {
          return  await transactionModel.find(data);
        } catch (e) {
          console.log("Error",e);
        }
	},

  getTransactionDatatable: async function(query, length, start){
        try {
          if(length==-1)
          {
            return  await transactionModel.find(query).sort({'createdAt':-1});
          }else{
          return  await transactionModel.find(query).skip(start).limit(length).sort({'createdAt':-1});
          }
        } catch (e) {
          console.log("Error",e);
        }
  },
  //
  // getUserData: async function(data){
  //       try {
  //         return  await userModel.find(data);
  //       } catch (e) {
  //         console.log("Error",e);
  //       }
	// },
  //
	getSingleTransaction: async function(data){
        try {
          return  await transactionModel.findOne(data);
        } catch (e) {
          console.log("Error",e);
        }
	},
  //
  // getUserDatatable: async function(query, length, start){
  //       try {
  //         return  await userModel.find(query).skip(start).limit(length);
  //       } catch (e) {
  //         console.log("Error",e);
  //       }
	// },

  // insertTransactionData: async function(data){
  //       try {
  //         await userModel.create(data);
  //       } catch (e) {
  //         console.log("Error",e);
  //       }
	// },
  //
  // deleteUser: async function(data){
  //       try {
  //         await userModel.deleteOne({_id: data});
  //       } catch (e) {
  //         console.log("Error",e);
  //       }
  // },

	updateTransaction: async function(condition, data){
        try {
          console.log("Transection Services :",condition,data)
         return  await transactionModel.updateOne(condition, data);
        } catch (e) {
          console.log("Error",e);
        }
	},

  createCashDepositManage: async function(data){
        try {
          return await cashDepositModel.create(data);
        } catch (e) {
          console.log("Error",e);
        }
  },

  getDepositCount: async function(data){
        try {
          return await cashDepositModel.countDocuments(data);
        } catch (e) {
          console.log("Error",e);
        }
  },

  updateManageDeposit: async function(condition, data){
        try {
         return  await cashDepositModel.updateOne(condition, data);
        } catch (e) {
          console.log("Error",e);
        }
	},

  getSingleDeposit: async function(data){
        try {
         return  await cashDepositModel.findOne(data);
        } catch (e) {
          console.log("Error",e);
        }
	},
  createCashManage: async function(data){
        try {
          return await cashManageModel.create(data);
        } catch (e) {
          console.log("Error",e);
        }
  },
  cerateChipsCashHistory: async function(query){
      try {
          console.log("query :",query);
          const playerChipsCashHistorySchema = new playerChipsCashHistoryModel(query);
          return await playerChipsCashHistorySchema.save();
      } catch (error) {
          Sys.Log.info('Error in cerateChipsCashHistory : ' + error);
          return new Error(error);
      }
  },
  getPlayerCashData: async function(data){
        try {
         return  await cashManageModel.findOne(data);
        } catch (e) {
          console.log("Error",e);
        }
	},

  updateCashManager: async function(condition, data){
        try {
         return  await cashManageModel.updateOne(condition, data);
        } catch (e) {
          console.log("Error",e);
        }
	},
  createInstanceBonusDepositManage: async function(data){
        try {
          return await instanceBonusDepositModel.create(data);
        } catch (e) {
          console.log("Error",e);
        }
  },
  getInstanceBonusDepositCount: async function(data){
        try {
          return await instanceBonusDepositModel.countDocuments(data);
        } catch (e) {
          console.log("Error",e);
        }
  },
  updateInstanceBonusManageDeposit: async function(condition, data){
        try {
         return  await instanceBonusDepositModel.updateOne(condition, data);
        } catch (e) {
          console.log("Error",e);
        }
  },
  getSingleInstanceBonusDeposit: async function(data){
        try {
         return  await instanceBonusDepositModel.findOne(data);
        } catch (e) {
          console.log("Error",e);
        }
  },
}
