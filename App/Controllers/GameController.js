var Sys = require('../../Boot/Sys');
var bcrypt = require('bcryptjs');
const moment = require('moment');

module.exports = {

    game: async function(req,res){
      try{
        var data = {
          App : Sys.Config.App.details,
          error: req.flash("error"),
          success: req.flash("success"),
          cashGameHistoryActive : 'active',
          type: 'cash',
          tableType : 'texas'
        };
        return res.render('cashGame/poker-texas/gameHistory',data);
      }catch (e){
        //console.log("Error",e);
      }
    },


    gameHistory: async function(req,res){
      try {
       let start = parseInt(req.query.start);
       let length = parseInt(req.query.length);
       let search = req.query.search.value;
       let val = 'PCG';
       let query = {};
       if (search != '') {
         let capital = search;
         query = { gameNumber: { $regex: '.*' + val + '.*' } , gameNumber: { $regex: '.*' + search + '.*' }};
       } else {
         query = { gameNumber: { $regex: '.*' + val + '.*' }};
       }

       let gameC = await Sys.App.Services.GameService.getByData(query);
       let gameCount = gameC.length;
       let data = await Sys.App.Services.GameService.getGameDatatable(query, length, start);
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


  tableHistory: async function(req,res){
   try{
          // let game = await load('App/Models/Game').findOne({id : req.params.id});
          let game = await Sys.App.Services.GameService.getSingleGameData({ _id : req.params.id});
          let allPlayer = game.players;
          let gameHistory = game.players;
          let history = game.history;
          let winner = game.winners;
          let count = 0;

          for (var j = 0; j < allPlayer.length; j++) {
            allPlayer[j].count = count = count + 1;
            for (var k = 0; k < allPlayer[j].cards.length; k++) {

              allPlayer[j].cards[k] = '<img src="/card/' +allPlayer[j].cards[k] +'.png" width="70px">';

            }
          }

          for (var w = 0; w < winner.length; w++) {
            winner[w].count = count = count + 1;
            for (var wk = 0; wk < winner[w].hand.length; wk++) {
              winner[w].hand[wk] = '<img src="/card/' +winner[w].hand[wk] +'.png" width="70px">';
            }
          }

          for (var h = 0; h < history; h++) {
            history[h].history = history[h].history;
          }

          for (var d = 0; d < game.deck.length; d++) {
            game.deck[d] = '<img src="/card/' +game.deck[d] +'.png" width="70px">&nbsp;&nbsp;';
          }

          return res.render('cashGame/poker-texas/tableHistory',{players : allPlayer ,
            gameHistory:gameHistory ,
            winners : winner ,
            games : game ,
            historys : history});
        }catch (e){
          //console.log("Error",e)
        }
      },

      gameOmaha: async function(req,res){
        try{
          var data = {
            App : Sys.Config.App.details,
            error: req.flash("error"),
            success: req.flash("success"),
            cashOmActive : 'active',
            type: 'cash',
            tableType : 'omaha'
          };
          return res.render('cashGame/poker-omaha/gameHistory',data);
        }catch (e){
          //console.log("Error",e);
        }
      },


      getGameHistory: async function(req,res){
        try {
         let start = parseInt(req.query.start);
         let length = parseInt(req.query.length);
         let search = req.query.search.value;
         let val = 'POG';
         let query = {};
         if (search != '') {
           let capital = search;
           query = { gameNumber: { $regex: '.*' + val + '.*' } , gameNumber: { $regex: '.*' + search + '.*' }};
         } else {
           query = { gameNumber: { $regex: '.*' + val + '.*' }};
         }

         let gameC = await Sys.App.Services.GameService.getByData(query);
         let gameCount = gameC.length;
         let data = await Sys.App.Services.GameService.getGameDatatable(query, length, start);

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

   getTableHistoryOmaha: async function(req,res){

    try{
          // let game = await load('App/Models/Game').findOne({id : req.params.id});
          let game = await Sys.App.Services.GameService.getSingleGameData({ _id : req.params.id});
          let allPlayer = game.players;
          let gameHistory = game.players;
          let history = game.history;
          let winner = game.winners;
          let count = 0;

          for (var j = 0; j < allPlayer.length; j++) {
            allPlayer[j].count = count = count + 1;
            for (var k = 0; k < allPlayer[j].cards.length; k++) {

              allPlayer[j].cards[k] = '<img src="/card/' +allPlayer[j].cards[k] +'.png" width="70px">';

            }
          }

          for (var w = 0; w < winner.length; w++) {
            winner[w].count = count = count + 1;
            for (var wk = 0; wk < winner[w].hand.length; wk++) {
              winner[w].hand[wk] = '<img src="/card/' +winner[w].hand[wk] +'.png" width="70px">';
            }
          }

          for (var h = 0; h < history; h++) {
            history[h].history = history[h].history;
          }

          for (var d = 0; d < game.deck.length; d++) {
            game.deck[d] = '<img src="/card/' +game.deck[d] +'.png" width="70px">&nbsp;&nbsp;';
          }

          return res.render('cashGame/poker-omaha/tableHistory',{players : allPlayer ,
            gameHistory:gameHistory ,
            winners : winner ,
            games : game ,
            historys : history});
        }catch (e){
          //console.log("Error",e)
        }

      },



   /****

          Sit & Go Tournament
          ***/

          texasGameHistorySitGo: async function(req,res){
            try{
              var data = {
                App : Sys.Config.App.details,
                error: req.flash("error"),
                success: req.flash("success"),
                sitTexActive : 'active',
                type: 'sitgo',
                tableType : 'texas'
              };
              return res.render('sitGoTournament/poker-texas/gameHistory',data);
            }catch (e){
              //console.log("Error",e);
            }
          },


          gameHistorySitGo: async function(req,res){
            try {
             let start = parseInt(req.query.start);
             let length = parseInt(req.query.length);
             let search = req.query.search.value;
             let val = 'PCG';
             let query = {};
             if (search != '') {
               let capital = search;
               query = { gameNumber: { $regex: '.*' + val + '.*' } , gameNumber: { $regex: '.*' + search + '.*' }};
             } else {
               query = { gameNumber: { $regex: '.*' + val + '.*' }};
             }

             let gameC = await Sys.App.Services.GameService.getByData(query);
             let gameCount = gameC.length;
             let data = await Sys.App.Services.GameService.getGameDatatable(query, length, start);
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


       tableHistorySitGo: async function(req,res){
         try{
          // let game = await load('App/Models/Game').findOne({id : req.params.id});
          let game = await Sys.App.Services.GameService.getSingleGameData({ _id : req.params.id});
          let allPlayer = game.players;
          let gameHistory = game.players;
          let history = game.history;
          let winner = game.winners;
          let count = 0;

          for (var j = 0; j < allPlayer.length; j++) {
            allPlayer[j].count = count = count + 1;
            for (var k = 0; k < allPlayer[j].cards.length; k++) {

              allPlayer[j].cards[k] = '<img src="/card/' +allPlayer[j].cards[k] +'.png" width="70px">';

            }
          }

          for (var w = 0; w < winner.length; w++) {
            winner[w].count = count = count + 1;
            for (var wk = 0; wk < winner[w].hand.length; wk++) {
              winner[w].hand[wk] = '<img src="/card/' +winner[w].hand[wk] +'.png" width="70px">';
            }
          }

          for (var h = 0; h < history; h++) {
            history[h].history = history[h].history;
          }

          for (var d = 0; d < game.deck.length; d++) {
            game.deck[d] = '<img src="/card/' +game.deck[d] +'.png" width="70px">&nbsp;&nbsp;';
          }

          return res.render('cashGame/poker-texas/tableHistory',{players : allPlayer ,
            gameHistory:gameHistory ,
            winners : winner ,
            games : game ,
            historys : history});
        }catch (e){
          //console.log("Error",e)
        }
      },



      gameHistoryOmahaSitGo: async function(req,res){
        try{
          var data = {
            App : Sys.Config.App.details,
            error: req.flash("error"),
            success: req.flash("success"),
            gameHistoryActive : 'active',
            type: 'cash',
            tableType : 'omaha'
          };
          return res.render('cashGame/poker-omaha/gameHistory',data);
        }catch (e){
          //console.log("Error",e);
        }
      },


      getGameHistorySitGo: async function(req,res){
        try {
         let start = parseInt(req.query.start);
         let length = parseInt(req.query.length);
         let search = req.query.search.value;
         let val = 'POG';
         let query = {};
         if (search != '') {
           let capital = search;
           query = { gameNumber: { $regex: '.*' + val + '.*' } , gameNumber: { $regex: '.*' + search + '.*' }};
         } else {
           query = { gameNumber: { $regex: '.*' + val + '.*' }};
         }

         let gameC = await Sys.App.Services.GameService.getByData(query);
         let gameCount = gameC.length;
         let data = await Sys.App.Services.GameService.getGameDatatable(query, length, start);

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

   getTableHistoryOmahaSitGo: async function(req,res){

    try{
          // let game = await load('App/Models/Game').findOne({id : req.params.id});
          let game = await Sys.App.Services.GameService.getSingleGameData({ _id : req.params.id});
          let allPlayer = game.players;
          let gameHistory = game.players;
          let history = game.history;
          let winner = game.winners;
          let count = 0;

          for (var j = 0; j < allPlayer.length; j++) {
            allPlayer[j].count = count = count + 1;
            for (var k = 0; k < allPlayer[j].cards.length; k++) {

              allPlayer[j].cards[k] = '<img src="/card/' +allPlayer[j].cards[k] +'.png" width="70px">';

            }
          }

          for (var w = 0; w < winner.length; w++) {
            winner[w].count = count = count + 1;
            for (var wk = 0; wk < winner[w].hand.length; wk++) {
              winner[w].hand[wk] = '<img src="/card/' +winner[w].hand[wk] +'.png" width="70px">';
            }
          }

          for (var h = 0; h < history; h++) {
            history[h].history = history[h].history;
          }

          for (var d = 0; d < game.deck.length; d++) {
            game.deck[d] = '<img src="/card/' +game.deck[d] +'.png" width="70px">&nbsp;&nbsp;';
          }

          return res.render('cashGame/poker-omaha/tableHistory',{players : allPlayer ,
            gameHistory:gameHistory ,
            winners : winner ,
            games : game ,
            historys : history});
        }catch (e){
          //console.log("Error",e)
        }

      },


      /**
          Regular Tournament

      **/

      gameRegularTou: async function(req,res){
      try{
        var data = {
          App : Sys.Config.App.details,
          error: req.flash("error"),
          success: req.flash("success"),
          regulayActiveHi : 'active',
          sitActive : 'active',
          type: 'cash',
          tableType : 'texas'
        };
        return res.render('cashGame/poker-texas/gameHistory',data);
      }catch (e){
        //console.log("Error",e);
      }
    },


    gameHistoryRegularTou: async function(req,res){
      try {
       let start = parseInt(req.query.start);
       let length = parseInt(req.query.length);
       let search = req.query.search.value;
       let val = 'PCG';
       let query = {};
       if (search != '') {
         let capital = search;
         query = { gameNumber: { $regex: '.*' + val + '.*' } , gameNumber: { $regex: '.*' + search + '.*' }};
       } else {
         query = { gameNumber: { $regex: '.*' + val + '.*' }};
       }

       let gameC = await Sys.App.Services.GameService.getByData(query);
       let gameCount = gameC.length;
       let data = await Sys.App.Services.GameService.getGameDatatable(query, length, start);
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


  tableHistoryRegularTou: async function(req,res){
   try{
          // let game = await load('App/Models/Game').findOne({id : req.params.id});
          let game = await Sys.App.Services.GameService.getSingleGameData({ _id : req.params.id});
          let allPlayer = game.players;
          let gameHistory = game.players;
          let history = game.history;
          let winner = game.winners;
          let count = 0;

          for (var j = 0; j < allPlayer.length; j++) {
            allPlayer[j].count = count = count + 1;
            for (var k = 0; k < allPlayer[j].cards.length; k++) {

              allPlayer[j].cards[k] = '<img src="/card/' +allPlayer[j].cards[k] +'.png" width="70px">';

            }
          }

          for (var w = 0; w < winner.length; w++) {
            winner[w].count = count = count + 1;
            for (var wk = 0; wk < winner[w].hand.length; wk++) {
              winner[w].hand[wk] = '<img src="/card/' +winner[w].hand[wk] +'.png" width="70px">';
            }
          }

          for (var h = 0; h < history; h++) {
            history[h].history = history[h].history;
          }

          for (var d = 0; d < game.deck.length; d++) {
            game.deck[d] = '<img src="/card/' +game.deck[d] +'.png" width="70px">&nbsp;&nbsp;';
          }

          return res.render('cashGame/poker-texas/tableHistory',{players : allPlayer ,
            gameHistory:gameHistory ,
            winners : winner ,
            games : game ,
            historys : history});
        }catch (e){
          //console.log("Error",e)
        }
      },

      gameOmahaRegularTou: async function(req,res){
        try{
          var data = {
            App : Sys.Config.App.details,
            error: req.flash("error"),
            success: req.flash("success"),
            regulayOmahaActiveHi : 'active',
            type: 'cash',
            tableType : 'omaha'
          };
          return res.render('cashGame/poker-omaha/gameHistory',data);
        }catch (e){
          //console.log("Error",e);
        }
      },


      getGameHistoryRegularTou: async function(req,res){
        try {
         let start = parseInt(req.query.start);
         let length = parseInt(req.query.length);
         let search = req.query.search.value;
         let val = 'POG';
         let query = {};
         if (search != '') {
           let capital = search;
           query = { gameNumber: { $regex: '.*' + val + '.*' } , gameNumber: { $regex: '.*' + search + '.*' }};
         } else {
           query = { gameNumber: { $regex: '.*' + val + '.*' }};
         }

         let gameC = await Sys.App.Services.GameService.getByData(query);
         let gameCount = gameC.length;
         let data = await Sys.App.Services.GameService.getGameDatatable(query, length, start);

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

   getTableHistoryOmahaRegularTou: async function(req,res){

    try{
          // let game = await load('App/Models/Game').findOne({id : req.params.id});
          let game = await Sys.App.Services.GameService.getSingleGameData({ _id : req.params.id});
          let allPlayer = game.players;
          let gameHistory = game.players;
          let history = game.history;
          let winner = game.winners;
          let count = 0;

          for (var j = 0; j < allPlayer.length; j++) {
            allPlayer[j].count = count = count + 1;
            for (var k = 0; k < allPlayer[j].cards.length; k++) {

              allPlayer[j].cards[k] = '<img src="/card/' +allPlayer[j].cards[k] +'.png" width="70px">';

            }
          }

          for (var w = 0; w < winner.length; w++) {
            winner[w].count = count = count + 1;
            for (var wk = 0; wk < winner[w].hand.length; wk++) {
              winner[w].hand[wk] = '<img src="/card/' +winner[w].hand[wk] +'.png" width="70px">';
            }
          }

          for (var h = 0; h < history; h++) {
            history[h].history = history[h].history;
          }

          for (var d = 0; d < game.deck.length; d++) {
            game.deck[d] = '<img src="/card/' +game.deck[d] +'.png" width="70px">&nbsp;&nbsp;';
          }

          return res.render('cashGame/poker-omaha/tableHistory',{players : allPlayer ,
            gameHistory:gameHistory ,
            winners : winner ,
            games : game ,
            historys : history});
        }catch (e){
          //console.log("Error",e)
        }

      },

      allGameHistoryLimited: async function(req,res){
          try{
            let game = await Sys.App.Services.GameService.getLimitedGame({});
            let gameData = [];
            for(var m= 0; m < game.length; m++ ){
              let dt = new Date(game[m].updatedAt);
              game[m].createdAtFormated =moment(dt).format('YYYY/MM/DD');
              if (game[m].type != undefined) {
                gameData.push(game[m])
              }
            }

             var obj = {
              'draw': req.query.draw,
              'data': gameData
            };
            res.send(obj);
          }catch(e){
            //console.log(e);
          }
      },

      activeGame: async function(req,res){
        try{
          let game = await Sys.App.Services.RoomServices.getRoomData();


          let gameData = [];
           for(var m= 0; m < game.length; m++ ){
          //   let dt = new Date(game[m].updatedAt);
          if(game[m].game!=null)
          {
            gameData.push(game[m]);
          }


          //   game[m].createdAtFormated =moment(dt).format('YYYY/MM/DD');
            // if (game[m].type != undefined) {
            //   if(game[m].status== 'Running'){
            //     //console.log("---status---",game[m].status)
            //     if (game[m].players!=''){
            //       //console.log("---player---",game[m].players)
            //       if(game[m].players && game[m].players.length >1){
            //         //console.log("---player length---",game[m].players.length)
            //         for(let i=0; i<game[m].players.length;i++)
            //         {
            //          //console.log("game[m].players[i].status",game[m].players[i].status)
            //           if(game[m].players[i].status=='playing')
            //           {
            //             gameData.push(game[m]);
            //           }
            //         }
            //       }

            //     }
            //   }

            // }

          }

           var obj = {
            'draw': req.query.draw,
            'data': gameData
          };
          res.send(obj);
        }catch(e){
          //console.log(e);
        }
    },

      allGameData: async function(req, res){
          try{
            var data = {
              App : Sys.Config.App.details,
              error: req.flash("error"),
              success: req.flash("success"),
              allGameHistory : 'active',
            };
            return res.render('game/game',data);
          }catch (e){
            //console.log("Error",e);
          }
      },

      getAllGameData: async function(req,res){
          try{

             let start = parseInt(req.query.start);
             let length = parseInt(req.query.length);
             let search = req.query.search.value;
             let query = {};
             if (search != '') {
               query = { gameNumber: { $regex: '.*' + search + '.*' }};
             }

             let gameC = await Sys.App.Services.GameService.getByData(query);
             let gameCount = gameC.length;
             let data = await Sys.App.Services.GameService.getGameDatatable(query, length, start);

             for(var m= 0; m < data.length; m++ ){
               let dt = new Date(data[m].createdAt);
               ////console.log("created at", moment(dt).format('YYYY/MM/DD'));
               data[m].createdAt =moment(dt).format('YYYY/MM/DD');

             }

             ////console.log("all game data",data.length);
             var obj = {
              'draw': req.query.draw,
              'recordsTotal': gameCount,
              'recordsFiltered': gameCount,
              'data': data
            };
            res.send(obj);
          }catch(e){
            //console.log(e);
          }
      },

      allGameHistory: async function(req, res){

        try{
             let game = await Sys.App.Services.GameService.getSingleGameData({ _id : req.params.id});
             let dt = moment(new Date(game.createdAt)).format('YYYY/MM/DD,h:mm:ss a');

             // date diff
             ////console.log( Date.parse(game.createdAt) );
             ////console.log( Date.parse(game.updatedAt) );

             let startTime = moment(game.createdAt);
             let endTime = moment(game.updatedAt);
             var duration = endTime.diff(startTime,'minutes',true);

             let gameDates = {createdAt:dt,updatedAt:moment(new Date(game.updatedAt)).format('YYYY/MM/DD,h:mm:ss a'),gameDuration:duration.toFixed(2)}

             let allPlayer = game.players;
             let gameHistory = game.players;
             let history = game.history;
             let winner = game.winners;

             //let count = 0;

             if(allPlayer){
             for (var j = 0; j < allPlayer.length; j++) {
               //allPlayer[j].count = count = count + 1;
               for (var k = 0; k < allPlayer[j].cards.length; k++) {

                 allPlayer[j].cards[k] = '<img src="/card/' +allPlayer[j].cards[k] +'.png" width="50px">';

               }
             }
            }

             if(winner){
             for (var w = 0; w < winner.length; w++) {
               //winner[w].count = count = count + 1;
               if(winner[w].hand){
               for (var wk = 0; wk < winner[w].hand.length; wk++) {
                 winner[w].hand[wk] = '<img src="/card/' +winner[w].hand[wk] +'.png" width="50px">';
               }
              }
             }
            }

             for (var h = 0; h < history; h++) {
               history[h].history = history[h].history;
             }
             if(game.deck)
             {
             for (var d = 0; d < game.deck.length; d++) {
               game.deck[d] = '<img src="/card/' +game.deck[d] +'.png" width="50px">&nbsp;&nbsp;';
             }
            }

             return res.render('game/gameHistory',{players : allPlayer ,
               gameHistory:gameHistory ,
               winners : winner ,
               games : game ,
               historys : history,
               gameDates:gameDates});
           }catch (e){
             //console.log("Error",e)
           }

      },

      getParticularGameType: async function(req, res){
          try{
            var data = {
              App : Sys.Config.App.details,
              error: req.flash("error"),
              success: req.flash("success"),
              particularGameHistoryMenu : 'active',
              particularGameHistoryMenuOpen : 'active menu-open',
              gameName: req.params.gameName,
              gameType:req.params.gameType
            };

            return res.render('game/particular-game-type',data);
          }catch (e){
            //console.log("Error",e);
          }
      },

      getParticularGameTypeData: async function(req, res){
        try{
           let start = parseInt(req.query.start);
           let length = parseInt(req.query.length);
           let search = req.query.search.value;


           let query = {type: req.params.gameName, gameType:req.params.gameType};
           if (search != '') {
             query = { gameNumber: { $regex: '.*' + search + '.*' }, type: req.params.gameName, gameType:req.params.gameType};
           }

           if(req.query.is_date_search == "yes")
           {
             query = { type: req.params.gameName, gameType:req.params.gameType, createdAt:{$gte: req.query.start_date, $lt: req.query.end_date}};
             //$query .= 'order_date BETWEEN "'.$_POST["start_date"].'" AND "'.$_POST["end_date"].'" AND ';
           }
           //res.send(query);
           let gameC = await Sys.App.Services.GameService.getByData(query);
           let gameCount = gameC.length;
           let data = await Sys.App.Services.GameService.getGameDatatable(query, length, start);

           /*for(var m= 0; m < newData.length; m++ ){
             let dt = new Date(newData[m].createdAt);
             //console.log("created at", moment(dt).format('YYYY/MM/DD'));
             data[m].createdAt =moment(dt).format('YYYY/MM/DD');

           }*/
          //  //console.log("all game data",data);
           var obj = {
            'draw': req.query.draw,
            'recordsTotal': gameCount,
            'recordsFiltered': gameCount,
            'data': data
          };
          res.send(obj);
        }catch(e){
          //console.log(e);
          return new Error(e);
        }
        //res.send(req.params.gameName ,gameType);
      },

      particularGameHistory: async function(req, res){

        try{
             let game = await Sys.App.Services.GameService.getSingleGameData({ _id : req.params.id});
             let dt = moment(new Date(game.createdAt)).format('YYYY/MM/DD,h:mm:ss a');

             let query = { gameid : req.params.id};
             let won  = await Sys.App.Services.ServieChargeService.getSingleDocument(query);
             let win ;

             if(won && won != null && won.winnerAmount && won.winnerAmount!=null )
             {
             win =won.winnerAmount;
             }

             // date diff
             ////console.log( Date.parse(game.createdAt) );
             ////console.log( Date.parse(game.updatedAt) );

             let startTime = moment(game.createdAt);
             let endTime = moment(game.updatedAt);
             var duration = endTime.diff(startTime,'minutes',true);

             let gameDates = {createdAt:dt,updatedAt:moment(new Date(game.updatedAt)).format('YYYY/MM/DD,h:mm:ss a'),gameDuration:duration.toFixed(2)}

             let allPlayer = game.players;
             let gameHistory = game.players;
             let history = game.history;
             let winner = game.winners;
             //let count = 0;

             for (var j = 0; j < allPlayer.length; j++) {
               //allPlayer[j].count = count = count + 1;
               for (var k = 0; k < allPlayer[j].cards.length; k++) {

                 allPlayer[j].cards[k] = '<img src="/card/' +allPlayer[j].cards[k] +'.png" width="50px">';

               }
             }

             // for (var w = 0; w < winner.length; w++) {
             //   //winner[w].count = count = count + 1;
             //   for (var wk = 0; wk < winner[w].hand.length; wk++) {
             //     winner[w].hand[wk] = '<img src="/card/' +winner[w].hand[wk] +'.png" width="50px">';
             //   }
             // }

            // let getplayerName = await Sys.App.Services.PlayerServices.getPlayerData({_id: '5bb36d461b3b675792d10966'});
             ////console.log("player name",getplayerName);

             for (var h = 0; h < history.length; h++) {

              //history[h].playerName = history[h]
               //history[h].history = history[h].history;
               //console.log("player id", history[h].playerId)
               let getPlayerUserName = await Sys.App.Services.PlayerServices.getSinglePlayerData({_id: history[h].playerId});
               if(getPlayerUserName){
                history[h].playerId = getPlayerUserName.username;
               }
               history[h].card = '<img src="/card/' +history[h].card +'.png" width="50px">';
             }

             for (var d = 0; d < game.jokerCard.length; d++) {
               game.jokerCard[d] = '<img src="/card/' +game.jokerCard[d] +'.png" width="50px">&nbsp;&nbsp;';
             }

             for (var d = 0; d < game.openDeck.length; d++) {
               if(game.openDeck[d][game.openDeck[d].length - 1] == 'J'){
                 game.openDeck[d] = game.openDeck[d].slice(0, -1);
               }
               game.openDeck[d] = '<img src="/card/' +game.openDeck[d] +'.png" width="50px">&nbsp;&nbsp;';

             }

             for (var d = 0; d < game.closeDeck.length; d++) {

              if(game.closeDeck[d][game.closeDeck[d].length - 1] == 'J'){
                game.closeDeck[d] = game.closeDeck[d].slice(0, -1);
              }
               game.closeDeck[d] = '<img src="/card/' +game.closeDeck[d] +'.png" width="50px">&nbsp;&nbsp;';
             }

             for (var d = 0; d < game.finishDeck.length; d++) {
               if(game.finishDeck[d][game.finishDeck[d].length - 1] == 'J'){
                 game.finishDeck[d] = game.finishDeck[d].slice(0, -1);
               }
               game.finishDeck[d] = '<img src="/card/' +game.finishDeck[d] +'.png" width="50px">&nbsp;&nbsp;';
             }



             return res.render('game/particular-game-history',{
               players : allPlayer ,
               gameHistory:gameHistory ,
               winners : winner ,
               games : game ,
               historys : history,
               gameDates:gameDates,
               won:win
             });
           }catch (e){
             //console.log("Error",e)
           }

      },

  }
