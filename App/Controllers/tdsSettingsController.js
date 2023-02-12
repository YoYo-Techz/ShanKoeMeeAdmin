var Sys = require('../../Boot/Sys');
var bcrypt = require('bcryptjs');

module.exports = {

    tdsSettings: async function(req,res){
        try {

        	let tdsSettings = await Sys.App.Services.TdsSettingsServices.getSettingsData();

            var data = {
                    App : Sys.Config.App.details,
                    error: req.flash("error"),
                    success: req.flash("success"),
                    tdsSettings : tdsSettings,
                    getSetting : 'active',
                };
                return res.render('tds/tds-settings',data);
        } catch (e) {
            console.log("Error",e);
        }
    },

    addTdsSettings: async function (req, res){
      try{
        
        await Sys.App.Services.TdsSettingsServices.insertSettingsData({
          amount: req.body.amount,
          rack: req.body.rack,
          
        });
        req.flash('success','TDS Settings create successfully');
        res.redirect('/tds-settings');
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
