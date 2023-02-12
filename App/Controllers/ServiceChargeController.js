var Sys = require('../../Boot/Sys');
var bcrypt = require('bcryptjs');
const moment = require('moment');
module.exports = {
  /**
  Service Charge Controller

  **/

  serviceCharge: async function(req,res){
      try {
          var data = {
                  App           : Sys.Config.App.details,
                  error         : req.flash("error"),
                  success       : req.flash("success"),
                  serviceCharge : 'active',
              };

              return res.render('serviceCharge/list',data);
      } catch (e) {
          console.log("Error",e);
      }
  },

  getCommissionList : async function(req,res){
    try {
      let start = parseInt(req.query.start);
      let length = parseInt(req.query.length);
      let search = req.query.search.value;

      let query = {};
      if (search != '') {
        let capital = search;
              query = { gameType: { $regex: '.*' + search + '.*' } };
            }
            let gameId;
            let getDocumentC = await Sys.App.Services.ServieChargeService.getDocument(query);
            let getDocumentCount = getDocumentC.length;
            let data = await Sys.App.Services.ServieChargeService.getDocumentDatatable(query, length, start);
           
            let dataArr = [];
            let i;
            for (let index = 0; index < data.length; index++) {
             
              //let dt = new Date(data[index].createdAt);
              let d = new Date(data[index].createdAt);
              let date = ('0' + d.getDate()).slice(-2) + '/' + ('0' + (d.getMonth()+1)).slice(-2)  + '/' + ('0' + d.getFullYear()).slice(-2) +' '+ ('0' + d.getHours()).slice(-2) +':'+ ('0' + d.getMinutes()).slice(-2);
              
              
              // if (data[index] && data[index].gameid) {
              //   dataArr[index].gameid = data[index].gameid;
              // } else {
              //   dataArr[index].gameid = '';
              // }
              
              dataArr.push({
                gameid              : data[index].gameid,
                roomid              : data[index].roomid,
                gameType            : data[index].gameType,
                prizepool           : data[index].prizepool,
                commissionAmount    : data[index].commissionAmount,
                commissionPercentage: data[index].commissionPercentage,
                winnerAmount        : data[index].winnerAmount,
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

  DeletePracticeTax : async function(req,res){
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
            let getDocument = await Sys.App.Services.ServieChargeService.getDocument({ });
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
                  await Sys.App.Services.ServieChargeService.deleteDocument(getDocument[i]._id);
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
