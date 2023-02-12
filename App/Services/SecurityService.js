'use strict';

const mongoose = require('mongoose');
var Sys = require('../../Boot/Sys');
const securityModel  = mongoose.model('security');


module.exports = {

	getByData: async function(data){
        try {
          return  await securityModel.find(data);
        } catch (e) {
          console.log("Error",e);
        }
	},

	getStacksDatatable: async function(query, length, start){
        try {
          return  await securityModel.find(query).skip(start).limit(length);
        } catch (e) {
          console.log("Error",e);
        }
	},

	getStacksData: async function(data){
		try {
			return  await securityModel.findOne(data);
		} catch (e) {
			console.log("Error",e);
		}
	},


	updateStacksData: async function(condition, data){
		try {
			await securityModel.update(condition, data);
		} catch (e) {
			console.log("Error",e);
		}
	},

	insertStacksData: async function(data){
		try {
			await securityModel.create(data);
		} catch (e) {
			console.log("Error",e);
		}
	},

	deleteStacks: async function(data){
        try {
          await securityModel.deleteOne({_id: data});
        } catch (e) {
          console.log("Error",e);
        }
  },
}
