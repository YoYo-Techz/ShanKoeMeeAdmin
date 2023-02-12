var Sys = require('../../Boot/Sys');
var bcrypt = require('bcryptjs');

module.exports = {

  entryFeesSettings: async function(req,res){
        try {

        	let entryFeesSettings = await Sys.App.Services.EntryFeesSettingsServices.getSettingsData({gameType:'points'});
          let entryFeesPoint21Settings = await Sys.App.Services.EntryFeesSettingsServices.getSettingsData({gameType:'points_21'});
          let entryFeespoint24Settings = await Sys.App.Services.EntryFeesSettingsServices.getSettingsData({gameType:'points_24'});
          var data = {
                    App : Sys.Config.App.details,
                    error: req.flash("error"),
                    success: req.flash("success"),
                    entryFeesSettings : entryFeesSettings,
                    entryFeesPoint21Settings :entryFeesPoint21Settings,
                    entryFeespoint24Settings:entryFeespoint24Settings,
                    chipsSetting : 'active',
                };
                return res.render('entryFees/entryfees-settings',data);
        } catch (e) {
            //console.log("Error",e);
        }
    },


   
  addEntryFeesSettings: async function (req, res){
    try{
      
      await Sys.App.Services.EntryFeesSettingsServices.insertSettingsData({
        gameType: 'points',
        entryFees: req.body.entryFees,
 
      });
      req.flash('success','Entry Fees Point 13 Settings create successfully');
      res.redirect('/entryFees-settings');
    }catch(error){
      //console.log(error);
      return new Error('Error',error);
    }
  },

  updateEntryFeesSettings: async function (req, res){
    try {

      let settings = await Sys.App.Services.EntryFeesSettingsServices.getSettingsData({_id: req.body.id});
      if (settings) {

        await Sys.App.Services.EntryFeesSettingsServices.updateSettingsData(
            {
              _id: req.body.id
            },{
              gameType: 'points',
              entryFees: req.body.entryFees
              
            }
          )
          req.flash('success','Entry Fees Points 13 Settings update successfully');
          res.redirect('/entryFees-settings');

      }else{
         req.flash('error','Entry Fees Points 13 Settings update not successfully');
         res.redirect('/entryFees-settings');
      }

     } catch (e) {
      //console.log("Error",e);
    }
  },

  addEntryFeesPoint21Settings: async function (req, res){
    try{
      
      await Sys.App.Services.EntryFeesSettingsServices.insertSettingsData({
        gameType: 'points_21',
        entryFees: req.body.entryFees
      });
      req.flash('success','Entry Fees Point 21 Settings create successfully');
      res.redirect('/entryFees-settings');
    }catch(error){
      //console.log(error);
      return new Error('Error',error);
    }
  },

  updateEntryFeesPoint21Settings: async function (req, res){
    try {

      let settings = await Sys.App.Services.EntryFeesSettingsServices.getSettingsData({_id: req.body.id});
      if (settings) {

        await Sys.App.Services.EntryFeesSettingsServices.updateSettingsData(
            {
              _id: req.body.id
            },{
              gameType: 'points_21',
              entryFees: req.body.entryFees
            }
          )
          req.flash('success','Entry Fees Points 21 Settings update successfully');
          res.redirect('/entryFees-settings');

      }else{
         req.flash('error','Entry Fees Points 21 Settings update not successfully');
         res.redirect('/entryFees-settings');
      }

     } catch (e) {
      //console.log("Error",e);
    }
  },

  addEntryFeesPoint24Settings: async function (req, res){
    try{
      
      await Sys.App.Services.EntryFeesSettingsServices.insertSettingsData({
        gameType: 'points_24',
        entryFees: req.body.entryFees
        
      });
      req.flash('success','Entry Fees Point 24 Settings create successfully');
      res.redirect('/entryFees-settings');
    }catch(error){
      //console.log(error);
      return new Error('Error',error);
    }
  },

  updateEntryFeesPoint24Settings: async function (req, res){
    try {

      let settings = await Sys.App.Services.EntryFeesSettingsServices.getSettingsData({_id: req.body.id});
      if (settings) {

        await Sys.App.Services.EntryFeesSettingsServices.updateSettingsData(
            {
              _id: req.body.id
            },{
              gameType: 'points_24',
              entryFees: req.body.entryFees
            }
          )
          req.flash('success','Entry Fees Points 24 Settings update successfully');
          res.redirect('/entryFees-settings');

      }else{
         req.flash('error','Entry Fees Points 24 Settings update not successfully');
         res.redirect('/entryFees-settings');
      }

     } catch (e) {
      //console.log("Error",e);
    }
  },
  
    deleteGameSettings: async function (req, res){
      try {
        let settings = await Sys.App.Services.EntryFeesSettingsServices.getSettingsData({_id: req.body.id});
        if (settings || settings.length >0) {
          await Sys.App.Services.EntryFeesSettingsServices.deleteSetting(req.body.id)
          return res.send("success");
        }else {
          return res.send("error");
        }
      } catch (e) {
        //console.log("Error",e);
      }
    }


}
