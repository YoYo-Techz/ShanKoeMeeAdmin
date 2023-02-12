var Sys = require('../../Boot/Sys');
var bcrypt = require('bcryptjs');
const moment = require('moment');
module.exports = {
  /**
  Service Charge Controller

  **/

  tdsCharge: async function(req,res){
      try {
          var data = {
                  App           : Sys.Config.App.details,
                  error         : req.flash("error"),
                  success       : req.flash("success"),
                  tdsCharge : 'active',
              };

              return res.render('tdsCharge/list',data);
      } catch (e) {
          console.log("Error",e);
      }
  },

  getTdsList : async function(req,res){
    try {
      let start = parseInt(req.query.start);
      let length = parseInt(req.query.length);
      let search = req.query.search.value;

      let query = {};
      if (search != '') {
        let capital = search;
            
              query =  { $or:[{username: { $regex: '.*' + search + '.*' }},{gameid:{$regex: '.*' + search + '.*'}}]};
            }
            let gameId;
            let getDocumentC = await Sys.App.Services.TdsChargeService.getDocument(query);
            let getDocumentCount = getDocumentC.length;
            let data = await Sys.App.Services.TdsChargeService.getDocumentDatatable(query, length, start);
           
            let dataArr = [];
            let i;
            for (let index = 0; index < data.length; index++) {
             
              //let dt = new Date(data[index].createdAt);
              let d = new Date(data[index].createdAt);
              let date = ('0' + d.getDate()).slice(-2) + '/' + ('0' + (d.getMonth()+1)).slice(-2)  + '/' + ('0' + d.getFullYear()).slice(-2) +' '+ ('0' + d.getHours()).slice(-2) +':'+ ('0' + d.getMinutes()).slice(-2);
              
              let username =  data[index].username;
              if (data[index].username == undefined) {
                username = '';
              }
              let afterWinAmount =  data[index].afterWinAmount;
              if (data[index].afterWinAmount == undefined) {
                afterWinAmount = '';
              }
              
              // if (data[index] && data[index].gameid) {
              //   dataArr[index].gameid = data[index].gameid;
              // } else {
              //   dataArr[index].gameid = '';
              // }
              
              dataArr.push({
                gameid              : data[index].gameid,
                roomid              : data[index].roomid,
                username            : username,
                gameType            : data[index].gameType,
                prizepool           : data[index].prizepool,
                winnerAmount        : data[index].winnerAmount,
                tds                 : data[index].tds,
                afterWinAmount      : afterWinAmount,
                createdAt           : date} );
                
            }
            
           
            var obj = {
              'draw': req.query.draw,
              'recordsTotal': getDocumentCount,
              'recordsFiltered': getDocumentCount,
               'data': dataArr,
              
            };
            res.send(obj);

    } catch (e) {
      console.log("Error in Getting KYC listing.", e);
    }
  },
  playerTdsCharge : async function(req,res){
    try {
            let gameId;
            let data = await Sys.App.Services.TdsChargeService.getDocument({username:req.params.name});
            let getDocumentCount = data.length;
           
            let dataArr = [];
            let i;
            for (let index = 0; index < data.length; index++) {
             
              //let dt = new Date(data[index].createdAt);
              let d = new Date(data[index].createdAt);
              let date = ('0' + d.getDate()).slice(-2) + '/' + ('0' + (d.getMonth()+1)).slice(-2)  + '/' + ('0' + d.getFullYear()).slice(-2) +' '+ ('0' + d.getHours()).slice(-2) +':'+ ('0' + d.getMinutes()).slice(-2);
              
              let username =  data[index].username;
              if (data[index].username == undefined) {
                username = '';
              }
              let afterWinAmount =  data[index].afterWinAmount;
              if (data[index].afterWinAmount == undefined) {
                afterWinAmount = '';
              }
              
              dataArr.push({
                gameid              : data[index].gameid,
                roomid              : data[index].roomid,
                username            : username,
                gameType            : data[index].gameType,
                prizepool           : data[index].prizepool,
                winnerAmount        : data[index].winnerAmount,
                tds                 : data[index].tds,
                afterWinAmount      : afterWinAmount,
                createdAt           : date} );
                
            }
            
           
            var obj = {
              'recordsTotal': getDocumentCount,
              'data': dataArr,
              
            };
            res.send(obj);

    } catch (e) {
      console.log("Error in Getting KYC listing.", e);
    }
  },
  DeleteTds : async function(req,res){
    try {
      // let start = parseInt(req.query.start);
      // let length = parseInt(req.query.length);
      // let search = req.query.search.value;

      let query = {};
      // if (search != '') {
      //   let capital = search;
      //         query = { gameType: { $regex: '.*' + search + '.*' } };
      //       }
      let aa = [];
            let getDocument = await Sys.App.Services.TdsChargeService.getDocument({ });
            // console.log(getDocument);
            if (getDocument && getDocument != null && getDocument.length > 0) {
              for (var i = 0; i < getDocument.length; i++) {
                let getRoomData = await Sys.App.Services.RoomServices.getSingleRoomData({ _id : getDocument[i].roomid });
                console.log(i);
                // console.log(getRoomData);
                if (getRoomData != null && getRoomData.type == 'Practice') {
                  // console.log('fkf');
                // if (getRoomData && getRoomData != null && getRoomData.length > 0 && getRoomData.type == 'Practice') {
                  aa.push([i]);
                  await Sys.App.Services.TdsChargeService.deleteDocument(getDocument[i]._id);
                }

              }
            }
            res.send(aa);
            // let getDocumentCount = getDocumentC.length;
            // let data = await Sys.App.Services.ServieChargeService.getDocumentDatatable(query, length, start);

            // var obj = {
            //   'draw': req.query.draw,
            //   'recordsTotal': getDocumentCount,
            //   'recordsFiltered': getDocumentCount,
            //   'data': data
            // };
            // res.send(obj);

    } catch (e) {
      console.log("Error in Getting KYC listing.", e);
    }
  },


}
