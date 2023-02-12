var Sys = require('../../Boot/Sys');
var bcrypt = require('bcryptjs');
const moment = require('moment');

module.exports = {
    home: async function(req,res){
        try {

    let activeGames = await Sys.App.Services.GameService.getByData({status: 'Running'});
    let activeTables = await Sys.App.Services.RoomServices.getByData({status: 'Running'});
    let newUsers = await Sys.App.Services.PlayerServices.getLimitPlayer({status: 'Running'});
    let query = {};
    // convert timestamp to date time format
    for (var k = 0; k < newUsers.length; k++) {
      let dt = new Date(newUsers[k].createdAt);
      let createdAt = dt.toUTCString();
      newUsers[k].createdAt = createdAt;
    }

    var date = new Date();
    var today = date.getFullYear()+"-"+parseInt(date.getMonth()+1)+"-"+date.getDate();
    var yesterday = date.getFullYear()+"-"+parseInt(date.getMonth()+1)+"-"+parseInt(date.getDate()-1);
    var tommorow = date.getFullYear()+"-"+parseInt(date.getMonth()+1)+"-"+parseInt(date.getDate()+1);
    var winnerId = [];

    // let todayGames = await load('App/Models/Game').find({createdAt: {'>': new Date(yesterday), '<': new Date(tommorow) }});
    /*query = { createdAt: {$gte: new Date(yesterday),$lte: new Date(tommorow) } };
    let todayGames = await Sys.App.Services.GameService.getByData(query);

    for (var i = 0; i < todayGames.length; i++) {
      if(todayGames[i].winners[0]){
          winnerId[i] = todayGames[i].winners[0].playerId;
      }
    }

    let winnersToday = await Sys.App.Services.PlayerServices.getByData({id: winnerId});
    query = { status: 'active' };
    let activePlayers = await  Sys.App.Services.PlayerServices.getByData(query);
    var topWinnerId = [];
    let topperWinner = await Sys.App.Services.GameService.getByData({status: 'Finished'});

    for (var j = 0; j < topperWinner.length; j++) {
      if(topperWinner[j].winners[0]){
          topWinnerId[j] = topperWinner[j].winners[0].playerId;
      }

    }

    let topFiveWinner = await Sys.App.Services.PlayerServices.getByData({id: topWinnerId}); */

    let latestPalyer = await Sys.App.Services.PlayerServices.getLimitPlayer({});

    ////console.log("before",latestPalyer);
    // convert timestamp to date time format
    for (var m = 0; m < latestPalyer.length; m++) {
      let dt = new Date(latestPalyer[m].createdAt);
      latestPalyer[m].createdAtFormated =moment(dt).format('YYYY/MM/DD');
    }

    // Total game Played
    let getTotalGamePlayed = await Sys.App.Services.GameService.getGameData();
    let getTotalPlayer =await Sys.App.Services.PlayerServices.getPlayerData();

    //Total Cash
    let totalCash=0;
    for(let i=0; i<getTotalPlayer.length;i++)
    {
         totalCash +=parseFloat(getTotalPlayer[i].cash);
    }

    //Total Online Players
     let onlinePlayers = Sys.Io.engine.clientsCount;


    let getTopPlayers = await Sys.App.Services.PlayerServices.getLimitedPlayerWithSort({},6);
    ////console.log("total player",getTotalPlayer.length);

    let platformQuery =[

        {
            "$group":{
                "_id":{"platform":"$platform"},"count":{"$sum":1}
            }
        },
        {"$project":{
            "count":1,

            "percentage":{
                "$multiply":[
                    {"$divide":[100,getTotalPlayer.length]},"$count"
                ]
            }

            }
        }
    ];
    let getPlatformdata = await Sys.App.Services.PlayerServices.aggregateQuery(platformQuery);
    let platformdataObj={};
        // platformdataObj.android=getPlatformdata.filter(platform => platform._id.platform == 'android');
        // platformdataObj.web=getPlatformdata.filter(platform => platform._id.platform == 'web');
        // platformdataObj.ios=getPlatformdata.filter(platform => platform._id.platform == null);

    ////console.log(platformdataObj);


            var data = {
                    App : Sys.Config.App.details,
                    error: req.flash("error"),
                    success: req.flash("success"),
                    activeGames: activeGames,
                    activeTables: activeTables,
                    newUsers: newUsers,
                    //winnersToday: winnersToday,
                    //activePlayers: activePlayers,
                    //topFiveWinner: topFiveWinner,
                    classActive : 'active',
                    user:req.session.details,
                    latestPalyer:latestPalyer,
                    totalGamePlayed:module.exports.convertBigNumber(getTotalGamePlayed.length),
                    toalPlayer: getTotalPlayer.length,
                    totalOnlinePlayers:onlinePlayers,
                    topPlayers : getTopPlayers,
                    platformData:platformdataObj,
                    totalCash:totalCash.toFixed(2),
                };
                return res.render('templates/dashboard',data);
        } catch (e) {
            //console.log("Error",e);
        }
    },

    convertBigNumber:function(number){
          if(number >= 1000000){
            let newValue = number;
            const suffixes = ["", "K", "M", "B","T"];
            let suffixNum = 0;
            while (newValue >= 1000) {
              newValue /= 1000;
              suffixNum++;
            }

            newValue = newValue.toPrecision(3);

            newValue += suffixes[suffixNum];
            return newValue;
          }
          return number;


    },

    getMonthlyPlayedGameChart:async function(req, res){

        let query =[
                    // {
                    //     "$project": {
                    //         "getIsoDate": { "$toDate": "$createdAt" }
                    //     }
                    // },
                    // {
                    //     $group:{
                    //         _id : { month: {$month: '$getIsoDate'},year:{$year:'$getIsoDate'} },
                    //         count: {$sum: 1}
                    //     }

                    // },
                    {
                        $match: {
                            createdAt: {
                                $lte: new Date(new Date().getFullYear()+"-12-30"),
                                $gte: new Date(new Date().getFullYear()+"-01-01")
                             }
                        }
                    },

                    {
                        $group:{
                            _id : {month:{$month: '$createdAt'}},
                            count: {$sum: 1}
                        }

                    },
                    {
                        $project :{
                            month: 1,
                            count:1
                        }
                    }



        ];


        let monthlyGamePlayed = await Sys.App.Services.GameService.aggregateQuery(query);

        let monthlyGamePlayedArray = [];
        for(user of monthlyGamePlayed)
        {

            monthlyGamePlayedArray[user._id.month -1] = user.count;

        }
        return res.json(monthlyGamePlayedArray);
    },

    getGameUsageChart: async function(req,res){
        let getTotalPlayer =await Sys.App.Services.PlayerServices.getPlayerData();
        let platformQuery =[

                {
                    "$group":{
                        "_id":{"platform":"$platform"},"count":{"$sum":1}
                    }
                },
                {"$project":{
                    "count":1,

                    "percentage":{
                        "$multiply":[
                            {"$divide":[100,getTotalPlayer.length]},"$count"
                        ]
                    }

                    }
                }
            ];

            let getPlatformdata = await Sys.App.Services.PlayerServices.aggregateQuery(platformQuery);
            let platformdataObj={};
                // platformdataObj.android=getPlatformdata.filter(platform => platform._id.platform == 'android');
                // platformdataObj.web=getPlatformdata.filter(platform => platform._id.platform == 'web');
                // platformdataObj.ios=getPlatformdata.filter(platform => platform._id.platform == null);
            res.json(platformdataObj);
    },

    createDummyUser: async function(req,res){
      //console.log("Process for creating Dummy Players start here");
      let password = '123456'
      for (var i = 1; i < 151; i++) {
        await Sys.App.Services.PlayerServices.insertPlayerData(
        {
          deviceId            : 'udadha',
          username            : 'Player@'+i,
          email               : 'Player_'+i+'@test.com',
          emailverified       : false,
          password            : bcrypt.hashSync(password, 10),
          // ip                  : data.ip ,
          isFbLogin           : false,
          profilePic          : 'default.png',
          chips               : 10000,
          cash                : 0,
          cashTransaction     : '0',  //this field manage the total transaction of cash in game
          rewardPoint         : 0,  //this will store the reward points based on his play history
          status              : 'active',
          // socketId            : socket.id,
          // mobile              : data.mobile
            // image: req.files.image.name
        });


      }
      //console.log("Process for creating Dummy Players Ends here");

      return res.send('Player Created SuccessFully');

    },



}
