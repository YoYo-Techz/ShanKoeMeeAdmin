var Sys = require('../../Boot/Sys');
var bcrypt = require('bcryptjs');

module.exports = {

    gameSettings: async function(req,res){
        try {

        	let gameSettings = await Sys.App.Services.gameSettingsServices.getSettingsData();

            var data = {
                    App : Sys.Config.App.details,
                    error: req.flash("error"),
                    success: req.flash("success"),
                    gameSettings : gameSettings,
                    gameSettingsActive : 'active',
                    getSetting : 'active',
                };
                return res.render('settings/game-settings',data);
        } catch (e) {
            //console.log("Error",e);
        }
    },

    gameSettingsPointsTwentyOne: async function(req,res){
      try {

        let gameSettings = await Sys.App.Services.gameSettingsServices.getSettingsData();

          var data = {
                  App : Sys.Config.App.details,
                  error: req.flash("error"),
                  success: req.flash("success"),
                  gameSettings : gameSettings,
                  gameSettingsActive : 'active',
                  getSettingPoint : 'active',
              };
              return res.render('settings/game-settings-points-twentyone',data);
      } catch (e) {
          //console.log("Error",e);
      }
  },

  gameSettingsPointsTwentyFour: async function(req,res){
    try {

      let gameSettings = await Sys.App.Services.gameSettingsServices.getSettingsData();

        var data = {
                App : Sys.Config.App.details,
                error: req.flash("error"),
                success: req.flash("success"),
                gameSettings : gameSettings,
                gameSettingsActive : 'active',
                getSettingPoint24 : 'active',
            };
            return res.render('settings/game-settings-points-twentyfour',data);
    } catch (e) {
        //console.log("Error",e);
    }
},

    addGameSettings: async function (req, res){
      try{
        await Sys.App.Services.gameSettingsServices.insertSettingsData({
          minPoints: req.body.minPoints,
          maxPoints: req.body.maxPoints,
          poolMinEntryFee: req.body.poolMinEntryFee,
          poolMaxEntryFee: req.body.poolMaxEntryFee,
          dealMinEntryFee: req.body.dealMinEntryFee,
          dealMaxEntryFee: req.body.dealMaxEntryFee,
        });
        req.flash('success','Settings create successfully');
        res.redirect('/game-settings');
      }catch(error){
        //console.log(error);
        return new Error('Error',error);
      }
    },

    updateGameSettings: async function (req, res){
      try{
        let gameSettings = await Sys.App.Services.gameSettingsServices.getSettingsData({_id : req.body.id});
        if(gameSettings){
          await Sys.App.Services.gameSettingsServices.updateSettingsData(
            {_id : req.body.id},
            {
              minPoints: req.body.minPoints,
              maxPoints: req.body.maxPoints,
              poolMinEntryFee: req.body.poolMinEntryFee,
              poolMaxEntryFee: req.body.poolMaxEntryFee,
              dealMinEntryFee: req.body.dealMinEntryFee,
              dealMaxEntryFee: req.body.dealMaxEntryFee,
            }
          );
          req.flash('success','Settings updated successfully');
          res.redirect('/game-settings');
        }else{
          req.flash('error','Problem in Updating Settings');
          res.redirect('/game-settings');
        }

      }catch(e){
        //console.log(error);
        return new Error('Error',error);
      }
    },

    addPointsGameSettings: async function (req, res){
      try{
        let settings = await Sys.App.Services.gameSettingsServices.getSettingsData({ points : req.body.points, players : req.body.selectPlayers, gameType: 'points' });
        /*if (settings) {
          req.flash('error','Point Value Already Present');
          return res.redirect('/game-settings');
          // return new Error('Error','Point Value Already Present');
        }*/
        await Sys.App.Services.gameSettingsServices.insertSettingsData({
          points: req.body.points,
          players: 0,
          firstprize:req.body.firstprize,
          secondprize:0,
          thirdprize:0,
          gameType: 'points',
        });
        req.flash('success','Settings create successfully');
        res.redirect('/game-settings');
      }catch(error){
        //console.log(error);
        return new Error('Error',error);
      }
    },

    getPointsGameSettings: async function (req, res){
      try {

          let start = parseInt(req.query.start);
          let length = parseInt(req.query.length);

          let query = { gameType: 'points'};


          let gameC = await Sys.App.Services.gameSettingsServices.getByData(query);
          let gameCount = gameC.length;
          let data = await Sys.App.Services.gameSettingsServices.getSettingsDataTable(query, length, start);
          var obj = {
           'draw': req.query.draw,
           'recordsTotal': gameCount,
           'recordsFiltered': gameCount,
           'data': data
         };
         res.send(obj);
       } catch (e) {
        //console.log("Error",e);
      }
    },

    addPoolGameSettings: async function (req, res){
      try{
        await Sys.App.Services.gameSettingsServices.insertSettingsData({
          score: req.body.selectScore,
          players: req.body.selectPlayers,
          entryFee: req.body.entryFee,
          prize: req.body.prize,
          rack: req.body.rack,
          gameType: 'pool',
        });
        req.flash('success','Settings created successfully');
        res.redirect('/game-settings');
      }catch(error){
        //console.log(error);
        return new Error('Error',error);
      }
    },

    getPoolGameSettings: async function (req, res){
      try {

          let start = parseInt(req.query.start);
          let length = parseInt(req.query.length);

          let query = { gameType: 'pool'};


          let gameC = await Sys.App.Services.gameSettingsServices.getByData(query);
          let gameCount = gameC.length;
          let data = await Sys.App.Services.gameSettingsServices.getSettingsDataTable(query, length, start);
          var obj = {
           'draw': req.query.draw,
           'recordsTotal': gameCount,
           'recordsFiltered': gameCount,
           'data': data
         };
         res.send(obj);
       } catch (e) {
        //console.log("Error",e);
      }
    },

    addDealGameSettings: async function (req, res){
      try{
        await Sys.App.Services.gameSettingsServices.insertSettingsData({
          deals: req.body.selectDeals,
          players: req.body.selectPlayers,
          entryFee: req.body.entryFee,
          rack: req.body.rack,
          prize: req.body.prize,
          gameType: 'deal',
        });
        req.flash('success','Settings created successfully');
        res.redirect('/game-settings');
      }catch(error){
        //console.log(error);
        return new Error('Error',error);
      }
    },

    getDealGameSettings: async function (req, res){
      try {

          let start = parseInt(req.query.start);
          let length = parseInt(req.query.length);

          let query = { gameType: 'deal'};


          let gameC = await Sys.App.Services.gameSettingsServices.getByData(query);
          let gameCount = gameC.length;
          let data = await Sys.App.Services.gameSettingsServices.getSettingsDataTable(query, length, start);
          var obj = {
           'draw': req.query.draw,
           'recordsTotal': gameCount,
           'recordsFiltered': gameCount,
           'data': data
         };
         res.send(obj);
       } catch (e) {
        //console.log("Error",e);
      }
    },

    addPointsTwentyOneGameSettings: async function (req, res){
      try{
        let settings = await Sys.App.Services.gameSettingsServices.getSettingsData({ points : req.body.points, players : req.body.selectPlayers, gameType: 'points_21' });
        if (settings) {
          req.flash('error','Point Value Already Present');
          return res.redirect('/game-settings-points-21');
          // return new Error('Error','Point Value Already Present');
        }
        await Sys.App.Services.gameSettingsServices.insertSettingsData({
          points: req.body.points,
          players: req.body.selectPlayers,
          rack: req.body.rack,
          gameType: 'points_21',
        });
        req.flash('success','Settings create successfully');
        res.redirect('/game-settings-points-21');
      }catch(error){
        //console.log(error);
        return new Error('Error',error);
      }
    },

    addPointsTwentyFourGameSettings: async function (req, res){
      try{
        let settings = await Sys.App.Services.gameSettingsServices.getSettingsData({ points : req.body.points, players : req.body.selectPlayers, gameType: 'points_24' });
        if (settings) {
          req.flash('error','Point Value Already Present');
          return res.redirect('/game-settings-points-24');
          // return new Error('Error','Point Value Already Present');
        }
        await Sys.App.Services.gameSettingsServices.insertSettingsData({
          points: req.body.points,
          players: req.body.selectPlayers,
          rack: req.body.rack,
          gameType: 'points_24',
        });
        req.flash('success','Settings create successfully');
        res.redirect('/game-settings-points-24');
      }catch(error){
        //console.log(error);
        return new Error('Error',error);
      }
    },

    getPointsTwentyOneGameSettings: async function (req, res){
      try {

          let start = parseInt(req.query.start);
          let length = parseInt(req.query.length);

          let query = { gameType: 'points_21'};


          let gameC = await Sys.App.Services.gameSettingsServices.getByData(query);
          let gameCount = gameC.length;
          let data = await Sys.App.Services.gameSettingsServices.getSettingsDataTable(query, length, start);
          var obj = {
           'draw': req.query.draw,
           'recordsTotal': gameCount,
           'recordsFiltered': gameCount,
           'data': data
         };
         res.send(obj);
       } catch (e) {
        //console.log("Error",e);
      }
    },

    getPointsTwentyFourGameSettings: async function (req, res){
      try {

          let start = parseInt(req.query.start);
          let length = parseInt(req.query.length);

          let query = { gameType: 'points_24'};


          let gameC = await Sys.App.Services.gameSettingsServices.getByData(query);
          let gameCount = gameC.length;
          let data = await Sys.App.Services.gameSettingsServices.getSettingsDataTable(query, length, start);
          var obj = {
           'draw': req.query.draw,
           'recordsTotal': gameCount,
           'recordsFiltered': gameCount,
           'data': data
         };
         res.send(obj);
       } catch (e) {
        //console.log("Error",e);
      }
    },

    deleteGameSettings: async function (req, res){
      try {
        let settings = await Sys.App.Services.gameSettingsServices.getSettingsData({_id: req.body.id});
        if (settings || settings.length >0) {
          await Sys.App.Services.gameSettingsServices.deleteSetting(req.body.id)
          return res.send("success");
        }else {
          return res.send("error");
        }
      } catch (e) {
        //console.log("Error",e);
      }
    },
    get13CardPointRummy: async function (req, res){
      try {
          let query = { gameType: 'points'};
          let data = await Sys.App.Services.gameSettingsServices.getByData(query);
          let gameCount = data.length;
          var myArray = [];
          data.forEach(function(val) {
            myArray.push({
              '_id':val._id,
              'points':val.points,
              'players':val.players,
              'rack':val.rack,
              'gameType':val.gameType,
              'min_entry':(parseFloat(val.points)*parseFloat(80))
            })
          });
          var obj = {
           'recordsTotal': gameCount,
           'data': myArray
         };
         res.send(obj);
       } catch (e) {
        //console.log("Error",e);
      }
    },
    get13CardPoolRummy: async function (req, res){
      try {
          let query = { gameType: 'pool'};
          let data = await Sys.App.Services.gameSettingsServices.getByData(query);
          let gameCount = data.length;
          var obj = {
           'recordsTotal': gameCount,
           'data': data
         };
         res.send(obj);
       } catch (e) {
        //console.log("Error",e);
      }
    },
    get13CardDealsRummy: async function (req, res){
      try {
          let query = { gameType: 'deal'};
          let data = await Sys.App.Services.gameSettingsServices.getByData(query);
          let gameCount = data.length;
          var obj = {
           'recordsTotal': gameCount,
           'data': data
         };
         res.send(obj);
       } catch (e) {
        //console.log("Error",e);
      }
    },
    get21CardPointRummy: async function (req, res){
      try {
          let query = { gameType: 'points_21'};
          let data = await Sys.App.Services.gameSettingsServices.getByData(query);
          let gameCount = data.length;
          var myArray = [];
          data.forEach(function(val) {
            myArray.push({
              '_id':val._id,
              'points':val.points,
              'players':val.players,
              'rack':val.rack,
              'gameType':val.gameType,
              'min_entry':(parseFloat(val.points)*parseFloat(80))
            })
          });
          var obj = {
           'recordsTotal': gameCount,
           'data': myArray
         };
         res.send(obj);
       } catch (e) {
        //console.log("Error",e);
      }
    },
    get24CardPointRummy: async function (req, res){
      try {
          let query = { gameType: 'points_24'};
          let data = await Sys.App.Services.gameSettingsServices.getByData(query);
          let gameCount = data.length;
          var myArray = [];
          data.forEach(function(val) {
            myArray.push({
              '_id':val._id,
              'points':val.points,
              'players':val.players,
              'rack':val.rack,
              'gameType':val.gameType,
              'min_entry':(parseFloat(val.points)*parseFloat(80))
            })
          });
          var obj = {
           'recordsTotal': gameCount,
           'data': myArray
         };
         res.send(obj);
       } catch (e) {
        //console.log("Error",e);
      }
    },

}
