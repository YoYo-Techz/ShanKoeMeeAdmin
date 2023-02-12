'use strict';

const mongoose = require('mongoose');
var Sys = require('../../Boot/Sys');
const tdsModel  = mongoose.model('tdsChargeSchema');


module.exports = {

  getDocument: async function(data){
        try {
          return  await tdsModel.find(data);
        } catch (e) {
          console.log("Error",e);
        }
  },

	getDocumentDatatable: async function(query, length, start){
        try {
          if(length==-1)
          {
            return  await tdsModel.find(query).sort({"createdAt":-1});
          }else{
          return  await tdsModel.find(query).skip(start).limit(length).sort({"createdAt":-1});
          }
        } catch (e) {
          console.log("Error",e);
        }
	 },

   deleteDocument: async function(data){
         try {
           return  await tdsModel.deleteOne({_id: data});
         } catch (e) {
           console.log("Error",e);
         }
   },


}
