var Sys = require('../../../Boot/Sys');
var bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
var defaultTransport = nodemailer.createTransport({
 service: 'Gmail',
 auth: {
   user: Sys.Config.App.mailer.auth.user,
   pass: Sys.Config.App.mailer.auth.pass
 }
});

module.exports = {

    playerRegister: async function(socket,data){
        try {
          //console.log("77777777777777777777777777777777777777777777777777777777");
          let myReferralCode = Math.floor(100000 + Math.random() * 900000);
            //console.log("data", data);                // Check Username & Email Already Avilable
                let player = await Sys.Game.Common.Services.PlayerServices.getOneByData({ username: data.username });

                if (player) { // When Player Found
                    return {
                    status: 'fail',
                    result: null,
                    message: 'Username already taken.',
                    statusCode: 401
                    }
                }

                // Check Username & Email Already Avilable
                player = await Sys.Game.Common.Services.PlayerServices.getOneByData({ email: data.email });
                if (player) { // When Player Found
                    return {
                    status: 'fail',
                    result: null,
                    message: 'Email already taken.',
                    statusCode: 401
                    }
                }

                // Check Mobile Already Avilable
                player = await Sys.Game.Common.Services.PlayerServices.getOneByData({ mobile: data.mobile });
                if (player) { // When Player Found
                    return {
                    status: 'fail',
                    result: null,
                    message: 'Mobile already taken.',
                    statusCode: 401
                    }
                }

                // Validation for Username
                 let validation = await Sys.App.Middlewares.Validator.registerUserPostValidateForGame({username: data.username});
                 if(validation.status == 'fail'){
                  return{
                    status:'fail',
                    result:null,
                    message:'Username is not valid. ',
                    statusCode: 401
                  }
                }

                //Signup Promo code check
                // if (data.signUpPromo && data.signUpPromo.toUpperCase() != "TRR") {
                //   return{
                //     status:'fail',
                //     result:null,
                //     message:'Signup Promo code is not valid. ',
                //     statusCode: 401
                //   }
                // }
                //signup refferal code minimum length 4 characters
                if (data.signupReferralCode && data.signupReferralCode.length < 4) {
                  return{
                    status:'fail',
                    result:null,
                    message:'Referral Code shuold be minimum 4 characters. ',
                    statusCode: 401
                  }
                }
                //signup refferal code maximum length 6 characters
                if (data.signupReferralCode && data.signupReferralCode.length > 6) {
                  return{
                    status:'fail',
                    result:null,
                    message:'Referral Code shuold be maximum 6 characters. ',
                    statusCode: 401
                  }
                }
                //signup refferal code check in database
                if (data.signupReferralCode) {
                  refferalPlayer = await Sys.Game.Common.Services.PlayerServices.getOneByData({ myReferralCode: data.signupReferralCode });
                  if (refferalPlayer && refferalPlayer.length == 0) {
                    return{
                      status:'fail',
                      result:null,
                      message:'Referral Code not found.',
                      statusCode: 401
                    }
                  }
                }
                // Create Player Object
                let cashNewPlayer = Sys.Config.Rummy.defaultCash;
                // if (data.signUpPromo && data.signUpPromo.toUpperCase() == 'TRR') {
                //   cashNewPlayer = 50;
                // }
                let playerObj = {
                    deviceId            : data.deviceId,
                    username            : data.username,
                    email               : data.email,
                    emailverified       : false,
                    password            : bcrypt.hashSync(data.password, 10),
                    ip                  : data.ip,
                    isFbLogin           : false,
                    profilePic          : 'default.png',
                    chips               : Sys.Config.Rummy.defualtPrcticesChips,
                    cash                : cashNewPlayer,
                    cashTransaction     : '0',  //this field manage the total transaction of cash in game
                    rewardPoint         : 0,  //this will store the reward points based on his play history
                    status              : 'active',
                    socketId            : socket.id,
                    instance_bonus      : '0',
                    myReferralCode      : myReferralCode,
                    mobile              : data.mobile
                }
                if (data.signUpPromo) {
                  playerObj.signUpPromo = data.signUpPromo;
                }
                if (data.signupReferralCode) {
                  playerObj.signupReferralCode = data.signupReferralCode;
                }
                player = await Sys.Game.Common.Services.PlayerServices.create(playerObj);

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

                await Sys.Game.Common.Services.PlayerServices.createCashManage(playerCashObj);
                // Transaction entry for this the cash amount as player used the promoCode
               //  if (data.signUpPromo && data.signUpPromo.toUpperCase() == 'TRR') {
                  
               //    let trnsObj = {
               //      playerId          : player._id,
               //      chips             : 0,
               //      cash              : parseFloat(cashNewPlayer),
               //      type              : 'credit',   //debit/credit
               //      gameType          : "none",
               //      tableType         : "none",
               //      tranType 			    : 'cash',
               //      message           : 'Registration Promo Code ',
               //      tableNumber       : 'none',
               //      transactionNumber : '',
               //      afterBalance      : parseFloat(cashNewPlayer),
               //      status            : 'sucess',
               //    }
            			// let chipsTransection = await Sys.Game.Common.Services.PlayerServices.cerateChipsCashHistory(trnsObj);

               //  }

                var hostname = socket.handshake.headers.host;

                var mailOptions = {
                        to: data.email,
                        from: 'The RummyRounds',
                        subject: 'Activate Your The RummyRounds ',
                        text: 'You are receiving this because you (or someone else) have Created your account.\n\n' +
                          'Please click on the following link, or paste this into your browser to verify Your Email:\n\n' +
                          'http://' + hostname + '/verify-mail/' + player._id + '\n\n' +
                          'If you did not request this, please ignore this email.\n'
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


                // let player = await Sys.Game.Common.Services.PlayerServices.getOneByData({ username: data.username });
                if (!player) {
                    return {
                        status: 'fail',
                        result: null,
                        message: 'Player Not Created',
                        statusCode: 400
                    }
                }

                // //console.log("###################################################");
                // //console.log("###################################################");
                // //console.log("player",player);
                // //console.log("###################################################");
                // //console.log("###################################################");
                // player.playerId = player._id;
                // //console.log('player_id', player._id);
                // //console.log('player.id', player.id);
                // //console.log('player', player);
                //console.log("###################################################");
                //console.log("###################################################");
                //console.log("data", {
                //     playerId : player._id,
                //     username : player.username,
                //     chips : player.chips,
                //     cash : player.cash,
                // });
                return {
                    status: 'success',
                    result: {
                        playerId : player._id,
                        username : player.username,
                        chips : player.chips,
                        cash : player.cash,
                        instance_bonus:(player.instance_bonus) ? player.instance_bonus : '0',
                        myReferralCode:player.myReferralCode
                    },
                    // result: player,
                    message: 'Player Successfully Register!'
                }

        } catch (e) {
            Sys.Log.info('Error in create Player : ' + e);
        }

    },

    playerLogin: async function(socket,data){
        try {
            //console.log("Data :",data);
            // data.isFbLogin = false;
            let passwordTrue = false;
            let myReferralCode = Math.floor(100000 + Math.random() * 900000);
            let player = null;
                 if (data.isFbLogin == false) { // if Normal Login
                 // Define Validation Rules
                 let playerObj = {
                    isFbLogin : false,
                    $or:[
                         {username: data.username},
                         {email: data.username}
                    ]};


                player = await Sys.Game.Common.Services.PlayerServices.getOneByData(playerObj);

                if(!player){
                   return {
                     status: 'fail',
                     result: null,
                     message: 'Wrong Username Or Email',
                     statusCode: 400
                   }
                }

                 if(bcrypt.compareSync(data.password, player.password)) {
                    passwordTrue = true;
                   } else {
                    // Passwords don't match
                   }


               }else{

                 let playerObj = {
                   isFbLogin : true,
                   appId : data.appId
                 };

                 player = await Sys.Game.Common.Services.PlayerServices.getOneByData(playerObj);
                 //console.log("Player FB :",player);
                 if(!player){
                   // Create Player Object
                   let cashNewPlayer = Sys.Config.Rummy.defaultCash;
                   if (data.signUpPromo && data.signUpPromo == 'TRR') {
                     cashNewPlayer = 50;
                   }
                   playerObj = {
                     deviceId         : data.deviceId,
                     isFbLogin        : true,
                     username         : data.username,
                     appId            : data.appId,
                     deviceId         : data.deviceId,
                     ip               : data.ip,
                     cash             : cashNewPlayer,
                     cashTransaction  : '0',                                    //this field manage the total transaction of cash in game
                     rewardPoint      : 0,                                      //this will store the reward points based on his play history
                     chips            : Sys.Config.Rummy.defualtPrcticesChips,
                     status           : 'active',
                     socketId         : socket.id,
                     instance_bonus      : '0',
                     myReferralCode      : myReferralCode,
                     mobile           : data.mobile
                   }

                   player = await Sys.Game.Common.Services.PlayerServices.create(playerObj);

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

                    await Sys.Game.Common.Services.PlayerServices.createCashManage(playerCashObj);

                    if (!player) {
                     return {
                       status: 'fail',
                       result: null,
                       message: 'Player Not Created',
                       statusCode: 400
                     }
                   }
                 }
                 passwordTrue = true;
               }

               if (passwordTrue) {
                        // Check Player Already Login Or Not.

                        let playerSocket = await Sys.Game.Common.Services.SocketServices.getByPlayerID({ playerId :  player.id});

                        if(playerSocket && playerSocket.socketId && Sys.Io.sockets.connected[playerSocket.socketId]){
                            //console.log("-------------------------------------------------------------->>")
                            //console.log("Player Force Logout Send.")
                            //console.log("-------------------------------------------------------------->>");
                            await Sys.Io.to(playerSocket.socketId).emit('forceLogOut',{
                                playerId :  player.id
                            });
                            // return {status: 'fail', result: null, message: 'Player Already Logged In.',statusCode: 400}
                        }


                   player.isFbLogin = false;
                   if (data.AppId != '') {
                     player.isFbLogin = true;
                   }

                   await Sys.Game.Common.Services.SocketServices.update({
                       playerId : player.id,
                       socketId : socket.id
                   });

                   let playerTableSetting = await Sys.Game.Common.Services.PlayerServices.getPlayerSetting({ playerId: player.id })
                   let account = await Sys.App.Services.TransactionServices.getPlayerCashData({ playerId : player.id });
                   return {
                     status: 'success',
                     result: {
                       playerId             : player.id,
                       username             : player.username,
                       chips                : player.chips,
                       cash                 : player.cash,
                       instance_bonus       : (player.instance_bonus) ? player.instance_bonus : 0,
                       myReferralCode       : player.myReferralCode,
                       playerTableSetting   : playerTableSetting,
                       releasedCash         : (account && account.releasedCash) ? account.releasedCash : 0,
                       rewardPoint          : (account && account.rewardPoint) ? account.rewardPoint : 0
                     },
                     message: 'Player Successfully Login!'
                   }
                 //}
               }
               return {
                 status: 'fail',
                 result: null,
                 message: 'Invalid Login Details!',
                 statusCode: 401
               }



        } catch (error) {
            Sys.Log.info('Error in createGuest : ' + error);
        }

    },

    reconnectPlayer: async function(socket,data){
        //console.log("Player Reconnecting..",data);
        try {
            await Sys.Game.Common.Services.SocketServices.update({
                playerId : data.playerId,
                socketId : socket.id
            });
        } catch (error) {
            Sys.Log.info('Error in reconnectPlayer : ' + error);
        }
    },

    gameHistory: async function(socket,data){
        // //console.log("Data ->",data)
        try {
                let player = await Sys.Game.Common.Services.PlayerServices.getById(data.playerId);
                if(!player){ return { status: 'fail', result: null, message: 'Player not Found!',  statusCode: 400 }  }

                let history = { };

                    return {
                    status: 'success',
                    result: history,
                    message: 'Player History Success!'
                    }

        } catch (error) {
            Sys.Log.info('Error in gameHistory : ' + error);
        }
    },

    getProfileCashChips: async function(socket,data){
        console.log("Data ->",data)
        try {
                let player = await Sys.Game.Common.Services.PlayerServices.getById(data.playerId);
                if(!player){ return { status: 'fail', result: null, message: 'Player not Found!',  statusCode: 400 }  }
                let account = await Sys.App.Services.TransactionServices.getPlayerCashData({ playerId : data.playerId });
                let plrObj = {
                    chips        : player.chips,
                    cash         : parseFloat(player.cash).toFixed(2),
                    releasedCash : (account && account.releasedCash) ? account.releasedCash.toString() : '0',
                    rewardPoint  : (account && account.requiredRewardPoint) ? account.requiredRewardPoint.toString() : '0',
                    instance_bonus:(player.instance_bonus) ? player.instance_bonus.toString() : '0',
                    myReferralCode:player.myReferralCode
                  };

                  return {
                    status: 'success',
                    result: plrObj,
                    message: 'Player Cash Chips  Success!'
                  }

        } catch (error) {
            Sys.Log.info('Error in gameHistory : ' + error);
        }
    },
    getCashChipsHistory: async function(socket,data){

        try {
                let player = await Sys.Game.Common.Services.PlayerServices.getById(data.playerId);
                if(!player){ return { status: 'fail', result: null, message: 'Player not Found!',  statusCode: 400 }  }

                let chispCashHistoryObj = await Sys.Game.Common.Services.PlayerServices.getChipsCashHistory({playerId : data.playerId});

                  return {
                    status: 'success',
                    result: chispCashHistoryObj,
                    message: 'Player Cash Chips  History!'
                  }

        } catch (error) {
            Sys.Log.info('Error in getCashChipsHistory : ' + error);
        }
    },
    updateProfile: async function(socket,data){
        //console.log("Data updateProfile ->",data)
        try {
                let player = await Sys.Game.Common.Services.PlayerServices.getById(data.playerId);
                if(!player){ return { status: 'fail', result: null, message: 'Player not Found!',  statusCode: 400 }  }


                if (bcrypt.compareSync(data.password, player.password)) {
                        let playerOther = await Sys.Game.Common.Services.PlayerServices.getOneByData({'username':data.username});
                        if(playerOther){  return { status: 'fail', result: null, message: 'Username Already Exists !',  statusCode: 400 }  };

                        let qry = {
                            'username' : data.username
                        };
                        player = await Sys.Game.Common.Services.PlayerServices.update(data.playerId,qry);
                        if (player) {
                            return {
                            status: 'success',
                            result: null,
                            message: 'Username has been changed successfully'
                            }
                        }
                }
                return {
                    status: 'fail',
                    result: null,
                    message: 'Invalid Password!',
                    statusCode: 401
                }

        } catch (error) {
            Sys.Log.info('Error in updateProfile : ' + error);
        }
    },

    getProfile: async function(socket,data){
        // //console.log("Data ->",data)
        try {
                let player = await Sys.Game.Common.Services.PlayerServices.getById(data.playerId);
                if(!player){ return { status: 'fail', result: null, message: 'Player not Found!',  statusCode: 400 }  }

                return {
                    status: 'success',
                    result: player,
                    message: 'Player Successfully Login!'
                  }

        } catch (error) {
            Sys.Log.info('Error in getProfile : ' + error);
        }
    },

    logOutPlayer: async function(socket,data){
        ////console.log("Data ->",data)
        try {
                let player = await Sys.Game.Common.Services.PlayerServices.getById(data.playerId);
                if(!player){ return { status: 'fail', result: null, message: 'Player not Found!',  statusCode: 400 }  }

                let history = { };

                    return {
                    status: 'success',
                    result: history,
                    message: 'Player History Success!'
                    }

        } catch (error) {
            Sys.Log.info('Error in logOutPlayer : ' + error);
        }
    },

    changePassword: async function(socket,data){
        //console.log("Data changePassword ->",data)
        try {
                let player = await Sys.Game.Common.Services.PlayerServices.getById(data.playerId);
                if(!player){ return { status: 'fail', result: null, message: 'Player not Found!',  statusCode: 400 }  }

                if (player) {
                    if (bcrypt.compareSync(data.oldPassword, player.password)) {
                        player = await Sys.Game.Common.Services.PlayerServices.update(data.playerId,{password : bcrypt.hashSync(data.newPassword, 10)});
                      if (player) {
                        return {
                          status: 'success',
                          result: null,
                          message: 'Player Password Successfully Changed!'
                        }
                      }
                    }
                  }
                  return {
                    status: 'fail',
                    result: null,
                    message: 'Invalid Password!',
                    statusCode: 401
                  }

        } catch (error) {
            Sys.Log.info('Error in gameHistory : ' + error);
        }
    },

    forgetPassword: async function(socket,data){
      try {

        var hostname = socket.handshake.headers.host;
        // var hostname = Sys.Config.Database[Sys.Config.Database.connectionType].mongo.host+":"+Sys.Config.Socket.port;
        // //console.log(hostname);
        // return false;
        // //console.log(hostname);
        // response.send(hostname);
        // return false;
        let player = await Sys.Game.Common.Services.PlayerServices.getOneByData({'email':data.email});
        if (player) {



          // var mailOptions = {
          //   to: data.email,
          //   from: 'Rummy-Circle',
          //   subject: 'Rummy-Circle Password Reset',
          //   text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          //     'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          //     'http://' + hostname + '/forget-password/' + player.id + '\n\n' +
          //     'If you did not request this, please ignore this email and your password will remain unchanged.\n\n\n'+
          //     'Thanks:\n'+
          //     'Team Rummy-Circle'
          // };
          var mailOptions = {
              to: data.email,
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
          return {
            status: 'success',
            // result: null,
            message: 'Password Reset Link send to the Email, Please check mail for changing password',
          }


        }else {
          //console.log('-------------------');
          return {
            status: 'fail',
            // result: null,
            message: 'No Player Found!',
            statusCode: 401
          }
        }
        // return {
        //   status: 'fail',
        //   result: null,
        //   message: 'No Player Found!',
        //   statusCode: 401
        // }

      } catch (error) {
        Sys.Log.info('Error in forgetPassword : ' + error);
      }

    },

    uploadDocument: async function(socket,data){

      //console.log("uploadDocument called");
      // Convert Base64 to image.
       var fs = require('fs');
       // string generated by canvas.toDataURL()
       var img1 = data.img1;
       var img2 = data.img2;
       // get picture extention
       let extension1 = 'null';
       let extension2 = 'null';
      //  let extension = img.substring("imgData:image/".length, img.indexOf(";base64"));
       let firstChar1 = data.img1.charAt(0);
       if (firstChar1 == '/') {
         extension1 = 'jpg';
       }else if (firstChar1 == 'i') {
         extension1 = 'png';
       }else if (firstChar1 == 'R') {
         extension1 = 'gif';
       }else if (firstChar1 == 'J') {
         extension1 = 'pdf';
       }

       let firstChar2 = data.img2.charAt(0);
       if (firstChar2 == '/') {
         extension2 = 'jpg';
       }else if (firstChar2 == 'i') {
         extension2 = 'png';
       }else if (firstChar2 == 'R') {
         extension2 = 'gif';
       }else if (firstChar2 == 'J') {
         extension2 = 'pdf';
       }

       if (extension1 == 'gif' || extension2 == 'gif' || extension1 == 'null' || extension2 == 'null') {
         return {
           status: 'fail',
           result: null,
           message: 'Invalid file format, File should be jpg or png!',
           statusCode: 400
         }
       }

      // extension2 = 'pdf';
       // strip off the data: url prefix to get just the base64-encoded bytes
       var imgData1 = img1.replace(/^imgData:img1\/\w+;base64,/, "");
       var imgData2 = img2.replace(/^imgData:img2\/\w+;base64,/, "");
       var buf1 = new Buffer(imgData1, 'base64');
       var buf2 = new Buffer(imgData2, 'base64');
       var hostname = socket.handshake.headers.host;

       fs.writeFile('public/assets/docs/'+data.playerId+ '_doc1.' + extension1 , buf1, (err) => {
          if (err){
            //console.log("Error", err);
          };
          //console.log('The file 1 has been saved!');
        });

        fs.writeFile('public/assets/docs/'+data.playerId+ '_doc2.' + extension2 , buf2, (err) => {
           if (err){
             //console.log("Error", err);
           };
           //console.log('The file 2 has been saved!');
         });

         let user = await Sys.App.Services.OtherAllService.createDocument({
           playerId : data.playerId,
          //  document_type : req.body.options,
          //  other_document : req.body.otherDocument,
           take_photo : '/assets/docs/'+data.playerId+ '_doc1.' + extension1,
           document : '/assets/docs/'+data.playerId+ '_doc2.' + extension2
         });

         return {
           status: 'success',
          //  result: playerData,
           message: 'Player Profile Successfully Updated!'
         }

    },

    checkForRunningGame:async function(socket,data){
      try{
        let player = await Sys.Game.Common.Services.PlayerServices.getActiveGame(data)
        let doc;
        if (player && player.length > 0) {
          // let namespace = '';
          // if (player[0].tableType = 'points') {
          //   namespace = 'practice_points';
          // }else if (player[0].tableType = 'points') {
          //   namespace = 'practice_pool';
          // }else if (player[0].tableType = '') {
          //   namespace = 'practice_deals';
          // }else if (player[0].tableType = '') {
          //   namespace = 'practice_points_21';
          // }else if (player[0].tableType = '') {
          //   namespace = 'practice_points_24';
          // }else if (player[0].tableType = '') {
          //   namespace = 'cash_points';
          // }else if (player[0].tableType = '') {
          //   namespace = 'cash_pool';
          // }else if (player[0].tableType = '') {
          //   namespace = 'cash_deals';
          // }else if (player[0].tableType = '') {
          //   namespace = 'cash_points_21';
          // }else if (player[0].tableType = '') {
          //   namespace = 'cash_points_24';
          // }

          doc={
            status:'success',
            data:player[0],

            message:'getdata successfully'
          }
        }else {
          doc={
            status:'fail',
            data:[],
            message:'No Running games found'
          }
        }

        return doc;
      }catch(e){
        //console.log('e',e)
      }
    },

    PlayerTableSetting: async function(socket,data){
      try {
        let setSetting = await Sys.Game.Common.Services.PlayerServices.setPlayerSetting(data)
        return {status: 'success', message: 'Player setting Updated'};
      } catch (error) {
        Sys.Log.info('Error in PlayerTableSetting : ' + error);

      }
    },

}
