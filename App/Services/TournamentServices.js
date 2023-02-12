'use strict';

const mongoose = require('mongoose');
var Sys = require('../../Boot/Sys');
const tournamentModel  = mongoose.model('tournaments');


module.exports = {


	getTourData: async function(data){
        try {
          return  await tournamentModel.findOne(data);
        } catch (e) {
          console.log("Error",e);
        }
	 },

  getByData: async function(data){
        try {
          return  await tournamentModel.find(data);
        } catch (e) {
          console.log("Error",e);
        }
  },

  updateTourData: async function(condition, data){
        try {
          await tournamentModel.update(condition, data);
        } catch (e) {
          console.log("Error",e);
        }
  },

  insertTourData: async function(data){
        try {
          await tournamentModel.create(data);
        } catch (e) {
          console.log("Error",e);
        }
  },

  getTouDatatable: async function(query, length, start){
        try {
          return  await tournamentModel.find(query).skip(start).limit(length);
        } catch (e) {
          console.log("Error",e);
        }
  },

  delete: async function(data){
        try {
          await tournamentModel.deleteOne({_id: data});
        } catch (e) {
          console.log("Error",e);
        }
  },


}
