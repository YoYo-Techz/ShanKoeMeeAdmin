var Sys = require('../../Boot/Sys');
var bcrypt = require('bcryptjs');
var	http = require('http');
var parseInt = require('parse-int');
var fs = require('fs');
var moment=require('moment');
var pdf = require('html-pdf');
var jwt = require('jsonwebtoken');
var jwtcofig = {
  'secret': 'AisJwtAuth'
};
const nodemailer = require('nodemailer');
var defaultTransport = nodemailer.createTransport({
 service: 'Gmail',
 host: "smtp.gmail.com",
 port: 587,
 auth: {
   user: Sys.Config.App.mailer.auth.user,
   pass: Sys.Config.App.mailer.auth.pass
 }
});
module.exports = {

	player: async function(req,res){
    try {
      var data = {
        App : Sys.Config.App.details,
        error: req.flash("error"),
        success: req.flash("success"),
        playerActive : 'active'

      };
      return res.render('player/player',data);
    } catch (e) {
      //console.log("Error",e);
    }
  },

  getPlayer: async function(req,res){
			try {
	        let start = parseInt(req.query.start);
	        let length = parseInt(req.query.length);
	        let search = req.query.search.value;

	        let query = {};
	        if (search != '') {
	          let capital = search;
	            // query = {
	              // or: [
	                // {'username': { 'like': '%'+search+'%' }},
	                // {'username': { 'like': '%'+capital+'%' }}
	              //  ]
	                // };
                  if(isNaN(search)){
                    query =  { $or:[{username: { $regex: '.*' + search + '.*' }},{email:{$regex: '.*' + search + '.*'}}]};
                   }else{
                    query =  { $or:[{mobile:search }]};
                   }
					} else {
	          query = { };
	        }
	        let columns = [
	        'id',
	        'username',
	        'firstname',
	        'lastname',
	        'email',
	        'chips',
	        'status',
	        'isBot',
	        ]

          let playersC = await Sys.App.Services.PlayerServices.getPlayerData(query);

	        let playersCount = playersC.length;
          let data = await Sys.App.Services.PlayerServices.getPlayerDatatable(query, length, start);
         // //console.log('player data--------->',data);


         let allplayerdata = await Sys.App.Services.PlayerServices.getPlayerData({});

         ////console.log('all player data------>',allplayerdata);
         //pdf create
         var playerdata =[];
         for(let i =0; i< allplayerdata.length; i++){


           playerdata.push({

             username    : allplayerdata[i].username,
               email			:	allplayerdata[i].email,
               kycDone		:	allplayerdata[i].kycDone,
               chips			:	allplayerdata[i].chips,
               cash			:	allplayerdata[i].cash,
               status		:	allplayerdata[i].status,
               mobile		:	allplayerdata[i].mobile,
               kycDone		:	allplayerdata[i].kycDone,
               rewardPoint :allplayerdata[i].rewardPoint,
               tdsAmount :allplayerdata[i].tdsAmount,
             //  releasedCash:allplayerdata[i].releasedCash,
         });
        }

          //  doc.text(`Username: ${element.username}  Email: ${element.email}  Mobile: ${element.mobile}  KYCDone: ${element.kycDone}  Chips: ${element.chips}  Cash: ${element.cash}  RewardPoint: ${element.rewardPoint}  Status: ${element.status}`,100,100);
          let newPlrObj = [];
					// Check KYC done
					for (var j = 0; j < data.length; j++) {
						let getDocument = await Sys.App.Services.OtherAllService.getDocument({playerId : data[j]._id, status: 'Accept' });
						// //console.log("getDocument", getDocument.length); return false;
						let kycDone = 'Notdone';
						if (getDocument.length != 0) {
			        // //console.log("hhhh", getDocument.length);
			        kycDone = 'Done';
            }

            let mobile = data[j].mobile;
            if (data[j].mobile == undefined) {
              mobile = '';
            }
            cash =parseFloat(data[j].cash).toFixed(2);
            rewardPoint=parseFloat(data[j].rewardPoint).toFixed(2);

            // var date=new Date();
            //  date = ('0' + date.getDate()).slice(-2) + '/' + ('0' + (date.getMonth()+1)).slice(-2);
            // var d = new Date();
           // var last=d.setDate(31);

            // //console.log("date",date);
            // var last= moment(d).format('31/03');
            // //console.log("lastdate",last);

            let tdsAmount=data[j].tdsAmount;

          // if(date==last){
          //   //console.log("yessss")
          //   tdsAmount=0;
          //  let getData = await Sys.App.Services.PlayerServices.update({
          //       tdsAmount:tdsAmount
          //  });
          // }
            // let getData = await Sys.App.Services.TransactionServices.getPlayerCashData({playerId:data[j]._id});


						newPlrObj.push(
							{
								_id				: data[j]._id,
								username	:	data[j].username,
								firstname	:	data[j].firstname,
								lastname	:	data[j].lastname,
								email			:	data[j].email,
								kycDone		:	data[j].kycDone,
								chips			:	data[j].chips,
								cash			:	cash,
								status		:	data[j].status,
								mobile		:	mobile,
                kycDone		:	kycDone,
                rewardPoint:rewardPoint,
                tdsAmount :tdsAmount
                // releasedCash:getData.releasedCash,
							}
						);
            // data[i]['kycDone'] = 'Notdone';

            }
          // //console.log("data", newPlrObj);
          // return false;
					// //console.log("data", data); return false;

	        var obj = {
	          'draw': req.query.draw,
	          'recordsTotal': playersCount,
	          'recordsFiltered': playersCount,
	          'data': newPlrObj
	        };
	        res.send(obj);
	    } catch (e) {
				//console.log("Error",e);
			}
  },

  tdsZero:async function(req,res){
    try {
        let newPlrObj = [];
        let getData;
         let data = await Sys.App.Services.PlayerServices.getPlayerData();

         // //console.log("data",data);
            var date=new Date();
            date = ('0' + date.getDate()).slice(-2) + '/' + ('0' + (date.getMonth()+1)).slice(-2);
            var d = new Date();
            var last=d.setDate(31);

            ////console.log("date",date);
            var last= moment(d).format('31/03');
            ////console.log("lastdate",last);

          let tdsAmount;
          for(var d=0; d < data.length; d++){
            // //console.log(data[d].tdsAmount);
            tdsAmount=data[d].tdsAmount;
          //  //console.log("tds",tdsAmount);

            if(date==last){
            // //console.log("yessss")
              tdsAmount=0;
               getData = await Sys.App.Services.PlayerServices.update({
                  tdsAmount:tdsAmount
              });
            }


            newPlrObj.push(
              {
                _id				: data[d]._id,
                username	:	data[d].username,
                firstname	:	data[d].firstname,
                lastname	:	data[d].lastname,
                email			:	data[d].email,
                kycDone		:	data[d].kycDone,
                chips			:	data[d].chips,
                //cash			:	cash,
                status		:	data[d].status,
              //	mobile		:	mobile,
               // kycDone		:	kycDone,
               // rewardPoint:rewardPoint,
                tdsAmount :tdsAmount,
               // releasedCash:releasedCash,
              }
            );

      }

       // res.render('player/tdsZero',{value:newPlrObj});
      return res.send('Done');

    } catch (error) {
      //console.log("Error",error);

    }
  },

  pdfGenrate:async function(req,res){
     try{

          var date=new Date();
          var lastday= new Date(date.getFullYear(), date.getMonth() + 1, 0);

          //console.log("lastday",lastday);

          var today=Date.now();
          //console.log("today",today);
          today = moment(today).format('DD/MM/YY');
         // lastday = moment(lastday).format('YYYY-MM-DD');
          let lastdate = ('0' + lastday.getDate()).slice(-2) + '/' + ('0' + (lastday.getMonth()+1)).slice(-2)  + '/' + ('0' + lastday.getFullYear()).slice(-2);
          //console.log("log",lastday.getDate());
          //console.log("lastdate",lastdate);
          //console.log("today",today);
          if(today==lastdate){
            //console.log('yessss',lastday);
            let allplayerdata = await Sys.App.Services.PlayerServices.getPlayerData({});
            ////console.log('all player data------>',allplayerdata);
            var playerdata =[];
            for(let i =0; i< allplayerdata.length; i++){

            playerdata.push({
              username    : allplayerdata[i].username,
                email			:	allplayerdata[i].email,
                mobile		:	allplayerdata[i].mobile,
                kycDone		:	allplayerdata[i].kycDone,
                chips			:	allplayerdata[i].chips,
                cash			:	allplayerdata[i].cash,
                status		:	allplayerdata[i].status,
                rewardPoint :allplayerdata[i].rewardPoint,
              //  releasedCash:allplayerdata[i].releasedCash,
            });

            if(playerdata[i].mobile==null){
              playerdata[i].mobile='Not Available';
              // //console.log(playerdata[i].mobile);
            }
            if(playerdata[i].cash==undefined){
              playerdata[i].cash='Not Available';
              ////console.log(playerdata[i].cash);
            }
            if(playerdata[i].rewardPoint==undefined){
              playerdata[i].rewardPoint='Not Available';
              ////console.log(playerdata[i].rewardPoint);
            }
          }
          // //console.log('player--->',playerdata);
          var datain=JSON.stringify(playerdata);

          // Embed a font, set the font size, and render some text
          // //console.log(typeof(datain));
          let jsonData = JSON.parse(datain);
          // //console.log('typeof(jsonData)', typeof(jsonData));
          // //console.log('jsonData', jsonData);
          var dat=Date.now();
          var mon=moment(dat).format('LL');
          let htmlData = '<html>\
          <head>\
          <meta charset="utf-8"><h2>The Rummy Round</h2>\
          <p>Date : '+mon+'</p>\
          <table border=1 cellpadding="3">\
          <thead>\
          <tr>\
          <th style=font-size:12px;>Username</th><br>\
          <th style=font-size:12px;>Email</th>\
          <th style=font-size:12px;>Mobile</th>\
          <th style=font-size:12px;>Chips</th>\
          <th style=font-size:12px;>Cash</th>\
          <th style=font-size:12px;>Reward Points</th>\
          <th style=font-size:12px;>Status</th>\
          </tr>\
          </thead>\
          </head>\
          <tbody>';


          var count=0;
          for (let i = 0; i < jsonData.length; i++) {
            // const element = array[i];
            htmlData += '<tr>\
            <th style=font-size:12px;font-weight:lighter;>'+jsonData[i].username+'</th>\
            <th style=font-size:12px;font-weight:lighter;>'+jsonData[i].email+'</th>&nbsp;\
            <th style=font-size:12px;font-weight:lighter;>'+jsonData[i].mobile+'</th>\
            <th style=font-size:12px;font-weight:lighter;>'+jsonData[i].chips+'</th>\
            <th style=font-size:12px;font-weight:lighter;>'+jsonData[i].cash+'</th>\
            <th style=font-size:12px;font-weight:lighter;>'+jsonData[i].rewardPoint+'</th>\
            <th style=font-size:12px;font-weight:lighter;>'+jsonData[i].status+'</th>\
            </tr>';
            count++;

          }
          htmlData += '</tbody>\
          </table>\
          <b><p style=font-size:12px;>Total '+count+' entries\
          </p></b>\
          </html>';
          var options = { format: 'letter',
          orientation:'landscape',
          "border": {
            "top": "0.4in",            // default is 0, units: mm, cm, in, px
            "right": "0.43in",
            "bottom": "0.4in",
            "left": "0.43in"
          },

          "zoomFactor": "1",

        };
        var pdfdata;
        var date=Date.now();
        var month=moment(date).format("MMM - YY");
        pdf.create(htmlData,options).toFile(`./public/pdf/rummy-${month}.pdf`, function(err, res) {
          if (err) return //console.log(err);
          //console.log(res); // { filename: '/app/businesscard.pdf' }
        });
        pdfdata={
          pdfname:'rummy-'+month
        }
        let data = await Sys.App.Services.PlayerServices.insertPdfEntryData(pdfdata);
        //console.log('data',data);
        //let dispdata = await Sys.App.Services.PlayerServices.getPdfEntryData({});
        return res.render('player/pdfgenrateList');
      }else{

        //console.log('nooo');
        return res.send('');
      }
    }catch (e) {
      //console.log("Error",e);
    }
  },
  pdfgenrateList:async function(req,res){
    try{
     // dispdata={
     //   genrateReport : 'active'
     // }
    let dispdata = await Sys.App.Services.PlayerServices.getPdfEntryData({});

      return res.render('player/pdfgenrateList',{value:dispdata});
    } catch (e) {
			//console.log("Error",e);
		}
	},

  removepdfGenrate:async function(req,res){
    try{

     var date=Date.now();
     var month=moment(date).format("MMM - YY");
      await Sys.App.Services.PlayerServices.removePdfEntryData(req.params.id);
      fs.unlink('./public/pdf/rummy-'+month+'.pdf', function(error) {
       if (error) {
           throw error;
       }
       //console.log('File Deleted !!');
   });
      res.redirect('/player/pdfgenrateList');

    } catch (e) {
			//console.log("Error",e);
		}
	},



	getActivePlayer: async function(req,res){

		try {

			let query = { };
			let data = await Sys.App.Services.PlayerServices.getPlayerData(query);
			var obj = {
				'data': data
			};
			res.send(obj);
		} catch (e) {
			//console.log("Error",e);
		}
	},


	addPlayer : async  function(req , res){

		try{

			var data = {
				App : Sys.Config.App.details,
				error: req.flash("error"),
				success: req.flash("success"),
				playerActive : 'active'
			};
			return res.render('player/add',data);
		} catch(e){
			//console.log("Error",e);
		}
	},

  addPlayerPostData: async function(req,res){
    try {

      otp = Math.floor(1000 + Math.random() * 9000);

       //res.send(req.files.image.name);
      let player = await Sys.App.Services.PlayerServices.getPlayerData({email: req.body.email});
      if (player && player.length >0) {
        req.flash('error', 'Player Already Present');
        res.redirect('/player');
        return;

      }else {
        //console.log('insetdata');
       let player= await Sys.App.Services.PlayerServices.insertPlayerData(
        {
          username: req.body.username,
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          mobile: req.body.mobile,
          email: req.body.email,
          gender: req.body.gender,
          isBot: req.body.bot,
          password : bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(8), null),
          device_id : 'abcd',
          chips : 1000,
          diamonds : 100
            // image: req.files.image.name
          }
          )

          let cashNewPlayer = Sys.Config.Rummy.defaultCash;

          let playerObj = {
              deviceId            : 'abcd',
              username            : req.body.username,
              email               : req.body.email,
              emailverified       : false,
              password            : bcrypt.hashSync(req.body.password, 10),
         //     ip                  : data.ip,
              isFbLogin           : false,
              profilePic          : 'default.png',
              chips               : Sys.Config.Rummy.defualtPrcticesChips,
              cash                : cashNewPlayer,
              cashTransaction     : '0',  //this field manage the total transaction of cash in game
              rewardPoint         : 0,  //this will store the reward points based on his play history
              status              : 'active',
            //  socketId            : socket.id,
              mobile              : req.body.mobile,
              otp                 : otp
          }

          player = await await Sys.App.Services.PlayerServices.insertPlayerData(playerObj);

         // //console.log('player---------',player);


          //mobile varification otp send sms
          let from='TEXTID';

          let sms_text='Your OTP Generate successfully and OTP is '+otp+' Mobile Varified Link '+'http://'+req.headers.host+'/mobileVarify/'+player._id;

          var request = require("request");

          var options = { method: 'GET',
          url: 'http://sms.textidea.com/app/smsapi/index.php',
          qs:
            { key: '45D1481F1B98AF',
              campaign: '4789',
              routeid: '100233',
              type: 'text',
              contacts: player.mobile,
              senderid: from,
              msg: sms_text },
          };

          request(options, function (error, response, body) {
          if (error) throw new Error(error);

          //console.log(body);
        });



                var mailOptions = {
                        to: player.email,
                        from: 'The RummyRounds',
                        subject: 'Activate Your The RummyRounds ',
                        text: 'Hello' +player.username +'.  Welcome to The RummyRounds.\n\n You are receiving this because your Account Created by Admin.\n\n' +
                          'And This is your account details to access your account.\n\n Your Email:  ' +player.email+
                          '\n\n Your Password is: ' + req.body.password + '\n\n.'
                };
                defaultTransport.sendMail(mailOptions, function(err) {
                        if (!err) {
                          // req.flash('success', 'An e-mail has been sent to ' + data.email + ' with further instructions.');
                          defaultTransport.close();
                          // return res.redirect('/forgot-password');
                        } else {
                          //console.log("Error sending mail,please try again After some time", err);
                          // req.flash('error', 'Error sending mail,please try again After some time.');
                          // return res.redirect('/forgot-password');
                        }

                });

         // return res.render('player/add',player);

         req.flash('success','Player create successfully');
         res.redirect('/player');
      }
      // req.flash('sucess', 'Player Registered successfully');
        // res.redirect('/');
    }
    catch (e) {
      //console.log("Error",e);
    }
  },
  //For Site Add New Player API
  /*addNewPlayerData: async function(req,res){
    try {

      otp = Math.floor(1000 + Math.random() * 9000);

       //res.send(req.files.image.name);
      let player = await Sys.App.Services.PlayerServices.getPlayerData({email: req.body.email});
      if (player && player.length >0) {
        //req.flash('error', 'Player Already Present');
        //res.redirect('/player');
        return res.send({"status":false,"message":"Player Already Present"});

      }else {
        //console.log('insetdata');
       let player= await Sys.App.Services.PlayerServices.insertPlayerData(
        {
          username: req.body.username,
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          mobile: req.body.mobile,
          isFbLogin:req.body.isFbLogin,
          profilePic:req.body.profilePic,
          email: req.body.email,
          gender: req.body.gender,
          isBot: req.body.bot,
          password : bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(8), null),
          device_id : 'abcd',
          chips : 1000,
          diamonds : 100
            // image: req.files.image.name
          }
          )

          let cashNewPlayer = Sys.Config.Rummy.defaultCash;

          let playerObj = {
              deviceId            : 'abcd',
              username            : req.body.username,
              email               : req.body.email,
              emailverified       : false,
              password            : bcrypt.hashSync(req.body.password, 10),
         //     ip                  : data.ip,
              isFbLogin           : false,
              profilePic          : 'default.png',
              chips               : Sys.Config.Rummy.defualtPrcticesChips,
              cash                : cashNewPlayer,
              cashTransaction     : '0',  //this field manage the total transaction of cash in game
              rewardPoint         : 0,  //this will store the reward points based on his play history
              status              : 'active',
            //  socketId            : socket.id,
              mobile              : req.body.mobile,
              otp                 : otp
          }

          player = await await Sys.App.Services.PlayerServices.insertPlayerData(playerObj);

         // //console.log('player---------',player);


          //mobile varification otp send sms
          let from='TEXTID';

          let sms_text='Your OTP Generate successfully and OTP is '+otp+' Mobile Varified Link '+'http://'+req.headers.host+'/mobileVarify/'+player._id;

          var request = require("request");

          var options = { method: 'GET',
          url: 'http://sms.textidea.com/app/smsapi/index.php',
          qs:
            { key: '45D1481F1B98AF',
              campaign: '4789',
              routeid: '100233',
              type: 'text',
              contacts: player.mobile,
              senderid: from,
              msg: sms_text },
          };

          request(options, function (error, response, body) {
          if (error) throw new Error(error);

          //console.log(body);
        });



                var mailOptions = {
                        to: player.email,
                        from: 'The RummyRounds',
                        subject: 'Activate Your The RummyRounds ',
                        text: 'Hello' +player.username +'.  Welcome to The RummyRounds.\n\n You are receiving this because your Account Created by Admin.\n\n' +
                          'And This is your account details to access your account.\n\n Your Email:  ' +player.email+
                          '\n\n Your Password is: ' + req.body.password + '\n\n.'
                };
                defaultTransport.sendMail(mailOptions, function(err) {
                        if (!err) {
                          // req.flash('success', 'An e-mail has been sent to ' + data.email + ' with further instructions.');
                          defaultTransport.close();
                          // return res.redirect('/forgot-password');
                        } else {
                          //console.log("Error sending mail,please try again After some time", err);
                          // req.flash('error', 'Error sending mail,please try again After some time.');
                          // return res.redirect('/forgot-password');
                        }

                });

         // return res.render('player/add',player);
         var token = jwt.sign({ id: player._id }, jwtcofig.secret, {
                          expiresIn: 60*60*24 // expires in 24 hours
                        });
         var data = {
                  id : player._id,
                  username : player.username,
                  jwt_token : token,
                  // avatar : 'default.png'
              };
         //req.flash('success','Player create successfully');
         //res.redirect('/player');
         return res.send({"status":true,"message":"Player create successfully","data":data})
      }
      // req.flash('sucess', 'Player Registered successfully');
        // res.redirect('/');
    }
    catch (e) {
      //console.log("Error",e);
    }
  },*/
  addNewPlayerData: async function(req,res){
        try {   
                  let myReferralCode = Math.floor(100000 + Math.random() * 900000);
                //let myReferralCode = Math.random().toString(36).substring(7);
                otp = Math.floor(1000 + Math.random() * 9000);
                // Check Username Already Avilable
                let player = await Sys.App.Services.PlayerServices.getPlayerData({ username: req.body.username });
                if (player && player.length >0) { // When Player Found
                    return res.send({"status":false,"message":"Username already taken."});
                }
                // Check Email Already Avilable
                player = await Sys.App.Services.PlayerServices.getPlayerData({ email: req.body.email });
                if (player && player.length >0) { // When Player Found
                    return res.send({"status":false,"message":"Email already taken."});
                }
                // Validation for Username
                 let validation = await Sys.App.Middlewares.Validator.registerUserPostValidateForGame({username: req.body.username});
                 if(validation.status == 'fail'){
                  return res.send({"status":false,"message":"Username is not valid."});
                }
                // Check Mobile Already Avilable
                player = await Sys.App.Services.PlayerServices.getPlayerData({ mobile: req.body.mobile });
                if (player && player.length >0) { // When Player Found
                  return res.send({"status":false,"message":"Mobile already taken."});
                }
                //Signup Promocode check
                // if (req.body.signUpPromo && req.body.signUpPromo.toUpperCase() != "TRR") {
                //   return res.send({"status":false,"message":"Signup Promo code is not valid."});
                // }
                //signup refferal code minimum length 4 characters
                if (req.body.signupReferralCode && req.body.signupReferralCode.length < 4) {
                  return res.send({"status":false,"message":"Referral Code shuold be minimum 4 characters."});
                }
                //signup refferal code maximum length 6 characters
                if (req.body.signupReferralCode && req.body.signupReferralCode.length > 6) {
                  return res.send({"status":false,"message":"Referral Code shuold be maximum 6 characters."});
                }
                //signup refferal code check in database
                if (req.body.signupReferralCode) {
                  refferalPlayer = await Sys.App.Services.PlayerServices.getPlayerData({ myReferralCode: req.body.signupReferralCode });
                  if (refferalPlayer && refferalPlayer.length == 0) {
                    return res.send({"status":false,"message":"Referral Code not found."});  
                  }
                }
                // Create Player Object
                let cashNewPlayer = Sys.Config.Rummy.defaultCash;
                // if (req.body.signUpPromo && req.body.signUpPromo.toUpperCase() == 'TRR') {
                //   cashNewPlayer = 50;
                // }
                let playerObj = {
                    deviceId            : (req.body.deviceId) ? req.body.deviceId : "abcd",
                    username            : req.body.username,
                    email               : req.body.email,
                    emailverified       : false,
                    password            : bcrypt.hashSync(req.body.password, 10),
                    //ip                  : req.body.ip,
                    isFbLogin           : false,
                    profilePic          : 'default.png',
                    chips               : Sys.Config.Rummy.defualtPrcticesChips,
                    cash                : cashNewPlayer,
                    cashTransaction     : '0',  //this field manage the total transaction of cash in game
                    rewardPoint         : 0,  //this will store the reward points based on his play history
                    status              : 'active',
                    //socketId          : socket.id,
                    mobile              : req.body.mobile,
                    state               : req.body.state,
                    birthyear           : req.body.birthyear,
                    //signUpPromo         : req.body.signUpPromo,
                    myReferralCode      : myReferralCode,
                    instance_bonus      : '0',
                    //signupReferralCode  : req.body.signupReferralCode,
                    otp                 : otp
                }
                if (req.body.signUpPromo) {
                  playerObj.signUpPromo = req.body.signUpPromo;
                }
                if (req.body.signupReferralCode) {
                  playerObj.signupReferralCode = req.body.signupReferralCode;
                }
                player = await Sys.App.Services.PlayerServices.insertPlayerData(playerObj);

                let playerCashObj = {
                    playerId            : player._id,
                    totalCash           : cashNewPlayer,
                    wonCash             : 0,
                    depositedCash       : cashNewPlayer,
                    lockCash            : 0,
                    withdrawLimit       : cashNewPlayer,
                    rewardPoint         : 0,
                    requiredRewardPoint : 0,
                    releasedCash        : 0
                }

                await Sys.App.Services.TransactionServices.createCashManage(playerCashObj);
                 // Transaction entry for this the cash amount as player used the promoCode
                // if (req.body.signUpPromo && req.body.signUpPromo.toUpperCase() == 'TRR') {
                 
                //   let trnsObj = {
                //     playerId          : player._id,
                //     chips             : 0,
                //     cash              : parseFloat(cashNewPlayer),
                //     type              : 'credit',   //debit/credit
                //     gameType          : "none",
                //     tableType         : "none",
                //     tranType           : 'cash',
                //     message           : 'Registration Promo Code ',
                //     tableNumber       : 'none',
                //     transactionNumber : '',
                //     afterBalance      : parseFloat(cashNewPlayer),
                //     status            : 'sucess',
                //   }
                //   let chipsTransection = await Sys.App.Services.TransactionServices.cerateChipsCashHistory(trnsObj);

                // }
                //mobile varification otp send sms
                let from='TEXTID';

                let sms_text='Your OTP Generate successfully and OTP is '+otp+' Mobile Varified Link '+'http://'+req.headers.host+'/mobileVarify/'+player._id;

                var request = require("request");

                var options = { method: 'GET',
                url: 'http://sms.textidea.com/app/smsapi/index.php',
                qs:
                  { key: '45D1481F1B98AF',
                    campaign: '4789',
                    routeid: '100233',
                    type: 'text',
                    contacts: player.mobile,
                    senderid: from,
                    msg: sms_text },
                };
                request(options, function (error, response, body) {
                  if (error) throw new Error(error);

                  //console.log(body);
                });
                var mailOptions = {
                        to: player.email,
                        from: 'The RummyRounds',
                        subject: 'Activate Your The RummyRounds ',
                        text: 'Hello' +player.username +'.  Welcome to The RummyRounds.\n\n You are receiving this because your Account Created by Admin.\n\n' +
                          'And This is your account details to access your account.\n\n Your Email:  ' +player.email+
                          '\n\n Your Password is: ' + req.body.password + '\n\n.'
                };
                defaultTransport.sendMail(mailOptions, function(err) {
                        if (!err) {
                          // req.flash('success', 'An e-mail has been sent to ' + data.email + ' with further instructions.');
                          defaultTransport.close();
                          // return res.redirect('/forgot-password');
                        } else {
                          //console.log("Error sending mail,please try again After some time", err);
                          // req.flash('error', 'Error sending mail,please try again After some time.');
                          // return res.redirect('/forgot-password');
                        }

                });
                // return res.render('player/add',player);
                var token = jwt.sign({ id: player._id }, jwtcofig.secret, {
                  expiresIn: 60*60*24 // expires in 24 hours
                });
                var data = {
                    id : player._id,
                    username : player.username,
                    jwt_token : token,
                    // avatar : 'default.png'
                };
               return res.send({"status":true,"message":"Player create successfully","data":data});
        } catch (e) {
            Sys.Log.info('Error in create Player : ' + e);
        }
    },
  addNewFBPlayerData: async function(req,res){
    try {
       let myReferralCode = Math.floor(100000 + Math.random() * 900000);
      otp = Math.floor(1000 + Math.random() * 9000);
       let playerFbObj = {
                    $or:[
                         {username: req.body.username},
                         {email: req.body.username}
                    ]}; 
       //res.send(req.files.image.name);
      let player = await Sys.App.Services.PlayerServices.getPlayerData(playerFbObj);
      if (player && player.length >0) {
        //req.flash('error', 'Player Already Present');
        //res.redirect('/player');
        return res.send({"status":false,"message":"Player Already Present"});

      }else {
        //console.log('insetdata');
       let player= await Sys.App.Services.PlayerServices.insertPlayerData(
        {
          username  : req.body.username,
          firstname : (req.body.firstname) ? req.body.firstname : '',
          lastname  : (req.body.lastname) ? req.body.lastname : '',
          mobile    : (req.body.mobile) ? req.body.mobile : '',
          isFbLogin : true,
          profilePic: (req.body.profilePic) ? req.body.profilePic : 'default.png',
          email     : (req.body.email) ? req.body.email : '',
          gender    : (req.body.gender) ? req.body.gender : '',
          isBot     : (req.body.bot) ? req.body.bot : '',
          //password  : bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(8), null),
          device_id : 'abcd',
          myReferralCode      : myReferralCode,
          instance_bonus      : '0',
          chips : 1000,
          diamonds : 100
            // image: req.files.image.name
          }
          )

          let cashNewPlayer = Sys.Config.Rummy.defaultCash;

          let playerObj = {
              deviceId            : 'abcd',
              username            : req.body.username,
              firstname           : (req.body.firstname) ? req.body.firstname : '',
              lastname            : (req.body.lastname) ? req.body.lastname : '',
              email               : (req.body.email) ? req.body.email : '',
              emailverified       : false,
             // password            : bcrypt.hashSync(req.body.password, 10),
         //     ip                  : data.ip,
              isFbLogin           : true,
              profilePic          : (req.body.profilePic) ? req.body.profilePic : 'default.png',
              chips               : Sys.Config.Rummy.defualtPrcticesChips,
              cash                : cashNewPlayer,
              cashTransaction     : '0',  //this field manage the total transaction of cash in game
              rewardPoint         : 0,  //this will store the reward points based on his play history
              status              : 'active',
            //  socketId            : socket.id,
              mobile              : (req.body.mobile) ? req.body.mobile : '',
              myReferralCode      : myReferralCode,
              instance_bonus      : '0',
              otp                 : otp
          }
          if (req.body.signUpPromo) {
            playerObj.signUpPromo = req.body.signUpPromo;
          }
          if (req.body.signupReferralCode) {
            playerObj.signupReferralCode = req.body.signupReferralCode;
          }
          player = await await Sys.App.Services.PlayerServices.insertPlayerData(playerObj);

         // //console.log('player---------',player);

         if (player.mobile) {
           //mobile varification otp send sms
              let from='TEXTID';

              let sms_text='Your OTP Generate successfully and OTP is '+otp+' Mobile Varified Link '+'http://'+req.headers.host+'/mobileVarify/'+player._id;

              var request = require("request");

              var options = { method: 'GET',
              url: 'http://sms.textidea.com/app/smsapi/index.php',
              qs:
                { key: '45D1481F1B98AF',
                  campaign: '4789',
                  routeid: '100233',
                  type: 'text',
                  contacts: player.mobile,
                  senderid: from,
                  msg: sms_text },
              };

              request(options, function (error, response, body) {
              if (error) throw new Error(error);

              //console.log(body);
            });
         }
          if (player.email) {
            var mailOptions = {
                        to: player.email,
                        from: 'The RummyRounds',
                        subject: 'Activate Your The RummyRounds ',
                        text: 'Hello' +player.username +'.  Welcome to The RummyRounds.\n\n You are receiving this because your Account Created by Admin.\n\n' +
                          'And This is your account details to access your account.\n\n Your Email:  ' +player.email+'\n\n.'
                };
                defaultTransport.sendMail(mailOptions, function(err) {
                        if (!err) {
                          // req.flash('success', 'An e-mail has been sent to ' + data.email + ' with further instructions.');
                          defaultTransport.close();
                          // return res.redirect('/forgot-password');
                        } else {
                          //console.log("Error sending mail,please try again After some time", err);
                          // req.flash('error', 'Error sending mail,please try again After some time.');
                          // return res.redirect('/forgot-password');
                        }

                });
          }
         // return res.render('player/add',player);
         var token = jwt.sign({ id: player._id }, jwtcofig.secret, {
                          expiresIn: 60*60*24 // expires in 24 hours
                        });
         var data = {
                  id : player._id,
                  username : player.username,
                  jwt_token : token,
                  // avatar : 'default.png'
              };
         //req.flash('success','Player create successfully');
         //res.redirect('/player');
         return res.send({"status":true,"message":"Player create successfully","data":data})
      }
      // req.flash('sucess', 'Player Registered successfully');
        // res.redirect('/');
    }
    catch (e) {
      //console.log("Error",e);
    }
  },
  playerLogin: async function(req,res){
        try {

          // res.send(req.body); return;
            //console.log("req.body.email->",req.body.email);
            let player = null;
              var n = req.body.email.includes("@");
              if (n) {
                player = await Sys.App.Services.PlayerServices.getPlayerData({"email": req.body.email});    
              }else {
                player = await Sys.App.Services.PlayerServices.getPlayerData({"username": req.body.email});
              }
            //player = await Sys.App.Services.PlayerServices.getPlayerData({"email": req.body.email});
            // res.send(player); return;
            //
            //console.log(player);
            if (player == null || player.length == 0) {
              return res.send({"status":false,"message":"Player Not Found"});
            }
            // if (!player.clubStatus) {
            //   var x = 6; //or whatever offset
            //   var CurrentDate = new Date();
            //   CurrentDate.setMonth(CurrentDate.getMonth() + x);
            //   await Sys.App.Services.PlayerServices.updatePlayerData({_id: player[0]._id},{"clubStatus": "Jack","clubStatusValidTill": CurrentDate});
            // }
            var passwordTrue;
            if(bcrypt.compareSync(req.body.password, player[0].password)) {
              passwordTrue = true;
            } else {
              // Passwords don't match
              passwordTrue = false;
            }
            if (passwordTrue == true) {
              //console.log("Players->",Sys.App.Services.PlayerServices);
              // set jwt token
              var token = jwt.sign({ id: player[0].id }, jwtcofig.secret, {
                          expiresIn: 60*60*24 // expires in 24 hours
                        });

              ////console.log("Token",token);
              // User Authenticate Success
              req.session.login = true;
              req.session.details = {
                  id : player[0].id,
                  username : player[0].username,
                  jwt_token : token,
                  // avatar : 'default.png'
              };
              var data = {
                  id : player[0].id,
                  username : player[0].username,
                  jwt_token : token,
                  // avatar : 'default.png'
              };
              return res.send({"status":true,"message":"Welcome To Admin Panel","data":data});
            }else {
              return res.send({"status":false,"message":"Invalid Credentials"});
            }
        } catch (e) {
            //console.log("Error",e);
        }
    },
  playerLoginWithFB: async function(req,res){
      try {
            player = await Sys.App.Services.PlayerServices.getPlayerData({"username": req.body.username});
            //console.log(player);
            if (player == null || player.length == 0) {
              return res.send({"status":false,"message":"Player Not Found"});
            }
          
            // set jwt token
            var token = jwt.sign({ id: player[0].id }, jwtcofig.secret, {
                        expiresIn: 60*60*24 // expires in 24 hours
                      });

            ////console.log("Token",token);
            // User Authenticate Success
            req.session.login = true;
            req.session.details = {
                id : player[0].id,
                username : player[0].username,
                jwt_token : token,
                // avatar : 'default.png'
            };
            var data = {
                id : player[0].id,
                username : player[0].username,
                jwt_token : token,
                // avatar : 'default.png'
            };
            return res.send({"status":true,"message":"Welcome To The Rummy Round","data":data});
          
        } catch (e) {
            //console.log("Error",e);
        }
  },
  editPlayer: async function(req,res){
    try {
      let player = await Sys.App.Services.PlayerServices.getSinglePlayerData({_id: req.params.id});
      var data = {
         App : Sys.Config.App.details,
         error: req.flash("error"),
         success: req.flash("success"),
         playerActive : 'active',
         player: player,
       };
      return res.render('player/add',data);
    // res.send(player);
  	} catch (e) {
      //console.log("Error",e);
    }
  },

  editPlayerPostData: async function(req,res){
    try {
      let player = await Sys.App.Services.PlayerServices.getPlayerData({_id: req.params.id});
      if (player && player.length >0) {

        if (req.files) {
          let image = req.files.image;

              // Use the mv() method to place the file somewhere on your server
              image.mv('/profile/'+req.files.image.name, function(err) {
                if (err){
                  req.flash('error', 'User Already Present');
                  return res.redirect('/');
                }

                // res.send('File uploaded!');
              });
            }
            await Sys.App.Services.PlayerServices.updatePlayerData(
            {
              _id: req.params.id
                // image: req.files.image.name
              },{
                username: req.body.username,
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                mobile: req.body.mobile,
                // email: req.body.email,
                gender: req.body.gender,
                isBot: req.body.bot,
                // status: req.body.bot,
                // password : bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(8), null),
                // password : bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(8), null)
                // image: req.files.image.name
              }
              )
            req.flash('success','Player update successfully');
            res.redirect('/player');

          }else {
            req.flash('error', 'No User found');
            res.redirect('/player');
            return;
          }
        // req.flash('sucess', 'Player Registered successfully');
        // res.redirect('/');
      } catch (e) {
        //console.log("Error",e);
      }
    },


    getPlayerDelete: async function(req,res){
      try {
        let player = await Sys.App.Services.PlayerServices.getPlayerData({_id: req.body.id});
        if (player || player.length >0) {
          await Sys.App.Services.PlayerServices.deletePlayer(req.body.id)
          return res.send("success");
        }else {
          return res.send("error");
        }
      } catch (e) {
        //console.log("Error",e);
      }
    },

    active: async function(req,res){

      try{

        let player = await Sys.App.Services.PlayerServices.getSinglePlayerData({_id: req.body.id});
        if (player || player.length >0) {
          if(player.status == 'active'){
            await Sys.App.Services.PlayerServices.updatePlayerData(
            {
              _id: req.body.id
            },{
              status:'inactive'
            }
            )
          }else{
            await Sys.App.Services.PlayerServices.updatePlayerData(
            {
              _id: req.body.id
            },{
              status:'active'
            }
            )
          }
          req.flash('success','Status updated successfully');
          return res.send("success");
        }else {
          return res.send("error");
          req.flash('error', 'Problem while updating Status.');
        }

      } catch (e){
        //console.log("Error",e);
      }
    },

    inActive: async function(req,res){

      try{

        let player = await Sys.App.Services.PlayerServices.getPlayerData({_id: req.body.id});
        if (player || player.length >0) {

         await Sys.App.Services.PlayerServices.updatePlayerData(
         {
          _id: req.params.id
        },{
          status:'inactive'
        }
        )
         return res.send("success");
       }else {
        return res.send("error");
      }

    } catch (e){
      //console.log("Error",e);
    }
  },
  updatePlayerProfile: async function(req,res){
    try {
      let player = await Sys.App.Services.PlayerServices.getPlayerData({_id: req.params.id});
      if (player && player.length >0) {

            await Sys.App.Services.PlayerServices.updatePlayerData(
            {
              _id: req.params.id
              },{
                username: req.body.username,
                mobile: req.body.mobile,
                email: req.body.email,
                firstname: req.body.firstname,
                lastname:req.body.lastname,
                state: req.body.state,
                gender: req.body.gender,
                birthyear:req.body.birthyear
              }
              )
            return res.send({"status":true,"message":"Player update successfully"});
          }else {
            return res.send({"status":false,"message":"Player not found"});
          }
      } catch (e) {
        return res.send({"status":false,"message":e});
        //console.log("Error",e);
      }
    },
    playerChangePassword: async function(req,res){
      try{
          // let user = await Sys.App.Services.OtherAllService.getOnePlayer({ _id : req.body.userId });
          let player = await Sys.App.Services.OtherAllService.getOnePlayer({_id: req.body.userId});

          if(player){
            if (bcrypt.compareSync(req.body.password, player.password)) {

              await Sys.App.Services.PlayerServices.updatePlayerData(
                  {
                    _id: req.body.userId
                  },{
                    password : bcrypt.hashSync(req.body.newPassword, bcrypt.genSaltSync(8), null)
                  }
                )
                return res.send({"status":true,"message":"Change password successfully"});
            }
          }else{
              return res.send({"status":false,"message":"Player not found"});
          }
      }catch (error){
          //console.log("Error",error);
          return res.send({"status":false,"message":error});
      }
  },
  getPlayerProfileDetails: async function(req,res){
      try{
          // let user = await Sys.App.Services.OtherAllService.getOnePlayer({ _id : req.body.userId });
          let player = await Sys.App.Services.PlayerServices.getSinglePlayerData({_id: req.params.id});
          //console.log(player);
          if(player){
            return res.send({"status":true,"data":player});
          }else{
              return res.send({"status":false,"message":"Player not found"});
          }
      }catch (error){
          //console.log("Error",error);
          return res.send({"status":false,"message":error});
      }
  },
  playerForgotPasswordSendMail: async function(req, res){
        try {
            // let player = await Sys.App.Services.OtherAllService.getOnePlayer({email: req.body.email});
            // if (player) {
            //      var token = jwt.sign({ id: req.body.email }, jwtcofig.secret, {
            //               expiresIn: 300 // expires in 24 hours
            //             });

            //   await Sys.App.Services.PlayerServices.updatePlayerData(
            //       {
            //         _id: player._id
            //       },{
            //         resetPasswordToken:token,
            //         resetPasswordExpires:Date.now() + 60*60*60*60*24,
            //       }
            //     );
            //   var mailOptions = {
            //           to: req.body.email,
            //           from: 'The Rummy Round',
            //           subject: 'The Rummy Round Password Reset',
            //           text:'Hii '+player.username+'\n\n' + 
            //             'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
            //             'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
            //             'http://' + req.headers.host + '/reset-password/' + token + '\n\n' +
            //             'If you did not request this, please ignore this email and your password will remain unchanged.\n'
            //   };
            //   defaultTransport.sendMail(mailOptions, function(err) {
            //           if (!err) {
            //             defaultTransport.close();
            //             return res.send({"status":true,"message":'An e-mail has been sent to ' + req.body.email + ' with further instructions.'});
            //           } else {
            //             //console.log(err);
            //             return res.send({"status":false,"message":"Error sending mail,please try again After some time."});                    
            //           }
            //   }); 
            // }else{
            //     return res.send({"status":false,"message":"No Such User Found,Please Enter Valid Registered Email."});
            // }
            var hostname = Sys.Config.App.site_config.url;
        // var hostname = Sys.Config.Database[Sys.Config.Database.connectionType].mongo.host+":"+Sys.Config.Socket.port;
        // //console.log(hostname);
        // return false;
        // //console.log(hostname);
        // response.send(hostname);
        // return false;
        let player = await Sys.App.Services.OtherAllService.getOnePlayer({email: req.body.email});
          if (player) {
            var mailOptions = {
              to: req.body.email,
              from: 'The Rummy Round',
              subject: 'The Rummy Round Password Reset',
              text:'Hi '+player.username+',\n\n' + 
                'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                 'https://therummyround.com/forgot-password/' + player.id + '\n\n' +
                'If you did not request this, please ignore this email and your password will remain unchanged.\n\n\n'+
                'Thanks:\n'+
                'Team The Rummy Round'
            };
            defaultTransport.sendMail(mailOptions, function(err) {
              // if (err) {
              //   //console.log("Error sending Mail" ,err);
              //   return {
              //     status: 'fail',
              //     // result: null,
              //     message: 'Error Sending Mail',
              //     statusCode: 401
              //   }
              // }
              // else {
              //   //console.log("Password Reset Link send to ", data.email);
              //   return {
              //     status: 'success',
              //     // result: null,
              //     message: 'Password Reset Link send to the Email, Please check mail for changing password',
              //   }
              // }
            });
            // return {
            //   status: 'success',
            //   // result: null,
            //   message: 'Password Reset Link send to the Email, Please check mail for changing password',
            // }
            return res.send({"status":true,"message":"Password Reset Link send to the Email, Please check mail for changing password"});

          }else {
            //console.log('-------------------');
            return res.send({"status":false,"message":"No Such User Found,Please Enter Valid Registered Email."});
          }
        } catch (e) {
            //console.log("Error",e);
            return res.send({"status":false,"message":e});
        }
    },

    getPlayerDelete: async function(req,res){
      try {
        let player = await Sys.App.Services.PlayerServices.getPlayerData({_id: req.body.id});
        if (player || player.length >0) {
          await Sys.App.Services.PlayerServices.deletePlayer(req.body.id)
          return res.send("success");
        }else {
          return res.send("error");
        }
      } catch (e) {
        //console.log("Error",e);
      }
    },

    active: async function(req,res){

      try{

        let player = await Sys.App.Services.PlayerServices.getSinglePlayerData({_id: req.body.id});
        if (player || player.length >0) {
          if(player.status == 'active'){
            await Sys.App.Services.PlayerServices.updatePlayerData(
            {
              _id: req.body.id
            },{
              status:'inactive'
            }
            )
          }else{
            await Sys.App.Services.PlayerServices.updatePlayerData(
            {
              _id: req.body.id
            },{
              status:'active'
            }
            )
          }
          req.flash('success','Status updated successfully');
          return res.send("success");
        }else {
          return res.send("error");
          req.flash('error', 'Problem while updating Status.');
        }

      } catch (e){
        //console.log("Error",e);
      }
    },

    inActive: async function(req,res){

      try{

        let player = await Sys.App.Services.PlayerServices.getPlayerData({_id: req.body.id});
        if (player || player.length >0) {

         await Sys.App.Services.PlayerServices.updatePlayerData(
         {
          _id: req.params.id
        },{
          status:'inactive'
        }
        )
         return res.send("success");
       }else {
        return res.send("error");
      }

    } catch (e){
      //console.log("Error",e);
    }
  },
  chipsAdd: async function(req , res){
    try{

      var data = {
        App : Sys.Config.App.details,
        error: req.flash("error"),
        success: req.flash("success"),
         playerActive : 'active',
      };
      let operation = req.body.chipsValue;
      let chipsUpdate = req.body.chips;
      let player = await Sys.App.Services.PlayerServices.getSinglePlayerData({_id: req.body.playerId});
      if (player || player.length >0) {

        if(operation == 'Add') {
          newChips = parseInt(parseInt(player.chips) + parseInt(req.body.chips));
        }else if(operation == 'Deduct') {
          newChips = parseInt(parseInt(player.chips) - parseInt(req.body.chips));
        }

				await Sys.App.Services.PlayerServices.updatePlayerData(
        {
          _id: req.body.playerId
        },{
          chips:newChips
        }
        );

				// Add cash functionality
				// if(operation == 'Add') {
        //   // newChips = parseInt(parseInt(player.chips) + parseInt(req.body.chips));
				// 	let cashManager = await Sys.App.Services.TransactionServices.getPlayerCashData({ playerId : req.body.playerId });
        //
				// 	let updatedCash = cashManager.totalCash + parseInt(req.body.cash);
        //
				// 	// let cashManageData = {
		    //   //   totalCash               : updatedCash ,
		    //   //   lockCash                : cashManager.lockCash + parseFloat(req.body.cash) ,
		    //   // }
		    //   // update Cash Manager
		    //   // await Sys.App.Services.TransactionServices.updateCashManager({ playerId : req.body.playerId }, cashManageData );
        //
				// 	// await Sys.App.Services.PlayerServices.updatePlayerData(
	      //   // {
	      //   //   _id: req.body.playerId
	      //   // },{
	      //   //   cash: updatedCash
	      //   // }
	      //   // );
        //
        // }



        req.flash("success",'Chips updated successfully');
        res.redirect('/player');

      }else{
        return res.flash("error");
      }
  	} catch (e){
      //console.log("Error",e);
      req.flash('error', 'Problem while updating Chips.');
    }
  },
  //On click refresh button to add 1000 chips every time
  chipsAdd_1000: async function(req , res){
    try{
      let player = await Sys.App.Services.PlayerServices.getSinglePlayerData({_id: req.body.playerId});
      if (player || player.length >0) {
        let player_chips = (player.chips) ? player.chips : 0;
        let newChips = parseInt(parseInt(player_chips) + 1000);
        await Sys.App.Services.PlayerServices.updatePlayerData({_id: req.body.playerId},{chips:newChips});
        //return {status: 'success',message: 'Chips updated successfully'}
        return res.send({"status":"success","message":"Chips updated successfully"});
      }else{
        return {"status": "fail","message": 'Player not found'}
      }
    } catch (e){
      //console.log("Error",e);
     // req.flash('error', 'Problem while updating Chips.');
    }
  },
  //for mobile 
  chipsNewAdd_1000: async function(req , res){
    try{
      let player = await Sys.App.Services.PlayerServices.getSinglePlayerData({_id: req.body.playerId});
      if (player || player.length >0) {

        let newChips = parseInt(parseInt(player.chips) + 1000);
        await Sys.App.Services.PlayerServices.updatePlayerData({_id: req.body.playerId},{chips:newChips});
        return {status: 'success',message: 'Chips updated successfully'}
        //return res.send({"status":"success","message":"Chips updated successfully"});
      }else{
        return {status: 'fail',message: 'Player not found'}
      }
    } catch (e){
      //console.log("Error",e);
     // req.flash('error', 'Problem while updating Chips.');
    }
  },
  cashAdd: async function(req , res){
    try {
      // //console.log('req.body', req.body);
      // return res.send(req.body);

      let player = await Sys.App.Services.PlayerServices.getSinglePlayerData({_id: req.body.playerId});
      if (!player || player.length == 0) {
          return res.flash("error",  'Problem while updating Chips.');
      }
      let cashManager = await Sys.App.Services.TransactionServices.getPlayerCashData({ playerId : req.body.playerId });
      // //console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
      // //console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
      // //console.log("transaction._id", paymentLinkData.order_id);
      let requiredRewardPoint = 0;
      if (req.body.lockCash != 0) {
        requiredRewardPoint = parseFloat(req.body.cash/10);
      }
      let requiredRewardPointReached = true;
      if (parseFloat(requiredRewardPoint) != 0) {
        requiredRewardPointReached = false;
      }

      let depositData = {
         playerId                       : req.body.playerId,
         transactionId                  : 'By Admin',
         depositCash                    : req.body.cash,
         lockCash                       : req.body.lockCash,
         requiredRewardPoint            : parseFloat(cashManager.requiredRewardPoint) + parseFloat(requiredRewardPoint),
         status                         : 'Success',
         requiredRewardPointReached     : requiredRewardPointReached,
       };
      let cashDepositManage = await Sys.App.Services.TransactionServices.createCashDepositManage(depositData);




      // let cashManager = await Sys.App.Services.TransactionServices.getPlayerCashData({ playerId : req.body.playerId });
      let updatedCash = parseFloat(cashManager.totalCash) + parseFloat(req.body.cash) ;
      let newWithdrawLimit = parseFloat(cashManager.withdrawLimit);
      // if (req.body.lockCash == 0) {
        newWithdrawLimit = newWithdrawLimit + parseFloat(req.body.cash);
      // }
      let requiredRewardPointCash = 0;
      if (req.body.lockCash != 0) {
        requiredRewardPointCash = parseFloat(req.body.cash/10);
      }
      let cashManageData = {
        totalCash               : updatedCash ,
        depositedCash           : parseFloat(cashManager.depositedCash) + parseFloat(req.body.cash) ,
        lockCash                : cashManager.lockCash + parseFloat(req.body.lockCash) ,
        withdrawLimit           : newWithdrawLimit  ,
        requiredRewardPoint     : requiredRewardPointCash  ,
        // requiredRewardPoint     : parseFloat(cashManager.requiredRewardPoint) + parseFloat(depositData.requiredRewardPoint)  ,
      }
      // update Cash Manager
      await Sys.App.Services.TransactionServices.updateCashManager({ playerId : req.body.playerId }, cashManageData );

      await Sys.App.Services.PlayerServices.updatePlayerData(
        {
          _id: req.body.playerId
        },{
          cash: updatedCash.toString(),
          // cash: (parseInt(transactionPlayer.cash)+transactionDone.amount).toString(),
        }
      )

      // MaintainChips History
      let chipsHistory = await Sys.App.Services.ChipsHistoryServices.insertChipsData({
        user_id             : req.body.playerId,
        username            : player.username,
        chips               : parseFloat(req.body.cash) + parseFloat(req.body.lockCash),
        type                : "Credit",
        reason              : "Admin side Deposit",
        isValid             : "Yes",
        transactionNumber   : req.body.txnid,
        previousBalance     : parseInt(player.cash),
        afterBalance        : parseInt(player.cash) + parseInt(req.body.cash),
      });


      await Sys.App.Services.playerChipsCashHistoryService.insertChipsData({
              playerId          : req.body.playerId,
              chips             : 0,
              cash              : parseFloat(req.body.cash) + parseFloat(req.body.lockCash),
              type              : 'credit',
              tranType 			    : 'cash',
              gameType 			    : "None",
              tableType			    : "None",
              message           : 'Cash Added By Admin',
              tableNumber       : "None",
              transactionNumber : '',
              afterBalance      : parseFloat(player.cash)+ parseFloat(req.body.cash),
              status            : 'sucess',
            });


      req.flash("success",'Chips updated successfully');
      return res.redirect('/player');





    } catch (e) {
      //console.log("Error",e);
      req.flash('error', 'Problem while updating Cash.');
    }
  },

  chipsHistory: async function(req , res){
    try{
      var data = {
        App : Sys.Config.App.details,
        error: req.flash("error"),
        success: req.flash("success"),
        playerId:req.params.id,
         playerActive : 'active',
      };
      return res.render('player/chipsHistory',data);
    } catch (e) {
      //console.log("Error",e);
    }

  },

  getChipsHistory: async function (req, res){
    try {
      let start = parseInt(req.query.start);
      let length = parseInt(req.query.length);
      let search = req.query.search.value;

      let query = {};
      if (search != '') {
        let capital = search;
        query = { userName: { $regex: '.*' + search + '.*' } , playerId : req.params.id, tranType:'chips'};
      } else {
        query = { playerId : req.params.id , tranType:'chips'};
      }
      let columns = [
      'id',
      'username',
      'firstname',
      'lastname',
      'email',
      'chips',
      'status',
      'isBot',
      ]

      let chipsC = await Sys.App.Services.playerChipsCashHistoryService.getChipsData(query);
      let chipsCount = chipsC.length;
      let data = await Sys.App.Services.playerChipsCashHistoryService.getChipsDatatable(query, length, start);
      var obj = {
        'draw': req.query.draw,
        'recordsTotal': chipsCount,
        'recordsFiltered': chipsCount,
        'data': data
      };

      res.send(obj);
    } catch (e) {
      //console.log("Error",e);
    }
  },
  playerChipsHistory: async function (req, res){
    try {
      let query = { playerId : req.params.id , tranType:'chips'};
      

      let data = await Sys.App.Services.playerChipsCashHistoryService.getChipsData(query);
      let chipsCount = data.length;
      var obj = {
        'recordsTotal': chipsCount,
        'data': data
      };

      res.send(obj);
    } catch (e) {
      //console.log("Error",e);
    }
  },
  cashHistory: async function(req , res){
    try{
      var data = {
        App : Sys.Config.App.details,
        error: req.flash("error"),
        success: req.flash("success"),
        playerId:req.params.id,
        playerActive : 'active',
      };
      return res.render('player/cashHistory',data);
    } catch (e) {
      //console.log("Error",e);
    }

  },

  getCashHistory: async function (req, res){
    try {
      let start = parseInt(req.query.start);
      let length = parseInt(req.query.length);
      let search = req.query.search.value;

      let query = {};
      if (search != '') {
        let capital = search;
        query = { userName: { $regex: '.*' + search + '.*' } , playerId : req.params.id, tranType:'cash'};
      } else {
        query = { playerId : req.params.id, tranType:'cash' };
      }
      let columns = [
      'id',
      'username',
      'firstname',
      'lastname',
      'email',
      'chips',
      'status',
      'isBot',
      ]

      let chipsC = await Sys.App.Services.playerChipsCashHistoryService.getChipsData(query);
      let chipsCount = chipsC.length;
      let data = await Sys.App.Services.playerChipsCashHistoryService.getChipsDatatable(query, length, start);

      var obj = {
        'draw': req.query.draw,
        'recordsTotal': chipsCount,
        'recordsFiltered': chipsCount,
        'data': data
      };
      res.send(obj);
    } catch (e) {
      //console.log("Error",e);
    }
  },
  playerCashHistory: async function (req, res){
    try {
      let query = { playerId : req.params.id, tranType:'cash' };;
      
      let data = await Sys.App.Services.playerChipsCashHistoryService.getChipsData(query);
      let chipsCount = data.length;
      data.forEach(async val => {
        
        val.afterBalance = parseFloat(val.afterBalance).toFixed(2);
      });
      
      var obj = {
        'recordsTotal': chipsCount,
        'data': data
      };
      res.send(obj);
    } catch (e) {
      //console.log("Error",e);
    }
  },
  loginHistory: async function(req , res){
    try{
      var data = {
        App : Sys.Config.App.details,
        error: req.flash("error"),
        success: req.flash("success"),
        playerId:req.params.id,
        playerActive : 'active',
      };
      return res.render('player/loginHistory',data);
    } catch (e) {
      //console.log("Error",e);
    }

  },

  getLoginHistory: async function (req, res){
    try {
      let start = parseInt(req.query.start);
      let length = parseInt(req.query.length);
      let search = req.query.search.value;

      let query = {};
      if (search != '') {
        let capital = search;
        query = { email: { $regex: '.*' + search + '.*' } , player : req.params.id};
      } else {
        query = { player : req.params.id };
      }
      let columns = [
      'id',
      'username',
      'firstname',
      'lastname',
      'email',
      'chips',
      'status',
      'isBot',
      ]

      let loginC = await Sys.App.Services.ChipsHistoryServices.getLoginHistoryData(query);
      let loginCount = loginC.length;
      let data = await Sys.App.Services.ChipsHistoryServices.getLoginDatatable(query, length, start);
      var obj = {
        'draw': req.query.draw,
        'recordsTotal': loginCount,
        'recordsFiltered': loginCount,
        'data': data
      };
      res.send(obj);
    } catch (e) {
      //console.log("Error",e);
    }
  },
  playerLoginHistory: async function (req, res){
    try {

      let query = { player : req.params.id };
      
      let data = await Sys.App.Services.ChipsHistoryServices.getLoginHistoryData(query);
      let loginCount = data.length;
      var obj = {
        'recordsTotal': loginCount,
        'data': data
      };
      res.send(obj);
    } catch (e) {
      //console.log("Error",e);
    }
  },
	forgetPassword: async function (req, res){
		try {
			var data = {
        App : Sys.Config.App.details,
        error: req.flash("error"),
        success: req.flash("success"),
        playerId:req.params.id,
        // playerActive : 'active',
      };
      return res.render('player/forgot-password',data);
		} catch (error) {
			//console.log("Error in Forget Password Page ", error);
		}
	},

	postForgetPassword: async function(req, res){
		let players = await Sys.App.Services.PlayerServices.getPlayerData({ _id: req.params.id });
		//console.log(req.body.password);
		//console.log(bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(8), null));
		// return res.send(players.length);

		if (!players || players.length == 0 ) {
			req.flash('error', 'Player Not Present');
			res.redirect('/forget-password/'+req.params.id);
		}else {
			await Sys.App.Services.PlayerServices.updatePlayerData(
					{
						_id: req.params.id
					},{
						password : bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(8), null)
					}
				)
				req.flash('success', 'Password Changed Successfully');
				res.redirect('/forget-password/'+req.params.id);
			// res.send(players)
		}



  },
  varifyMobile: async function(req, res){
    try{
      let players = await Sys.App.Services.PlayerServices.getByID({ _id:req.params.id });

      res.render('player/mobileVarify',{plr:players});
    }catch(error){
      //console.log('error',error);
    }

	},
  varifyMobilePost: async function(req, res){
    try{


   // //console.log(req.body);
		let players = await Sys.App.Services.PlayerServices.getByID({ _id: req.params.id });
     // //console.log(players);

			if (players.otp==req.body.otp) {
        if (players.mobilelverified == true) {
          //res.send("Your Mobile Number Is already been Verified Previously")
          res.render('player/mobileVarifyAlready');
        }else {
        await Sys.App.Services.PlayerServices.updatePlayerData(
          {
            _id: req.params.id
          },{
            mobilelverified : true
          }
        )
       // res.send("Your Mobile Number is been Verified Successfully");
       res.render('player/mobileVarifySuccess');
        }
        //console.log('mobile varified');

			}else {
        ////console.log('mobile is not varified');
        res.render('player/mobileVarifyFailed');
			//	res.send("Your OTP is incorrect");
      }

  }catch(error){
    //console.log('error',error);
  }
  },

	verifyEmail: async function(req, res){
		let players = await Sys.App.Services.PlayerServices.getPlayerData({ _id: req.params.id });
		if (!players || players.length == 0 ) {
			res.send("There is no such User Found")
		}else {
			//console.log("players.emailverified", players[0].emailverified);
			if (players[0].emailverified == true) {
				res.send("Your Email Is already been Verified Previously")
			}else {
				await Sys.App.Services.PlayerServices.updatePlayerData(
						{
							_id: req.params.id
						},{
							emailverified : true
						}
					)
				res.send("Your Email is been Verified Successfully");
			}

			// res.send(players)
		}
  },

  updatePlayerClubStatus: async function(req,res){
    try {
      let player = await Sys.App.Services.PlayerServices.getPlayerData({});
      if (player && player.length >0) {      
             player.forEach(async val => {
              if (val.rewardPoint) {
                var points = parseFloat(val.rewardPoint);
                var status = "";
                if (points >= 100 && points < 1000) {
                  status = "Queen";  
                }else if (points >= 1000 && points < 4000) {
                  status = "King";
                }else if (points >= 4000 && points < 10000) {
                  status = "Ace";
                }else if (points >= 10000) {
                  status = "Jocker";
                }else{
                  status = "Jack";
                }     
              }else{
                  status = "Jack";
              }
              await Sys.App.Services.PlayerServices.updatePlayerData({"_id":val._id},{"clubStatus": status,"clubStatusValidTill": val.createdAt});
            });
            return res.send({"status":true,"message":"Player Club Status updated successfully","data":player});
          }else {
            return res.send({"status":false,"message":"Player not found"});
          }
      } catch (e) {
        return res.send({"status":false,"message":e});
        //console.log("Error",e);
      }
    },
    updateClubStatusCronJob:async function(req,res){
      try {
       var currentDate = new Date();
       
       var getCurrentMonth = currentDate.getMonth();
       
       var beforesixmonthDate = new Date().setMonth(getCurrentMonth - 6);
       var newDate = new Date(beforesixmonthDate);       
      let player = await Sys.App.Services.PlayerServices.getPlayerData({});
      if (player && player.length >0) { 
            player.forEach(async val => {
              ////console.log("DATE : ",currentDate);
              ////console.log("CurrentMonth : ",getCurrentMonth);
              ////console.log("PLayer ID : ",val._id);
              ////console.log("beforesixmonthDate : ",newDate);
              ////console.log("*******************----++++++++");
              let transaction = await Sys.App.Services.TransactionServices.getByData({"playerId":val._id,"updatedAt": {$gte: newDate,$lte: currentDate},"status":"paid"});
              ////console.log("PLayer Transaction : ",transaction.length);
              if (transaction.length > 0) {
                if (val.rewardPoint) {
                var points = parseFloat(val.rewardPoint);
                var status = "";  
                  if (points >= 100 && points < 1000) {
                    status = "Queen";  
                  }else if (points >= 1000 && points < 4000) {
                    status = "King";
                  }else if (points >= 4000 && points < 10000) {
                    status = "Ace";
                  }else if (points >= 10000) {
                    status = "Jocker";
                  }else{
                    status = "Jack";
                  }
                }else{
                    status = "Jack";
                }
                await Sys.App.Services.PlayerServices.updatePlayerData({"_id":val._id},{"clubStatus": status,"clubStatusValidTill": new Date()});
              }else{
                var currentDate = new Date();
                var status_date = currentDate.setMonth(currentDate.getMonth() - 6);        
                
                //console.log(val.clubStatusValidTill+" == "+new Date(status_date));
                  //console.log(val.clubStatus);

                if (val.clubStatusValidTill < new Date(status_date)) {
                  var status = "Jack";  
                  if (val.clubStatus == "Queen") {
                    status = "Jack";
                  }
                  else if (val.clubStatus == "King") {
                   status = "Queen"; 
                  }
                  else if (val.clubStatus == "Ace") {
                   status = "King"; 
                  }
                  else if (val.clubStatus == "Jocker") {
                   status = "Ace"; 
                  }else{
                   status = "Jack"; 
                  }
                  await Sys.App.Services.PlayerServices.updatePlayerData({"_id":val._id},{"clubStatus": status,"clubStatusValidTill": new Date()});
                }                          
              }
            });
          }else {
          
          }
      } catch (e) {
        //return res.send({"status":false,"message":e});
        //console.log("Error",e);
      }
    },
    disconnection_settings: async function(req,res){
    try {
      let player = await Sys.App.Services.PlayerServices.getPlayerData({});
      if (player && player.length >0) {      
             player.forEach(async val => {
             //let myReferralCode = Math.random().toString(36).substring(7);
              //let myReferralCode = Math.floor(100000 + Math.random() * 900000);
              
              var disconnection_settings = {
                point_rummy: {Drop_me_on_3_missed_moves: true, Auto_Play_till_the_game_ends: false},
                pool_rummy : {Drop_me_on_3_missed_moves: true, Auto_Play_till_the_game_ends: false},
                deal_rummy : {Drop_me_on_3_missed_moves: true, Auto_Play_till_the_game_ends: false}
              };
              await Sys.App.Services.PlayerServices.updatePlayerData({"_id":val._id},{"disconnection_settings": disconnection_settings});
            });
            return res.send({"status":true,"message":"Player disconnection_settings updated successfully","data":player});
          }else {
            return res.send({"status":false,"message":"Player not found"});
          }
      } catch (e) {
        return res.send({"status":false,"message":e});
        //console.log("Error",e);
      }
    },
    getDisconnectionSettings: async function(req, res){
      try{
        let player = await Sys.App.Services.PlayerServices.getByID({ _id:req.params.id });
        if (player) {
          return res.send({"status":true,"data":{"disconnection_settings":player.disconnection_settings}});
        }else{
          return res.send({"status":false,"message":"Player not found"});
        }

      }catch(error){
        //console.log('error',error);
      }

    },
    updateDisconnectionSettings: async function(req,res){
      try {
          console.log("BODY : ",req.body.disconnection_settings);
          let player = await Sys.App.Services.PlayerServices.getByID({ _id:req.params.id });
          if (player) {      
             
              await Sys.App.Services.PlayerServices.updatePlayerData({"_id":player._id},{"disconnection_settings": req.body.disconnection_settings});
            return res.send({"status":true,"message":"Player disconnection_settings updated successfully"});
          }else {
            return res.send({"status":false,"message":"Player not found"});
          }
      } catch (e) {
        return res.send({"status":false,"message":e});
        //console.log("Error",e);
      }
    },
    forgotPasswordUpdate: async function(req, res){
      let players = await Sys.App.Services.PlayerServices.getPlayerData({ _id: req.body.playerId });
      //console.log(req.body.password);
      if (!players || players.length == 0 ) {
        return res.send({"status":false,"message":"Player not found"});
      }else {
        await Sys.App.Services.PlayerServices.updatePlayerData(
            {
              _id: req.body.playerId
            },{
              password : bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(8), null)
            }
          )
          return res.send({"status":true,"message":"Forgot password success.Please login with new password"});
      }
    },
	}
