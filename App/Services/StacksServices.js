'use strict';

const mongoose = require('mongoose');
var Sys = require('../../Boot/Sys');
const stacksModel  = mongoose.model('stacks');


module.exports = {

	getByData: async function(data){
        try {
          return  await stacksModel.find(data);
        } catch (e) {
          console.log("Error",e);
        }
	},

	getStacksDatatable: async function(query, length, start){
        try {
          return  await stacksModel.find(query).skip(start).limit(length);
        } catch (e) {
          console.log("Error",e);
        }
	},

	getStacksData: async function(data){
		try {
			return  await stacksModel.findOne(data);
		} catch (e) {
			console.log("Error",e);
		}
	},


	updateStacksData: async function(condition, data){
		try {
			await stacksModel.update(condition, data);
		} catch (e) {
			console.log("Error",e);
		}
	},

	insertStacksData: async function(data){
		try {
			await stacksModel.create(data);
		} catch (e) {
			console.log("Error",e);
		}
	},

	deleteStacks: async function(data){
        try {
          await stacksModel.deleteOne({_id: data});
        } catch (e) {
          console.log("Error",e);
        }
  },
}
