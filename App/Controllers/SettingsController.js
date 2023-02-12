var Sys = require('../../Boot/Sys');
var bcrypt = require('bcryptjs');

module.exports = {
    settings: async function(req,res){
        try {

        	let settings = await Sys.App.Services.SettingsServices.getSettingsData();
            var data = {
                    App : Sys.Config.App.details,
                    error: req.flash("error"),
                    success: req.flash("success"),
                    setting : settings,
                    settingActive : 'active'
                };
                return res.render('settings/settings',data);
        } catch (e) {
            console.log("Error",e);
        }
    },


    settingsUpdate: async function(req , res){
    	try{
    	let settings = await Sys.App.Services.SettingsServices.getSettingsData({_id: req.body.id});
          if (settings) {

          	await Sys.App.Services.SettingsServices.updateSettingsData(
                {
                  _id: req.body.id
                },{
                  // rakePercenage: req.body.rakePercenage,
                  // defaultChips: req.body.chips,
                  // rackAmount: req.body.rackAmount,
                  // expireTime: req.body.expireTime,
                  // defaultDiamonds: req.body.defaultDiamonds,
                  currentVersion: req.body.currentVersion,
                }
              )
              req.flash('success','Settings update successfully');
              res.redirect('/settings');

          }else{
          	 req.flash('error','Settings update not successfully');
          	 res.redirect('/settings');
          }

    	}catch (e){
    		console.log("Error",e);

    	}
    },

    settingsAdd : async function (req , res){
    	try{
    	await Sys.App.Services.SettingsServices.insertSettingsData({

		  // rakePercenage: req.body.rakePercenage,
      //     defaultChips: req.body.chips,
      //     rackAmount: req.body.rackAmount,
      //     expireTime: req.body.expireTime,
      //     defaultDiamonds: req.body.defaultDiamonds,
      currentVersion: req.body.currentVersion

    	});
    	req.flash('success','Settings create successfully');
        res.redirect('/settings');

    	}catch (e){
        req.flash('error','Settings update not successfully');
        res.redirect('/settings');
    		console.log("Error",e);

    	}
    }


}
