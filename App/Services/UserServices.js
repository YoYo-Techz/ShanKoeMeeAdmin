'use strict';

const mongoose = require('mongoose');
var Sys = require('../../Boot/Sys');
const userModel  = mongoose.model('user');


module.exports = {

	getByData: async function(data){
        console.log('Find By Data:',data)
        try {
          return  await userModel.find(data);
        } catch (e) {
          console.log("Error",e);
        }
	},

  getUserData: async function(data){
        try {
          return  await userModel.find(data);
        } catch (e) {
          console.log("Error",e);
        }
	},

	getSingleUserData: async function(data){
        try {
          return  await userModel.findOne(data);
        } catch (e) {
          console.log("Error",e);
        }
	},

  getUserDatatable: async function(query, length, start){
        try {
          return  await userModel.find(query).skip(start).limit(length);
        } catch (e) {
          console.log("Error",e);
        }
	},

  insertUserData: async function(data){
        try {
          await userModel.create(data);
        } catch (e) {
          console.log("Error",e);
        }
	},

  deleteUser: async function(data){
        try {
          await userModel.deleteOne({_id: data});
        } catch (e) {
          console.log("Error",e);
        }
  },

	updateUserData: async function(condition, data){
        try {
          return await userModel.update(condition, data);
        } catch (e) {
          console.log("Error",e);
          throw e;
        }
	}

}
