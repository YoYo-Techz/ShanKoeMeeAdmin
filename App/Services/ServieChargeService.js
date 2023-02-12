'use strict';

const mongoose = require('mongoose');
var Sys = require('../../Boot/Sys');
const commissionModel  = mongoose.model('adminCommission');


module.exports = {

  getDocument: async function(data){
        try {
          return  await commissionModel.find(data);
        } catch (e) {
          console.log("Error",e);
        }
  },

  getSingleDocument: async function(data){
    try {
      return  await commissionModel.findOne(data);
    } catch (e) {
      console.log("Error",e);
    }
  },
  
	getDocumentDatatable: async function(query, length, start){
        try {
          if(length==-1)
          {
            return  await commissionModel.find(query).sort({"createdAt":-1});
          }else{
          return  await commissionModel.find(query).skip(start).limit(length).sort({"createdAt":-1});
          }
        } catch (e) {
          console.log("Error",e);
        }
	 },

   deleteDocument: async function(data){
         try {
           return  await commissionModel.deleteOne({_id: data});
         } catch (e) {
           console.log("Error",e);
         }
   },


}
