var Sys = require('../../Boot/Sys');
var bcrypt = require('bcryptjs');
var json2xls = require('json2xls');

const accountSid = 'AC18cef4609c3ec071b688c0a282c28be2';
const authToken = 'b9d9ed60cfd1a004a509f14271b79f12';
const client = require('twilio')(accountSid, authToken);
const express = require('express');

const fileUpload = require('express-fileupload');
var path = require("path");
var join = require('path').join;
const BASEPATH = path.dirname(process.mainModule.filename);
var fs = require('fs');
const nodemailer = require('nodemailer');
var defaultTransport = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: Sys.Config.App.mailer.auth.user,
    pass: Sys.Config.App.mailer.auth.pass
  }
 });

module.exports = {
  menu: async function(req,res){
    // res.redirect('intent:#Intent;scheme=http;package=com.therummyround;end');

    // res.redirect('intent:#Intent;scheme=rummyround;package=com.therummyround;end'); //working
    // res.redirect('intent:#Intent;scheme=roundrummy;action=android.intent.action.VIEW;package=com.therummyround;end');

      try {
      let user = await Sys.App.Services.OtherAllService.getOnePlayer({_id : req.params.id });
      let getDocument = await Sys.App.Services.OtherAllService.getDocument({playerId : req.params.id, status: {$ne : 'Reject' }});
      let kycDone = false;
      if (getDocument.length != 0) {
        // //console.log("hhhh", getDocument.length);
        kycDone = true;
      }
      // //console.log('getDocument', kycDone);
          var data = {
                  App : Sys.Config.App.details,
                  error: req.flash("error"),
                  success: req.flash("success"),
                  userActive : 'active',
                  data : user,
                  id: req.params.id,
                  kycDone: kycDone,
              };
              return res.render('other/menu',data);
      } catch (e) {
          //console.log("Error",e);
      }
  },

  account: async function(req,res){
    // res.redirect('intent:#Intent;scheme=roundrummy://open/rahul;package=com.therummyround;end');

    try {
      let account = null;
      // account = await Sys.App.Services.OtherAllService.getOneAccount({ playerId : req.params.id });
      account = await Sys.App.Services.TransactionServices.getPlayerCashData({ playerId : req.params.id });
      let player = await Sys.App.Services.OtherAllService.getOnePlayer({ _id : req.params.id });
      //console.log('player', player);

      let totals = 0;
      if (account != null) {
        totals = account.totalCash.toFixed(2);
        account.rewardPoint = account.rewardPoint.toFixed(2);
        account.totalCash = account.totalCash.toFixed(2)
        account.withdrawLimit = account.withdrawLimit.toFixed(2)
        account.wonCash = account.wonCash.toFixed(2)
        account.depositedCash = account.depositedCash.toFixed(2)
        account.lockCash  = account.lockCash.toFixed(2)
        account.releasedCash  = account.releasedCash.toFixed(2)
        // totals = account.withdrawable + account.cash + account.deposite + account.loyaltyPoints + account.pendingBonus + account.releasedBonus;
      }
      var data = {
              App : Sys.Config.App.details,
              error: req.flash("error"),
              success: req.flash("success"),
              userActive : 'active',
              getAccount : account,
              total : totals,
              id: req.params.id,
              player: player,
          };
      return res.render('other/account',data);
    } catch (e) {
        //console.log("Error",e);
    }
  },
  playerAccount: async function(req,res){
    // res.redirect('intent:#Intent;scheme=roundrummy://open/rahul;package=com.therummyround;end');

    try {
      //let account = null;
      // account = await Sys.App.Services.OtherAllService.getOneAccount({ playerId : req.params.id });
      let account = await Sys.App.Services.TransactionServices.getPlayerCashData({ playerId : req.params.id });
      let player = await Sys.App.Services.OtherAllService.getOnePlayer({ _id : req.params.id });
      //console.log('player', player);
      let account_detail = {};
      let totals = 0;
      if (account != null) {
        totals = (account.totalCash.toFixed(2)) ? account.totalCash.toFixed(2) : 0;
        account_detail.rewardPoint = (account.rewardPoint.toFixed(2)) ? account.rewardPoint.toFixed(2) : 0;
        account_detail.totalCash = (account.totalCash.toFixed(2)) ? account.totalCash.toFixed(2) : 0;
        account_detail.withdrawLimit = (account.withdrawLimit.toFixed(2)) ? account.withdrawLimit.toFixed(2) : 0;
        account_detail.wonCash = (account.wonCash.toFixed(2)) ? account.wonCash.toFixed(2) : 0;
        account_detail.depositedCash = (account.depositedCash.toFixed(2)) ? account.depositedCash.toFixed(2) : 0;
        account_detail.lockCash  = (account.lockCash.toFixed(2)) ? account.lockCash.toFixed(2) : 0;
        account_detail.releasedCash  = (account.releasedCash.toFixed(2)) ? account.releasedCash.toFixed(2) : 0;
        // totals = account.withdrawable + account.cash + account.deposite + account.loyaltyPoints + account.pendingBonus + account.releasedBonus;
      }
      if (account == null){
        account_detail.rewardPoint = "00.00";
        account_detail.totalCash =  "00.00";
        account_detail.withdrawLimit = "00.00";
        account_detail.wonCash = "00.00";
        account_detail.depositedCash = "00.00";
        account_detail.lockCash  = "00.00";
        account_detail.releasedCash  = "00.00"; 
      }
      var data = {
              userActive : 'active',
              getAccount : account_detail,
              total : totals,
              id: req.params.id,
              player: player,
          };
      // return res.render('other/account',data);
      return res.send({"status":true,"data":data});
    } catch (e) {
        //console.log("Error",e);
        return res.send({"status":false,"message":e});
    }
  },
	profile: async function(req,res){
        try {
        let user = await Sys.App.Services.OtherAllService.getOnePlayer({ _id : req.params.id });
            var data = {
                    App : Sys.Config.App.details,
                    error: req.flash("error"),
                    success: req.flash("success"),
                    userActive : 'active',
                    user : user,
                    id : req.params.id
                };
                return res.render('other/profile',data);
        } catch (e) {
            //console.log("Error",e);
        }
	},
	transactions: async function(req,res){
        try {
        	let selectedValue = req.query.transaction
            var data = {
                    App : Sys.Config.App.details,
                    error: req.flash("error"),
                    success: req.flash("success"),
                    userActive : 'active',
                    value : selectedValue,
                    id: req.params.id,
                };
                return res.render('other/transactions',data);
        } catch (e) {
            //console.log("Error",e);
        }
	},
	withdrawCash: async function(req,res){
        try {
	        let player = await Sys.App.Services.PlayerServices.getPlayerData({_id:req.params.id});

          var data = {
                    App : Sys.Config.App.details,
                    error: req.flash("error"),
                    success: req.flash("success"),
                    userActive : 'active',
                    playerId : req.params.id,
                    player:player[0],
                };

                return res.render('other/withdraw-cash',data);

        } catch (e) {
            //console.log("Error",e);
        }
  },
  playerWithdrawHistory: async function (req, res){
    try {
      let query = { playerId : req.params.id};
      

      let data = await Sys.App.Services.OtherAllService.getWithdraw(query);
      let withdrawCount = data.length;
      var obj = {
        'recordsTotal': withdrawCount,
        'data': data
      };

      res.send(obj);
    } catch (e) {
      //console.log("Error",e);
    }
  },


	getTransaction : async function(req,res){
		try{
			let query = {};
			//console.log("get value",req.params.type);
			if(req.params.type == 'all'){
				query = {playerId :req.params.id };
			}else{
				query = { transaction_type :req.params.type , playerId :req.params.id}
			}
			let transaction = await Sys.App.Services.OtherAllService.getByTransaction(query);
			 var obj = {
                'data': transaction
              };
              res.send(obj);
		}catch (error){
			//console.log("Error",error);
		}
	},

	postWithdrawCash: async function(req,res){
		try{
      //console.log("req.body", req.body);
      let allowWithdraw           = false;
      let wonCashDeducted         = 0;
      let depositCashDeducted     = 0;
      let withdrawLimitDeducted   = 0;
      //  Check weather the withdraw amount is 100 or more
      if ( parseFloat(req.body.amount) < 100 ) {
        //console.log("Minimum Transaction amount should be 100 or More");
        req.flash('error','Minimum Transaction amount should be 100 or More');
        res.redirect('/other/withdrawCash/'+req.params.id);
        return false;
      }
      //  validate user
      let user = await Sys.App.Services.OtherAllService.getOnePlayer({_id : req.params.id });
      if (user.length == 0) {
        //console.log("No such User Found");
        req.flash('error','No such User Found');
        res.redirect('/other/withdrawCash/'+req.params.id);
        return false;
      }
      if (user.bankName == '' && user.accountHolderName == '' && user.accountNumber == '' && user.ifscCode == '') {
        //console.log("No such Bank Detail Found");
        req.flash('error','No such Bank Detail Found');
        res.redirect('/other/withdrawCash/'+req.params.id);
        return false;
      }
      if (parseFloat(user.cash) < parseFloat(req.body.amount)) {
        //console.log("User Does Not have Sufficient Cash");
        req.flash('error','User Does Not have Sufficient Cash');
        res.redirect('/other/withdrawCash/'+req.params.id);
        return false;
      }
      //  Check for KYC
      let getDocument = await Sys.App.Services.OtherAllService.getDocument({ playerId : req.params.id, status: 'Accept' });
      let kycDone = false;
      if (getDocument.length != 0) {
        // //console.log("hhhh", getDocument.length);
        kycDone = true;
      }
      if (kycDone == false) {
        //console.log('You have not Completed Your KYC, Please Complete and then Proceed for Withdrawal.');
        req.flash('error','You have not Completed Your KYC, Please Complete and then Proceed for Withdrawal.');
        res.redirect('/other/withdrawCash/'+req.params.id);
        return false;
      }
      //  Check for Withdraw limit
      let getPlayerCashManager = await Sys.App.Services.TransactionServices.getPlayerCashData({ playerId : req.params.id });
      //console.log("getPlayerCashManager", getPlayerCashManager);
      // res.send(getPlayerCashManager);
      // Comparison the value with wonCash(Which is anytime withdrawable)
      if (getPlayerCashManager && parseFloat(getPlayerCashManager.wonCash) < parseFloat(req.body.amount) ) {
        // if amount is greater than wonCash then check if the depositCash is withdrawable or not
        if ( parseFloat(parseFloat(getPlayerCashManager.wonCash) + parseFloat(getPlayerCashManager.depositedCash)) >= parseFloat(req.body.amount) ) {
          // Check player's wihdrawable amount
          if ( parseFloat(getPlayerCashManager.withdrawLimit) >= parseFloat(req.body.amount) ) {
            // if found more or equal to withdraw amount then ok
            // deduct from wonCash
            allowWithdraw                 = true;
            let remainingWithdrawAmount   = parseFloat(req.body.amount);
            let newWonCash                = 0;
            wonCashDeducted               = getPlayerCashManager.wonCash;
            remainingWithdrawAmount       = parseFloat(req.body.amount) - parseFloat(getPlayerCashManager.wonCash);
            depositCashDeducted           = remainingWithdrawAmount;
            // then remaining deduct from depositCash
            let newDepositedCash          = parseFloat(getPlayerCashManager.depositedCash) - parseFloat(remainingWithdrawAmount);
            withdrawLimitDeducted         = parseFloat(req.body.amount);
            let newTotalCash              = parseFloat(newWonCash) + parseFloat(newDepositedCash);
            // and manage the rest values

            let cashManageData            = {
                                              totalCash               : newTotalCash ,
                                              wonCash                 : parseFloat(newWonCash) ,
                                              depositedCash           : parseFloat(newDepositedCash) ,
                                              withdrawLimit           : parseFloat(getPlayerCashManager.withdrawLimit) - parseFloat(req.body.amount) ,
                                              // lockCash                : cashManager.lockCash + parseFloat(depositData.lockCash) ,
                                              // requiredRewardPoint     : parseFloat(depositData.requiredRewardPoint)  ,
                                              // requiredRewardPoint     : parseFloat(cashManager.requiredRewardPoint) + parseFloat(depositData.requiredRewardPoint)  ,
                                            }
            // update Cash Manager
            await Sys.App.Services.TransactionServices.updateCashManager({ playerId : req.params.id }, cashManageData );
            await Sys.App.Services.PlayerServices.updatePlayerData(
              {
                _id: req.params.id
              },{
                cash: newTotalCash,
                // cash: (parseInt(transactionPlayer.cash)+transactionDone.amount).toString(),
              }
            )
          }else {
            //console.log("Amount is Greater Than the Cash Withdrawable Limit in Player Account");
            req.flash('error','Amount is Greater Than the Cash Withdrawable Limit in Player Account');
            res.redirect('/other/withdrawCash/'+req.params.id);
            return false;

          }
        }else {
          //console.log("Amount is Greater Than the Cash in Player Account");
          req.flash('error','Amount is Greater Than the Cash in Player Account');
          res.redirect('/other/withdrawCash/'+req.params.id);
          return false;
        }

        // if withdrawable then crete request
        // if not don't allow him to create his request.
      }else {
        // Deduct From wonCash and manage the rest values
        allowWithdraw           = true;
        let newWonCash          = parseFloat(getPlayerCashManager.wonCash) - parseFloat(req.body.amount);
        let newWithdrawLimit    = parseFloat(getPlayerCashManager.withdrawLimit) - parseFloat(req.body.amount)
        let newTotalCash        = parseFloat(newWonCash) + parseFloat(getPlayerCashManager.depositedCash);
        wonCashDeducted         = parseFloat(req.body.amount);
        depositCashDeducted     = 0;
        withdrawLimitDeducted   = parseFloat(req.body.amount);
        let cashManageData      = {
                                    totalCash               : newTotalCash ,
                                    wonCash                 : parseFloat(newWonCash) ,
                                    depositedCash           : parseFloat(getPlayerCashManager.depositedCash) ,
                                    withdrawLimit           : newWithdrawLimit ,
                                    // lockCash                : cashManager.lockCash + parseFloat(depositData.lockCash) ,
                                    // requiredRewardPoint     : parseFloat(depositData.requiredRewardPoint)  ,
                                    // requiredRewardPoint     : parseFloat(cashManager.requiredRewardPoint) + parseFloat(depositData.requiredRewardPoint)  ,
                                  }
        // update Cash Manager
        await Sys.App.Services.TransactionServices.updateCashManager({ playerId : req.params.id }, cashManageData );
        await Sys.App.Services.PlayerServices.updatePlayerData(
          {
            _id: req.params.id
          },{
            cash: newTotalCash,
            // cash: (parseInt(transactionPlayer.cash)+transactionDone.amount).toString(),
          }
        )



      }
      //  return false;
      //  Deduct the Cash from user's cash manage

      if (allowWithdraw == true) {
        let player = await Sys.App.Services.OtherAllService.createWithdraw(
            {
              playerId                  : req.params.id,
      				first_name                : req.body.first,
      				last_name                 : req.body.last,
      				birth_date                : req.body.date,
      				pincode                   : parseInt(req.body.pincode),
              dist                      : req.body.dist,
      				address                   : req.body.address,
      				state                     : req.body.state,
      				mobile                    : req.body.mobile,
              amount                    : parseFloat(req.body.amount),
              status                    : 'Pending',
              wonCashDeducted           : wonCashDeducted,
              depositCashDeducted       : depositCashDeducted,
              withdrawLimitDeducted     : withdrawLimitDeducted,
            });
      }

      req.flash('success','Withdraw request generated success');
      return res.redirect('/other/withdrawCash/'+req.params.id);
		}catch (error){
			//console.log("Error",error);
		}
	},

  checkValidMobileNo : async function(req,res){
      try{
          //console.log("email address",parseInt(req.body.number));
          let otp = Math.floor(1000 + Math.random() * 9000);
          let user = await Sys.App.Services.OtherAllService.getOnePlayer({mobile : parseInt(req.body.number)});
          //console.log("udydsuf",user)
          if(user){

             client.messages
              .create({
               body: 'Your OTP Generate successfully and OTP is'+otp,
               from: '+17542189659',
               to: user.mobile
             }, async function(error, message) {
              if(error){
                //console.log("Send to otp message Error--------->",error);
              }
            });
          let checkOtp = await Sys.App.Services.OtherAllService.getOneOtp({playerId : user.id});
          if(checkOtp){
              await Sys.App.Services.OtherAllService.updateOtp(
                  {
                      playerId : user.id,
                  },{
                      otp :otp
                  })
          }else{
              await Sys.App.Services.OtherAllService.createOtp({
                  playerId : user.id,
                  otp :otp
              })
          }

              res.send("otp send suucessfull");
          }else{
              res.send("Please enter current mobile number");
          }
      }catch (error){
         //console.log("Error",error);
      }
  },
  changeEmail: async function(req,res){
      try{
          let user = await Sys.App.Services.OtherAllService.getOnePlayer({_id : req.body.id});
          if(user){
             if(req.body.email){
                  await Sys.App.Services.OtherAllService.updatePlayer(
                  {
                     _id : user.id
                  },{
                      email : req.body.email
                  });
             }else if(req.body.mobile){
                  await Sys.App.Services.OtherAllService.updatePlayer(
                  {
                     _id : user.id
                  },{
                      mobile : req.body.mobile
                  });
             }else if(req.body.address){
                  await Sys.App.Services.OtherAllService.updatePlayer(
                  {
                     _id : user.id
                  },{
                      address : req.body.address
                  });
             }else if(req.body.username){
                  await Sys.App.Services.OtherAllService.updatePlayer(
                  {
                     _id : user.id
                  },{
                      username : req.body.username
                  });
             }


          res.redirect('/other/profile/'+req.body.id);
          }else{
          res.redirect('/other/profile/'+req.body.id);
          }
      }catch (error){
          //console.log("Error",error);
      }
  },

  checkOtp : async function(req,res){
      try{
          let user = await Sys.App.Services.OtherAllService.getOneOtp({$and : [{playerId : req.body.playerId},{otp : req.body.otp}]});
          if(!user){
              res.send("Invalid otp");
          }else{
              res.send("success");
          }
      }catch (error){
          //console.log("Error",e);
      }
  },
  uploadedDocuments : async function(req,res){
      try{
        let getDocument = await Sys.App.Services.OtherAllService.getDocument({ playerId : req.params.id, status: {$ne : 'Reject' } });
        if (getDocument.length != 0) {
          return res.redirect('/other/menu/'+req.params.id);
        }

          var data = {
                  App : Sys.Config.App.details,
                  error: req.flash("error"),
                  success: req.flash("success"),
                  userActive : 'active',
                  id: req.params.id,
              };
              return res.render('other/uploaded-documents',data);
      } catch (e) {
          //console.log("Error",e);
      }
  },

  postDocument: async function(req,res){
      try{
          let extension = path.extname(req.files.document.name);
          //console.log('extension: ',extension);
          if(extension != '.pdf'){
              // //console.log("'error','Profile image not valid formate..!'")
              req.flash('error','Please document select only pdf');
              res.redirect('/other/uploadedDocuments/'+req.params.id);
          }
          let getDocument = await Sys.App.Services.OtherAllService.getDocument({ playerId : req.params.id, status: {$ne : 'Reject' } });
          if (getDocument.length != 0) {
            // return res.redirect('/other/menu/'+req.params.id);

            req.flash('error','You Have already submitted the Documents');
            res.redirect('/other/menu/'+req.params.id);
          }

            var d = new Date();
            var time = d.getTime();
            var file =req.files.take_photo;
            var file1 =req.files.document;
            filename =  time+'_'+ (file.name).replace(" ", "_") ;
            filename1 =  time+'_'+ (file1.name).replace(" ", "_") ;

            let player = await Sys.App.Services.OtherAllService.getOnePlayer({_id : req.params.id });


            let user = await Sys.App.Services.OtherAllService.createDocument({
              playerId : req.params.id,
              playerName : player.username,
              document_type : req.body.options,
              other_document : req.body.otherDocument,
              take_photo : filename,
              document : filename1,
              status  : 'Pending'
            });

            file.mv("./public/other/take_img/"+filename,function(err){
              if(err){
                //console.log("error occured");
              }
            });

            file1.mv("./public/other/document/"+filename1,function(err){
              if(err){
                //console.log("error occured");
              }
            });
            //console.log("====================================================");
            //console.log("====================================================");
            //console.log("====================================================");
            //console.log("====================================================");
            //console.log("====================================================");
            res.redirect('intent:#Intent;scheme=rummyround;package=com.therummyround;end'); //working
            // res.redirect('/other/menu/'+req.params.id);

      } catch (e) {
          //console.log("Error",e);
      }
  },

  uploadHistory: async function(req,res){
      try{
          let getDocument = await Sys.App.Services.OtherAllService.getDocument({ playerId : req.params.id, status: {$ne : 'Reject' } });
          var data = {
              App : Sys.Config.App.details,
              error: req.flash("error"),
              success: req.flash("success"),
              userActive : 'active',
              documents : getDocument,
              id: req.params.id
          };
          return res.render('other/uploadHistory',data);
      }catch (error){
          //console.log("Error",error);
      }
  },
  playerDocuemntUploadHistory: async function(req,res){
      try{
          let getDocument = await Sys.App.Services.OtherAllService.getDocument({ playerId : req.params.id});
          var data = {
              documents : getDocument,
          };
          return res.send(data);
      }catch (error){
          //console.log("Error",error);
      }
  },
  viewEmail: async function(req,res){
      try {
       let user = await Sys.App.Services.OtherAllService.getOnePlayer({_id : req.params.id});
          var data = {
                  App : Sys.Config.App.details,
                  error: req.flash("error"),
                  success: req.flash("success"),
                  userActive : 'active',
                  data : user,
                  id: req.params.id,
              };
              return res.render('other/changeEmail',data);
      } catch (e) {
          //console.log("Error",e);
      }
  },
  addMobile: async function(req,res){
      try {
       let user = await Sys.App.Services.OtherAllService.getOnePlayer({_id : req.params.id});
          var data = {
                  App : Sys.Config.App.details,
                  error: req.flash("error"),
                  success: req.flash("success"),
                  userActive : 'active',
                  data : user,
                  id: req.params.id,
              };
              return res.render('other/addMobile',data);
      } catch (e) {
          //console.log("Error",e);
      }
  },
  username: async function(req,res){
      try {
       let user = await Sys.App.Services.OtherAllService.getOnePlayer({_id : req.params.id});
       //console.log("get user",user);
          var data = {
                  App : Sys.Config.App.details,
                  error: req.flash("error"),
                  success: req.flash("success"),
                  userActive : 'active',
                  data : user,
                  id: req.params.id,
              };
              return res.render('other/changeUserName',data);
      } catch (e) {
          //console.log("Error",e);
      }
  },

  checkUsername : async function(req,res){
      try{
          let user = await Sys.App.Services.OtherAllService.getOnePlayer({$and : [{_id : req.body.playerId},{username : req.body.username}]});
          //console.log("useashkd",user);
          if(user){
              res.send("success");
          }else{
              res.send("User name already exists");
          }
      }catch (error){
          //console.log("Error",e);
      }
  },

  changePassword: async function(req,res){
      try {
       let user = await Sys.App.Services.OtherAllService.getOnePlayer({_id : req.params.id});
       //console.log("get user",user);
          var data = {
                  App : Sys.Config.App.details,
                  error: req.flash("error"),
                  success: req.flash("success"),
                  userActive : 'active',
                  data : user,
                  id: req.params.id,
              };
              return res.render('other/changePassword',data);
      } catch (e) {
          //console.log("Error",e);
      }
  },

  postChangePassword: async function(req,res){
      try{
          let user = await Sys.App.Services.OtherAllService.getOnePlayer({ _id : req.body.userId });
          if(user){
            if (bcrypt.compareSync(req.body.password, user.password)) {

              await Sys.App.Services.PlayerServices.updatePlayerData(
                  {
                    _id: req.body.userId
                  },{
                    password : bcrypt.hashSync(req.body.newPassword, bcrypt.genSaltSync(8), null)
                  }
                )
                // player = await Sys.Game.Common.Services.PlayerServices.update(req.body.userId,{password : bcrypt.hashSync(req.body.newPassword, 10)});
              // if (player) {
                res.redirect('/other/profile/'+req.body.id);
              // }
            }

          }else{
          res.redirect('/other/profile/'+req.body.id);
          }
      }catch (error){
          //console.log("Error",error);
      }
  },

  // Admin Panel Functions
  getPlayersDocsList : async function(req,res){
      try{
        let getDocument = await Sys.App.Services.OtherAllService.getDocument({ status: {$ne : 'Reject' } });
          // //console.log("useashkd",getDocument);
          var data = {
              App : Sys.Config.App.details,
              error: req.flash("error"),
              success: req.flash("success"),
              kyc : 'active',
              pendingKyc : 'active',
              documents : getDocument,
              id: req.params.id
          };
          return res.render('other/kycList',data);
          // if(user){
          //     res.send("success");
          // }else{
          //     res.send("User name already exists");
          // }
      }catch (error){
          //console.log("Error",e);
      }
  },

  getKycList : async function(req,res){
    try {
      let start = parseInt(req.query.start);
      let length = parseInt(req.query.length);
      let search = req.query.search.value;

      let query = {};
      if (search != '') {
        let capital = search;
              query = { playerName: { $regex: '.*' + search + '.*' }, status: 'Pending' };
            } else {
              query = { status: 'Pending' };
            }

            let getDocumentC = await Sys.App.Services.OtherAllService.getDocument({ status: {$ne : 'Reject' } });
            let getDocumentCount = getDocumentC.length;
            let data = await Sys.App.Services.OtherAllService.getDocumentDatatable(query, length, start);

            var obj = {
              'draw': req.query.draw,
              'recordsTotal': getDocumentCount,
              'recordsFiltered': data.length,
              'data': data
            };
            res.send(obj);

    } catch (e) {
      //console.log("Error in Getting KYC listing.", e);
    }
  },

  updatePlayerKYC : async function(req,res){
    // //console.log("req.body", req.body);
    let getDocument = await Sys.App.Services.OtherAllService.getDocument({ _id: req.body.id  , status: 'Pending' });
    //console.log("getDocument", getDocument);
    if (getDocument.length != 0) {
      let getDocument = await Sys.App.Services.OtherAllService.updateDocument({ _id: req.body.id }, {status: req.body.response } );
        return res.send('success');
    }else {
        return res.send('fail');
    }
  },

  addBankDetails: async function(req,res){
    try {
      let player = await Sys.App.Services.PlayerServices.getSinglePlayerData({_id: req.params.id});
        var data = {
                App : Sys.Config.App.details,
                error: req.flash("error"),
                success: req.flash("success"),
                userActive : 'active',
                playerId : req.params.id,
                playerData: player,
            };
            return res.render('other/add-bank-details',data);
    } catch (e) {
        //console.log("Error",e);
    }
  },

  bankDetailsPostData: async function(req,res){
    try {
      let player = await Sys.App.Services.PlayerServices.getPlayerData({_id: req.params.id});
      if (player && player.length >0) {

            await Sys.App.Services.PlayerServices.updatePlayerData(
            {
              _id: req.params.id
              },{
                bankName: req.body.bankName,
                accountNumber: req.body.accountNumber,
                accountHolderName: req.body.accountHolderName,
                ifscCode: req.body.ifscCode,
              }
              )
              if(player.bankName == ''){
                req.flash('success','Bank details add successfully');
              }else{
                req.flash('success','Bank details update successfully');
              }
            res.redirect('/other/menu/'+req.params.id);

          }else {
            req.flash('error', 'Account holder Not found');
            res.redirect('/other/menu/'+req.params.id);
            return;
          }
      } catch (e) {
        //console.log("Error",e);
      }
    },

    getPlayersDocsListApproved : async function(req,res){
        try{
          let getDocument = await Sys.App.Services.OtherAllService.getDocument({ status: 'Approved' });
            // //console.log("useashkd",getDocument);
            var data = {
                App : Sys.Config.App.details,
                error: req.flash("error"),
                success: req.flash("success"),
                kyc : 'active',
                approveKyc:'active',
                documents : getDocument,
                id: req.params.id
            };
            return res.render('other/kycListApproved',data);
            // if(user){
            //     res.send("success");
            // }else{
            //     res.send("User name already exists");
            // }
        }catch (error){
            //console.log("Error",e);
        }
    },

    getApprovedKycList : async function(req,res){
      try {
        
        let start = parseInt(req.query.start);
        let length = parseInt(req.query.length);
        let search = req.query.search.value;

        let query = {};
        if (search != '') {
          let capital = search;
                query = { playerName: { $regex: '.*' + search + '.*' }, status: 'Accept' };
              } else {
                query = { status: 'Accept' };
              }

              let getDocumentC = await Sys.App.Services.OtherAllService.getDocument({ status: 'Accept' });
              let getDocumentCount = getDocumentC.length;
              let data = await Sys.App.Services.OtherAllService.getDocumentDatatable(query, length, start);

              var obj = {
                'draw': req.query.draw,
                'recordsTotal': getDocumentCount,
                'recordsFiltered': getDocumentCount,
                'data': data
              };
              res.send(obj);

      } catch (e) {
        //console.log("Error in Getting KYC listing.", e);
      }
    },

    withdrawRequest : async function(req,res){
        try{
          let getDocument = await Sys.App.Services.OtherAllService.getWithdraw({ status: 'Pending' });
            // //console.log("useashkd",getDocument);
            var data = {
                App : Sys.Config.App.details,
                error: req.flash("error"),
                success: req.flash("success"),
                withdrawRequest : 'active',
                // documents : getDocument,
            };
            return res.render('other/withdrawList',data);
        }catch (error){
            //console.log("Error",e);
        }
    },

    getWithdrawRequestList : async function(req,res){
      try {
        let start = parseInt(req.query.start);
        let length = parseInt(req.query.length);
        let search = req.query.search.value;

        let query = {};
        if (search != '') {
          let capital = search;
                query = { playerName: { $regex: '.*' + search + '.*' }, status: 'Pending' };
              } else {
                query = { status: 'Pending' };
              }

              let getDocumentC = await Sys.App.Services.OtherAllService.getWithdraw({ status: 'Pending' });
              let getDocumentCount = getDocumentC.length;
              let withdraw = await Sys.App.Services.OtherAllService.getWithdrawDatatable(query, length, start);
              var withrawdata =[];
              for(let i =0; i< withdraw.length; i++){
                var player = await Sys.App.Services.OtherAllService.getBankDatatable({_id:withdraw[i].playerId});
                withrawdata.push({
                  bankName : player.bankName,
                  accountNumber : player.accountNumber,
                  ifscCode : player.ifscCode,
                  playerId : withdraw[i].playerId,
                  name : withdraw[i].first_name+' '+withdraw[i].last_name,
                  amount : withdraw[i].amount,
                  status : withdraw[i].status,
                  _id:withdraw[i]._id
                });

              }

              var obj = {
                'draw': req.query.draw,
                'recordsTotal': getDocumentCount,
                'recordsFiltered': withdraw.length,
                'data': withrawdata
              };
              res.send(obj);

      } catch (e) {
        //console.log("Error in Getting KYC listing.", e);
      }
    },

    updatePlayerWithdrawal : async function(req,res){
      //console.log("req.body", req.body);
      let player = await Sys.App.Services.OtherAllService.getPlayer({_id:req.body.id});
      // //console.log('player------------',player);

      let getDocument = await Sys.App.Services.OtherAllService.getSingleWithdraw({ _id: req.body.id  , status: 'Pending' });
      // //console.log("getDocument", getDocument);
      if (getDocument && getDocument.length != 0) {
        await Sys.App.Services.OtherAllService.updateWithdraw({ _id: req.body.id }, {status: 'Done' } );

                  var mailOptions = {
                          to: player.playerIdok.email,
                          from: 'The RummyRounds',
                          subject: 'Activate Your The RummyRounds ',
                          text: 'You are receiving this mail because your banck account details is confirmed.'
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
          return res.send('success');
      }else {
          return res.send('fail');
      }
    },

    //Pending & Approve Withdraw Request
    otherWithdrawRequest : async function(req,res){
      try{
        let getDocument = await Sys.App.Services.OtherAllService.getWithdraw({ status: { $nin: ["Pending"] } });//{ crowd : { $nin: ["cool"] }}

          var data = {
              App : Sys.Config.App.details,
              error: req.flash("error"),
              success: req.flash("success"),
              withdrawRequest : 'active',
              documents : getDocument,
          };
          return res.render('other/other-withdrawList',data);
      }catch (error){
          //console.log("Error",e);
      }
  },

  getOtherWithdrawRequestList : async function(req,res){
  try {
    let start = parseInt(req.query.start);
    let length = parseInt(req.query.length);
    let search = req.query.search.value;

    let query = {};
    if (search != '') {
      let capital = search;
            query = { playerName: { $regex: '.*' + search + '.*' }, status: { $ne: "Pending" } };
          } else {
            query = { status: { $ne: "Pending" } };
          }

          let getDocumentC = await Sys.App.Services.OtherAllService.getWithdraw({ status: { $ne: "Pending" } });

          let getDocumentCount = getDocumentC.length;
          let withdraw = await Sys.App.Services.OtherAllService.getWithdrawDatatable(query, length, start);
          //console.log('withdraw data: ',query);
          var withrawdata =[];
          for(let i =0; i< withdraw.length; i++){
            var player = await Sys.App.Services.OtherAllService.getBankDatatable({_id:withdraw[i].playerId});
            //console.log('player data--------------: ',player);
            withrawdata.push({
              bankName : player.bankName,
              accountNumber : player.accountNumber,
              ifscCode : player.ifscCode,
              playerId : withdraw[i].playerId,
              name : withdraw[i].first_name+' '+withdraw[i].last_name,
              amount : withdraw[i].amount,
              status : withdraw[i].status,
              _id:withdraw[i]._id
            });

          }

        //console.log('withdraw data: ',withrawdata);
          var obj = {
            'draw': req.query.draw,
            'recordsTotal': getDocumentCount,
            'recordsFiltered': withdraw.length,
            'data': withrawdata
          };
          res.send(obj);

  } catch (e) {
    //console.log("Error in Getting KYC listing.", e);
  }
},
addNewTestimonials: async function(req,res){
    try {
            await Sys.App.Services.OtherAllService.createTestimonialsData(
              {
                username: req.body.username,
                photo: req.body.photo,
                description: req.body.description
              }
            )
            return res.send({"status":true,"message":"Testimonials created successfully"});
          
      } catch (e) {
        return res.send({"status":false,"message":e});
        //console.log("Error",e);
      }
},
listTestimonials: async function (req, res){
    try {
      let query = {};
      

      let data = await Sys.App.Services.OtherAllService.getTestimonials(query);
      let testimonialCount = data.length;
      var obj = {
        'recordsTotal': testimonialCount,
        'data': data
      };

      res.send(obj);
    } catch (e) {
      //console.log("Error",e);
    }
  },
  addNewBlogs: async function(req,res){
      try {
              await Sys.App.Services.OtherAllService.createBlogsData(
                {
                  title: req.body.title,
                  createdBy: req.body.createdBy,
                  tag:req.body.tag,
                  isDisplayHomePage:req.body.isDisplayHomePage,
                  categoryName:req.body.categoryName,
                  photo:req.body.photo,
                  photo1:req.body.photo1,
                  description: req.body.description
                }
              )
              return res.send({"status":true,"message":"Blog created successfully"});
            
        } catch (e) {
          return res.send({"status":false,"message":e});
          //console.log("Error",e);
        }
  },
  listBlogs: async function (req, res){
    try {
      let query = {};
      

      let data = await Sys.App.Services.OtherAllService.getBlogs(query);
      let blogCount = data.length;
      var obj = {
        'recordsTotal': blogCount,
        'data': data
      };

      res.send(obj);
    } catch (e) {
      //console.log("Error",e);
    }
  },
  getBlogDetails: async function (req, res){
    try {
      let data = await Sys.App.Services.OtherAllService.getBlogDetails({id : req.params.id });
      // var obj = {
      //   'data': data
      // };

      res.send(data);
    } catch (e) {
      //console.log("Error",e);
    }
  },
  getBlogDetailsByTitleURL: async function (req, res){
    try {
      let data = await Sys.App.Services.OtherAllService.getBlogDetails({title_url : req.params.title });
      // var obj = {
      //   'data': data
      // };

      res.send(data);
    } catch (e) {
      //console.log("Error",e);
    }
  },
  editBlog:async function(req,res){
    //console.log(req.body);
    let data = await Sys.App.Services.OtherAllService.getBlogDetails({id : req.params.id });
    if (!data) {
      return res.send({"status":false,"message":"Blog not found"});
    }
    if (req.body.title) {
      var title  = req.body.title.toLowerCase();
      let title_string = title.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '');
      let title_url = title_string.replace(/ /g,"-");
      req.body.title_url = title_url;
    }
    const filter = { id: req.params.id};
    const update = req.body;
    //console.log("update : ",update);
    let blog_data = await Sys.App.Services.OtherAllService.updateBlog(filter, update); 
    return res.send({"status":true,"message":"Blog updated successfully."});  
  },
  listOffers: async function (req, res){
    try {
      let query = {};
      let data = await Sys.App.Services.OtherAllService.getOffers(query);
      let offerCount = data.length;
      var obj = {
        'recordsTotal': offerCount,
        'data': data
      };

      res.send(obj);
    } catch (e) {
      //console.log("Error",e);
    }
  },
  getOfferDetails: async function (req, res){
    try {
      let data = await Sys.App.Services.OtherAllService.getOfferDetails({id : req.params.id });
      res.send(data);
    } catch (e) {
      //console.log("Error",e);
    }
  },
  editOffer:async function(req,res){
    //console.log(req.body);
    let data = await Sys.App.Services.OtherAllService.getOfferDetails({id : req.params.id });
    if (!data) {
      return res.send({"status":false,"message":"Offer not found"});
    }
    const filter = { id: req.params.id};
    const update = req.body;
    //console.log("update : ",update);
    let offr_data = await Sys.App.Services.OtherAllService.updateOffer(filter, update); 
    return res.send({"status":true,"message":"Offer updated successfully."});  
  },
  updateOffer:async function(req,res){
    //console.log(req.body);
    let data = await Sys.App.Services.OtherAllService.getOfferDetails({_id : req.params.id });
    if (!data) {
      return res.send({"status":false,"message":"Offer not found"});
    }
    const filter = { _id: req.params.id};
    const update = req.body;
    //console.log("update : ",update);
    let offr_data = await Sys.App.Services.OtherAllService.updateOffer(filter, update); 
    return res.send({"status":true,"message":"Offer updated successfully."});  
  },
  playerKycDocumentUpload: async function(req,res){
      try{
          let extension = path.extname(req.files.document.name);
          //console.log('extension: ',extension);
          if(extension != '.pdf'){
              return res.send({"status":false,"message":"Please document select only pdf"});
          }
          let getDocument = await Sys.App.Services.OtherAllService.getDocument({ playerId : req.body.id, status: {$ne : 'Reject' } });
          if (getDocument.length != 0) {
              return res.send({"status":false,"message":"You Have already submitted the Documents"});
          }

            var d = new Date();
            var time = d.getTime();
            var file =req.files.take_photo;
            var file1 =req.files.document;
            filename =  time+'_'+ (file.name).replace(" ", "_") ;
            filename1 =  time+'_'+ (file1.name).replace(" ", "_") ;

            let player = await Sys.App.Services.OtherAllService.getOnePlayer({_id : req.body.id });

            let user = await Sys.App.Services.OtherAllService.createDocument({
              playerId : req.body.id,
              playerName : player.username,
              document_type : req.body.options,
              other_document : req.body.otherDocument,
              take_photo : filename,
              document : filename1,
              status  : 'Pending'
            });

            file.mv("./public/other/take_img/"+filename,function(err){
              if(err){
                //console.log("error occured");
              }
            });

            file1.mv("./public/other/document/"+filename1,function(err){
              if(err){
                //console.log("error occured");
              }
            });
            //console.log("====================================================");
            //console.log("====================================================");
            //console.log("====================================================");
            //console.log("====================================================");
            //console.log("====================================================");
           return res.send({"status":true,"message":"You Have submitted the Documents Successfully."});
      } catch (e) {
          //console.log("Error",e);
          return res.send({"status":false,"message":e});
      }
  },
  accountMenu: async function(req,res){
    try {
          let user = await Sys.App.Services.OtherAllService.getOnePlayer({_id : req.params.id });
          let getDocument = await Sys.App.Services.OtherAllService.getDocument({playerId : req.params.id, status: {$ne : 'Reject' }});
          let kycDone = false;
          if (getDocument.length != 0) {
            kycDone = true;
          }
          var data = {
              data : user,
              id: req.params.id,
              kycDone: kycDone,
          };
          return res.send(data);
    } catch (e) {
        //console.log("Error",e);
    }
  },
  accountOverview: async function(req,res){
    try {
      let account = null;
      
      account = await Sys.App.Services.TransactionServices.getPlayerCashData({ playerId : req.params.id });
      let player = await Sys.App.Services.OtherAllService.getOnePlayer({ _id : req.params.id });
      
      let totals = 0;
      
      if (account != null) {
        totals = account.totalCash.toFixed(2);
        account.rewardPoint = account.rewardPoint.toFixed(2);
        account.totalCash = account.totalCash.toFixed(2)
        account.withdrawLimit = account.withdrawLimit.toFixed(2)
        account.wonCash = account.wonCash.toFixed(2)
        account.depositedCash = account.depositedCash.toFixed(2)
        account.lockCash  = account.lockCash.toFixed(2)
        account.releasedCash  = account.releasedCash.toFixed(2)
      }
      var data = {
          getAccount : account,
          total : totals,
          id: req.params.id,
          player: player,
      };
      return res.send(data);
    } catch (e) {
        //console.log("Error",e);
    }
  },
  accountProfile: async function(req,res){
    try {
          let user = await Sys.App.Services.OtherAllService.getOnePlayer({ _id : req.params.id });
          var data = {
              user : user,
              id : req.params.id
          };
          return res.send(data);
    } catch (e) {
        //console.log("Error",e);
    }
  },
  accountViewEmail: async function(req,res){
      try {
       let user = await Sys.App.Services.OtherAllService.getOnePlayer({_id : req.params.id});
          var data = {
                  data : user,
                  id: req.params.id,
              };
              return res.send(data);
      } catch (e) {
          //console.log("Error",e);
      }
  },
  accountChangeProfile: async function(req,res){
      try{
          if (!req.body.id) {
            return res.send({"status":false,"message":"id is required."});
          }
          let user = await Sys.App.Services.OtherAllService.getOnePlayer({_id : req.body.id});
          if(user){
             if(req.body.email){
                  await Sys.App.Services.OtherAllService.updatePlayer(
                  {
                     _id : user.id
                  },{
                      email : req.body.email
                  });
                  return res.send({"status":true,"message":"You have changed Email successfully."});
             }else if(req.body.mobile){
                  await Sys.App.Services.OtherAllService.updatePlayer(
                  {
                     _id : user.id
                  },{
                      mobile : req.body.mobile
                  });
                  return res.send({"status":true,"message":"You have changed Mobile successfully."});
             }else if(req.body.address){
                  await Sys.App.Services.OtherAllService.updatePlayer(
                  {
                     _id : user.id
                  },{
                      address : req.body.address
                  });
                  return res.send({"status":true,"message":"You have changed Address successfully."});
             }else if(req.body.username){
                  await Sys.App.Services.OtherAllService.updatePlayer(
                  {
                     _id : user.id
                  },{
                      username : req.body.username
                  });
                  return res.send({"status":true,"message":"You have changed Username successfully."});
             }
          }else{
            return res.send({"status":false,"message":"User Not Found."});
          }
      }catch (error){
          //console.log("Error",error);
      }
  },
  accountChangePassword: async function(req,res){
      try{
          let user = await Sys.App.Services.OtherAllService.getOnePlayer({ _id : req.body.userId });
          if(user){
            if (bcrypt.compareSync(req.body.password, user.password)) {

              await Sys.App.Services.PlayerServices.updatePlayerData(
                  {
                    _id: req.body.userId
                  },{
                    password : bcrypt.hashSync(req.body.newPassword, bcrypt.genSaltSync(8), null)
                  }
                )
                return res.send({"status":true,"message":"You have changed Password successfully."});
            }
          }else{
            return res.send({"status":false,"message":"User Not Found."});
          }
      }catch (error){
          //console.log("Error",error);
      }
  },
  accountWithdrawCash: async function(req,res){
    try{
      //console.log("req.body", req.body);
      let allowWithdraw           = false;
      let wonCashDeducted         = 0;
      let depositCashDeducted     = 0;
      let withdrawLimitDeducted   = 0;
      //  Check weather the withdraw amount is 100 or more
      if ( parseFloat(req.body.amount) < 100 ) {
        return res.send({"status":false,"message":"Minimum Transaction amount should be 100 or More"});
      }
      //  validate user
      let user = await Sys.App.Services.OtherAllService.getOnePlayer({_id : req.params.id });
      if (user.length == 0) {
        return res.send({"status":false,"message":"User Not Found."});
      }
      if (user.bankName == '' && user.accountHolderName == '' && user.accountNumber == '' && user.ifscCode == '') {
        return res.send({"status":false,"message":"No such Bank Detail Found."});
      }
      if (parseFloat(user.cash) < parseFloat(req.body.amount)) {
        return res.send({"status":false,"message":"User Does Not have Sufficient Cash."});
      }
      //  Check for KYC
      let getDocument = await Sys.App.Services.OtherAllService.getDocument({ playerId : req.params.id, status: 'Accept' });
      let kycDone = false;
      if (getDocument.length != 0) {
        // //console.log("hhhh", getDocument.length);
        kycDone = true;
      }
      if (kycDone == false) {
        return res.send({"status":false,"message":"You have not Completed Your KYC, Please Complete and then Proceed for Withdrawal."});
      }
      //  Check for Withdraw limit
      let getPlayerCashManager = await Sys.App.Services.TransactionServices.getPlayerCashData({ playerId : req.params.id });
      if (getPlayerCashManager && parseFloat(getPlayerCashManager.wonCash) < parseFloat(req.body.amount) ) {
        // if amount is greater than wonCash then check if the depositCash is withdrawable or not
        if ( parseFloat(parseFloat(getPlayerCashManager.wonCash) + parseFloat(getPlayerCashManager.depositedCash)) >= parseFloat(req.body.amount) ) {
          // Check player's wihdrawable amount
          if ( parseFloat(getPlayerCashManager.withdrawLimit) >= parseFloat(req.body.amount) ) {
            // if found more or equal to withdraw amount then ok
            // deduct from wonCash
            allowWithdraw                 = true;
            let remainingWithdrawAmount   = parseFloat(req.body.amount);
            let newWonCash                = 0;
            wonCashDeducted               = getPlayerCashManager.wonCash;
            remainingWithdrawAmount       = parseFloat(req.body.amount) - parseFloat(getPlayerCashManager.wonCash);
            depositCashDeducted           = remainingWithdrawAmount;
            // then remaining deduct from depositCash
            let newDepositedCash          = parseFloat(getPlayerCashManager.depositedCash) - parseFloat(remainingWithdrawAmount);
            withdrawLimitDeducted         = parseFloat(req.body.amount);
            let newTotalCash              = parseFloat(newWonCash) + parseFloat(newDepositedCash);
            // and manage the rest values

            let cashManageData            = {
              totalCash               : newTotalCash ,
              wonCash                 : parseFloat(newWonCash) ,
              depositedCash           : parseFloat(newDepositedCash) ,
              withdrawLimit           : parseFloat(getPlayerCashManager.withdrawLimit) - parseFloat(req.body.amount) ,
              // lockCash                : cashManager.lockCash + parseFloat(depositData.lockCash) ,
              // requiredRewardPoint     : parseFloat(depositData.requiredRewardPoint)  ,
              // requiredRewardPoint     : parseFloat(cashManager.requiredRewardPoint) + parseFloat(depositData.requiredRewardPoint)  ,
            }
            // update Cash Manager
            await Sys.App.Services.TransactionServices.updateCashManager({ playerId : req.params.id }, cashManageData );
            await Sys.App.Services.PlayerServices.updatePlayerData(
              {
                _id: req.params.id
              },{
                cash: newTotalCash,
                // cash: (parseInt(transactionPlayer.cash)+transactionDone.amount).toString(),
              }
            )
          }else {
            return res.send({"status":false,"message":"Amount is Greater Than the Cash Withdrawable Limit in Player Account."});
          }
        }else {
          return res.send({"status":false,"message":"Amount is Greater Than the Cash in Player Account."});
        }

        // if withdrawable then crete request
        // if not don't allow him to create his request.
      }else {
        // Deduct From wonCash and manage the rest values
        allowWithdraw           = true;
        let newWonCash          = parseFloat(getPlayerCashManager.wonCash) - parseFloat(req.body.amount);
        let newWithdrawLimit    = parseFloat(getPlayerCashManager.withdrawLimit) - parseFloat(req.body.amount)
        let newTotalCash        = parseFloat(newWonCash) + parseFloat(getPlayerCashManager.depositedCash);
        wonCashDeducted         = parseFloat(req.body.amount);
        depositCashDeducted     = 0;
        withdrawLimitDeducted   = parseFloat(req.body.amount);
        let cashManageData      = {
          totalCash               : newTotalCash ,
          wonCash                 : parseFloat(newWonCash) ,
          depositedCash           : parseFloat(getPlayerCashManager.depositedCash) ,
          withdrawLimit           : newWithdrawLimit ,
          // lockCash                : cashManager.lockCash + parseFloat(depositData.lockCash) ,
          // requiredRewardPoint     : parseFloat(depositData.requiredRewardPoint)  ,
          // requiredRewardPoint     : parseFloat(cashManager.requiredRewardPoint) + parseFloat(depositData.requiredRewardPoint)  ,
        }
        // update Cash Manager
        await Sys.App.Services.TransactionServices.updateCashManager({ playerId : req.params.id }, cashManageData );
        await Sys.App.Services.PlayerServices.updatePlayerData(
          {
            _id: req.params.id
          },{
            cash: newTotalCash,
            // cash: (parseInt(transactionPlayer.cash)+transactionDone.amount).toString(),
          }
        )

      }
      //  return false;
      //  Deduct the Cash from user's cash manage

      if (allowWithdraw == true) {
        let player = await Sys.App.Services.OtherAllService.createWithdraw(
            {
              playerId                  : req.params.id,
              first_name                : req.body.first,
              last_name                 : req.body.last,
              birth_date                : req.body.date,
              pincode                   : parseInt(req.body.pincode),
              dist                      : req.body.dist,
              address                   : req.body.address,
              state                     : req.body.state,
              mobile                    : req.body.mobile,
              amount                    : parseFloat(req.body.amount),
              status                    : 'Pending',
              wonCashDeducted           : wonCashDeducted,
              depositCashDeducted       : depositCashDeducted,
              withdrawLimitDeducted     : withdrawLimitDeducted,
            });
      }

      return res.send({"status":true,"message":"Withdraw request generated success."});
    }catch (error){
      //console.log("Error",error);
    }
  },

  accountAddBankDetails: async function(req,res){
    try {
      let player = await Sys.App.Services.PlayerServices.getPlayerData({_id: req.params.id});
      if (player && player.length >0) {

            await Sys.App.Services.PlayerServices.updatePlayerData(
            {
              _id: req.params.id
            },{
              bankName: req.body.bankName,
              accountNumber: req.body.accountNumber,
              accountHolderName: req.body.accountHolderName,
              ifscCode: req.body.ifscCode,
            }
            )
            return res.send({"status":true,"message":"Bank details update successfully."});
          }else {
            return res.send({"status":false,"message":"Account holder Not found."});
          }
      } catch (e) {
        //console.log("Error",e);
      }
  },
  accountViewKycDocumentHistory: async function(req,res){
      try{
          let getDocument = await Sys.App.Services.OtherAllService.getDocument({ playerId : req.params.id, status: {$ne : 'Reject' } });
          var data = {
              documents : getDocument,
              id: req.params.id
          };
          return res.send(data);
      }catch (error){
          //console.log("Error",error);
      }
  },
  accountPostKycDocument: async function(req,res){
      try{
          let extension = path.extname(req.files.document.name);
          //console.log('extension: ',extension);
          if(extension != '.pdf'){
              // //console.log("'error','Profile image not valid formate..!'")
              req.flash('error','Please document select only pdf');
              res.redirect('/other/uploadedDocuments/'+req.params.id);
          }
          let getDocument = await Sys.App.Services.OtherAllService.getDocument({ playerId : req.params.id, status: {$ne : 'Reject' } });
          if (getDocument.length != 0) {
            // return res.redirect('/other/menu/'+req.params.id);

            req.flash('error','You Have already submitted the Documents');
            res.redirect('/other/menu/'+req.params.id);
          }

            var d = new Date();
            var time = d.getTime();
            var file =req.files.take_photo;
            var file1 =req.files.document;
            filename =  time+'_'+ (file.name).replace(" ", "_") ;
            filename1 =  time+'_'+ (file1.name).replace(" ", "_") ;

            let player = await Sys.App.Services.OtherAllService.getOnePlayer({_id : req.params.id });


            let user = await Sys.App.Services.OtherAllService.createDocument({
              playerId : req.params.id,
              playerName : player.username,
              document_type : req.body.options,
              other_document : req.body.otherDocument,
              take_photo : filename,
              document : filename1,
              status  : 'Pending'
            });

            file.mv("./public/other/take_img/"+filename,function(err){
              if(err){
                //console.log("error occured");
              }
            });

            file1.mv("./public/other/document/"+filename1,function(err){
              if(err){
                //console.log("error occured");
              }
            });
            //console.log("====================================================");
            //console.log("====================================================");
            //console.log("====================================================");
            //console.log("====================================================");
            //console.log("====================================================");
            res.redirect('intent:#Intent;scheme=rummyround;package=com.therummyround;end'); //working
            // res.redirect('/other/menu/'+req.params.id);

      } catch (e) {
          //console.log("Error",e);
      }
  },
  cashDetailsByLessThanDate: async function(req,res){
    try {
          console.log("Set Date : ",req.body.date);
          console.log("Set Month : ",req.body.month);
          console.log("Set year : ",req.body.year);
          var resultArray = [];
          let players = await Sys.App.Services.PlayerServices.getPlayerData({});
          //var date = new Date(req.body.year+"-"+req.body.month+"-"+req.body.date);
          //console.log("DATE : ",date);
          if (players && players.length > 0) {
            for(let player of players){
              var query =  {$and: 
                [
                  {"playerId": player._id},
                  {"tranType":"cash"},
                  { 
                   "createdAt" : 
                      {     
                          $lte :  new Date(new Date(2020, 2, 31,23,59,59)) 
                     } 
                  }
                ]
              }
              let data = await Sys.App.Services.playerChipsCashHistoryService.getChipsDatatable(query);
              if (data && data.length > 0) {
                //console.log("DATA 0000 : ",data[0]);
                resultArray.push({"Username" : player.username,"playerId":player._id,"cash":data[0].afterBalance,"Date":data[0].createdAt.toString()})  
              }     
            }
          }
          var xls = json2xls(resultArray);
          var d = new Date();
          var time = d.getTime();
          var filename =  time+'_'+"playerCashDataBeforeQueryDate.xlsx";

          fs.writeFileSync("./public/other/playerCashData/"+filename, xls, 'binary', (err) => {
            if (err) {
              console.log("writeFileSync :", err);
            }
            console.log( filename+" file is saved!");
          });
          return res.send(resultArray);
    } catch (e) {
        //console.log("Error",e);
    }
  },
}
