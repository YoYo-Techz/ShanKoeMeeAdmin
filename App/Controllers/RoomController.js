var Sys = require('../../Boot/Sys');
var bcrypt = require('bcryptjs');

module.exports = {
  /**
  Sit && Go Tournament 

  **/
    settings: async function(req,res){
        try {
        	let settings = await Sys.App.Services.SettingsServices.getSettingsData({});
          let stacks = await Sys.App.Services.StacksServices.getByData({});
          let minutes = [];
          for(let i=1; i<=60;i++){
              minutes.push(i);
          }
            var data = {
                    App : Sys.Config.App.details,
                    error: req.flash("error"),
                    success: req.flash("success"),
                    sitGoActive : 'active',
                    settings : settings,
                    minutes : minutes,
                    stacks : stacks
                };

                return res.render('sitGoTournament/setting',data);
        } catch (e) {
            console.log("Error",e);
        }
    },

    sitNGosettingPostDataAdd: async function(req,res){
      try{
         let settings = await Sys.App.Services.SettingsServices.insertSettingsData({
        sit_n_go_tur_blind_levels    : parseInt(req.body.sit_n_go_tur_blind_levels),
        sit_n_go_tur_1st_payout     : parseInt(req.body.sit_n_go_tur_1st_payout),
        sit_n_go_tur_2st_payout     : parseInt(req.body.sit_n_go_tur_2st_payout),
        sit_n_go_tur_3st_payout     : parseInt(req.body.sit_n_go_tur_3st_payout),
        sit_n_go_tur_breaks_start_time     : parseInt(req.body.sit_n_go_tur_breaks_start_time),
        sit_n_go_tur_breaks     : parseInt(req.body.sit_n_go_tur_breaks),
        sit_n_go_tur_tex_stacks     : req.body.sit_n_go_tur_tex_stacks,
        sit_n_go_tur_tex_buy_in     : parseInt(req.body.sit_n_go_tur_tex_buy_in),
        sit_n_go_tur_tex_entry_fee     : parseInt(req.body.sit_n_go_tur_tex_entry_fee),
        sit_n_go_tur_omh_stacks     : req.body.sit_n_go_tur_omh_stacks,
        sit_n_go_tur_omh_buy_in     : parseInt(req.body.sit_n_go_tur_omh_buy_in),
        sit_n_go_tur_omh_entry_fee     : parseInt(req.body.sit_n_go_tur_omh_entry_fee),
        sit_n_go_tur_default_game_play_chips     : parseInt(req.body.sit_n_go_tur_default_game_play_chips)
      });
         req.flash('success','Sit & Go Tournament create successfully');
        res.redirect('/sit-go-tournament/sitGTouSetting');
      }catch (e){
        console.log("Error",e);
      }
    },

    sitNGosettingPostDataUpdate: async function (req,res){
        try{
        let newSettings = await Sys.App.Services.SettingsServices.updateSettingsData({_id: req.params.id},{
        sit_n_go_tur_blind_levels    : parseInt(req.body.sit_n_go_tur_blind_levels),
        sit_n_go_tur_1st_payout     : parseInt(req.body.sit_n_go_tur_1st_payout),
        sit_n_go_tur_2st_payout     : parseInt(req.body.sit_n_go_tur_2st_payout),
        sit_n_go_tur_3st_payout     : parseInt(req.body.sit_n_go_tur_3st_payout),
        sit_n_go_tur_breaks_start_time     : parseInt(req.body.sit_n_go_tur_breaks_start_time),
        sit_n_go_tur_breaks     : parseInt(req.body.sit_n_go_tur_breaks),
        sit_n_go_tur_tex_stacks     : req.body.sit_n_go_tur_tex_stacks,
        sit_n_go_tur_tex_buy_in     : parseInt(req.body.sit_n_go_tur_tex_buy_in),
        sit_n_go_tur_tex_entry_fee     : parseInt(req.body.sit_n_go_tur_tex_entry_fee),
        sit_n_go_tur_omh_stacks     : req.body.sit_n_go_tur_omh_stacks,
        sit_n_go_tur_omh_buy_in     : parseInt(req.body.sit_n_go_tur_omh_buy_in),
        sit_n_go_tur_omh_entry_fee     : parseInt(req.body.sit_n_go_tur_omh_entry_fee),
        sit_n_go_tur_default_game_play_chips     : parseInt(req.body.sit_n_go_tur_default_game_play_chips)

      });
        req.flash('success','Sit & Go Tournament update successfully');
        res.redirect('/sit-go-tournament/sitGTouSetting');
        }catch (e){
          console.log("Error",e);
        }
    },


    tournament: async function(req,res){
        try{
          var data = {
          App : Sys.Config.App.details,
          error: req.flash("error"),
          success: req.flash("success"),
          tournamentActive : 'active',
        };
        return res.render('regularTournament/tournament',data);
        }catch (e){
          console.log(e);
        }
    },

    addTournament: async function(req,res){
        try{
          let stacks = await Sys.App.Services.StacksServices.getByData({});
          let minutes = [];
          for(let i=1; i<=60;i++){
              minutes.push(i);
          }

          var data = {
          App : Sys.Config.App.details,
          error: req.flash("error"),
          success: req.flash("success"),
          tournamentActive : 'active',
          minutes : minutes,
          stacks : stacks
        };
        return res.render('regularTournament/addTournament',data);
        }catch (e){
          console.log(e);
        }
    },

   saveRegularTexasTournament: async function(req,res){
      try{
        let tournament_date_time = req.body.tournament_date+'T'+req.body.tournament_time+':00.564Z';
        await Sys.App.Services.TournamentServices.insertTourData({
          name                 : req.body.name,
          min_players          : req.body.min_players,
          max_players          : req.body.max_players,
          register_from        : req.body.register_from,
          tournament_date_time : tournament_date_time,
          description          : req.body.description,
          blind_level          : req.body.sit_n_go_tur_blind_levels,
          breaks_start_in      : req.body.sit_n_go_tur_breaks_start_time,
          breaks_time          : req.body.sit_n_go_tur_breaks,
          stacks               : req.body.stacks,
          buy_in               : req.body.sit_n_go_tur_tex_buy_in,
          entry_fee            : req.body.sit_n_go_tur_tex_entry_fee,
          status : 'Active'
        });

        req.flash('success','Tournaments Created Successfully.');
        res.redirect('/regular-tournament/tournament');

          }catch (e){
            console.log('Error',e);
          }
    },
    editTournament: async function(req,res){
      try{
      let tournament = await Sys.App.Services.TournamentServices.getTourData({_id : req.params.id});
      let stacks = await Sys.App.Services.StacksServices.getByData({});
          let minutes = [];
          for(let i=1; i<=60;i++){
              minutes.push(i);
          }

          var date2 = new Date(tournament.tournament_date_time), // 10:09 to
              date1 = new Date() // 10:20 is 11 mins
               

              //Get 1 day in milliseconds
              var one_day = 1000*60*60*24;

              // Convert both dates to milliseconds
              var date1_ms = date1.getTime();
              var date2_ms = date2.getTime();

              // Calculate the difference in milliseconds
              var difference_ms = date2_ms - date1_ms;
              //take out milliseconds
              difference_ms = difference_ms/1000;
              var seconds = Math.floor(difference_ms % 60);
              difference_ms = difference_ms/60; 
              var minutess = Math.floor(difference_ms % 60);
              difference_ms = difference_ms/60; 
              var hours = Math.floor(difference_ms % 24);  
              var days = Math.floor(difference_ms/24);
              date = hours+":"+minutess;

          var data = {
          App : Sys.Config.App.details,
          error: req.flash("error"),
          success: req.flash("success"),
          tournamentActive : 'active',
          player : tournament,
          minutes : minutes,
          stacks : stacks,
          date : date
        };
        return res.render('regularTournament/addTournament',data);
      }catch (e){
        console.log("Error",e);
      }
    },

    getRegularTournament: async function(req,res){
      try{

          let start = parseInt(req.query.start);
          let length = parseInt(req.query.length);
          let search = req.query.search.value;

          let query = {};
          if (search != '') {
            let capital = search;
            query = { email: { $regex: '.*' + search + '.*' } };
          } else {
            query = { };
          }
          let tournamentC = await Sys.App.Services.TournamentServices.getByData(query);
          let tournament = tournamentC.length;
          let data = await Sys.App.Services.TournamentServices.getTouDatatable(query, length, start);
          var obj = {
            'draw': req.query.draw,
            'recordsTotal': tournament,
            'recordsFiltered': tournament,
            'data': data
          };
                res.send(obj);
      }catch (e){
        console.log("Error",e);
      }
    },


    delete: async function(req,res){
      try {
          let stacks = await Sys.App.Services.TournamentServices.getTourData({_id: req.body.id});
          if (stacks || stacks.length >0) {
            await Sys.App.Services.TournamentServices.delete(req.body.id)
            return res.send("success");
          }else {
            return res.send("error");
          }
        } catch (e) {
            console.log("Error",e);
        }
    },


    editRegularTournament: async function(req,res){
      try{
        let tournament = await Sys.App.Services.TournamentServices.getTourData({_id : req.params.id});
        if(tournament){
        let tournament_date_time = req.body.tournament_date+'T'+req.body.tournament_time+':00.564Z';
        await Sys.App.Services.TournamentServices.updateTourData(
                {
                  _id: req.params.id
                },{
                    name                 : req.body.name,
                    min_players          : req.body.min_players,
                    max_players          : req.body.max_players,
                    register_from        : req.body.register_from,
                    description          : req.body.description,
                    blind_level          : req.body.sit_n_go_tur_blind_levels,
                    breaks_start_in      : req.body.sit_n_go_tur_breaks_start_time,
                    breaks_time          : req.body.sit_n_go_tur_breaks,
                    stacks               : req.body.stacks,
                    buy_in               : req.body.sit_n_go_tur_tex_buy_in,
                    entry_fee            : req.body.sit_n_go_tur_tex_entry_fee,
                    status : 'Active'
                }
              );

              req.flash('success','Tournaments update successfully');
              res.redirect('/regular-tournament/tournament');
        }else{
              req.flash('error','Tournaments is not update successfully');
              res.redirect('/regular-tournament/tournament');     
        }
      }catch (e){
        console.log("Error",e);
      }
    }


}