var Sys = require('../../Boot/Sys');
var bcrypt = require('bcryptjs');

module.exports = {

    disconnectionSettings: async function(req,res){
        try {

        	//let disconnectionSettings = await Sys.App.Services.TdsSettingsServices.getSettingsData();

            var data = {
                    App : Sys.Config.App.details,
                    error: req.flash("error"),
                    success: req.flash("success"),
                    //disconnectionSettings : disconnectionSettings,
                    getDisconnectionSetting : 'active',
                };
                return res.render('disconnection/disconnection-settings',data);
        } catch (e) {
            console.log("Error",e);
        }
    },

    addPointsRummyDisconnectionSettings: async function (req, res){
      try{
        var point_rummy = {};
        var pool_rummy = {};
        var deal_rummy = {};

        if (req.body.point_rummy_disconnection_settings == "Drop me on 3 missed moves") {
         point_rummy.Drop_me_on_3_missed_moves = true;
         point_rummy.Auto_Play_till_the_game_ends = false;
        }
        if (req.body.point_rummy_disconnection_settings == "Auto Play till the game ends") {
         point_rummy.Drop_me_on_3_missed_moves = false;
         point_rummy.Auto_Play_till_the_game_ends = true;
        }
        if (req.body.pool_rummy_disconnection_settings == "Drop me on 3 missed moves") {
         pool_rummy.Drop_me_on_3_missed_moves = true;
         pool_rummy.Auto_Play_till_the_game_ends = false;
        }
        if (req.body.pool_rummy_disconnection_settings == "Auto Play till the game ends") {
         pool_rummy.Drop_me_on_3_missed_moves = false;
         pool_rummy.Auto_Play_till_the_game_ends = true;
        }
        if (req.body.deal_rummy_disconnection_settings == "Drop me on 3 missed moves") {
         deal_rummy.Drop_me_on_3_missed_moves = true;
         deal_rummy.Auto_Play_till_the_game_ends = false;
        }
        if (req.body.deal_rummy_disconnection_settings == "Auto Play till the game ends") {
         deal_rummy.Drop_me_on_3_missed_moves = false;
         deal_rummy.Auto_Play_till_the_game_ends = true;
        }
        console.log(point_rummy);
        console.log(pool_rummy);
        console.log(deal_rummy);
        await Sys.App.Services.DisconnectionSettingsServices.insertDisconnectionSettingsData({
          point_rummy: point_rummy,
          pool_rummy: pool_rummy,
          deal_rummy:deal_rummy
        });
         req.flash('success','Points Rummy Disconnection Settings create successfully');
         res.redirect('/disconnection-settings');
      }catch(error){
        console.log(error);
        return new Error('Error',error);
      }
    },

    updateTdsSettings: async function (req, res){
      try {

        let settings = await Sys.App.Services.TdsSettingsServices.getSettingsData({_id: req.body.id});
        if (settings) {

          await Sys.App.Services.TdsSettingsServices.updateSettingsData(
              {
                _id: req.body.id
              },{
                amount: req.body.amount,
                rack: req.body.rack 
              }
            )
            req.flash('success','TDS Settings update successfully');
            res.redirect('/tds-settings');

        }else{
           req.flash('error','TDS Settings update not successfully');
           res.redirect('/tds-settings');
        }

       } catch (e) {
        console.log("Error",e);
      }
    },

 

}
