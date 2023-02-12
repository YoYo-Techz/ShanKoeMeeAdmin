var Sys = require('../../Boot/Sys');
var bcrypt = require('bcryptjs');
var payumoney = require('payumoney-node');
const moment = require('moment');
// payumoney.setKeys('BZljyBz9', 'xfSm7TuOAc', 'YszouLv9nm2C588JAajxKHsHq6cqabfekktc5mUlk3g=');
// payumoney.isProdMode(false); // production = true, test = false

// var payumoney = require('payumoney-pay');

// payumoney.setAuthData(false,'BZljyBz9', 'xfSm7TuOAc', 'YszouLv9nm2C588JAajxKHsHq6cqabfekktc5mUlk3g=',req.headers.host+"/createTransaction/success",req.headers.host+"/createTransaction/failure")

module.exports = {
    // users: async function(req,res){
    //     try {
    //         var data = {
    //                 App : Sys.Config.App.details,
    //                 error: req.flash("error"),
    //                 success: req.flash("success"),
    //                 userActive : 'active'
    //             };
    //             return res.render('user/user',data);
    //     } catch (e) {
    //         //console.log("Error",e);
    //     }
    // },
    //
    // getUser: async function(req,res){
    //   // res.send(req.query.start); return false;
    //     try {
    //       let start = parseInt(req.query.start);
    //       let length = parseInt(req.query.length);
    //       let search = req.query.search.value;
    //
    //       let query = {};
    //       if (search != '') {
    //         let capital = search;
    //         // query = {
    //           // or: [
    //             // {'username': { 'like': '%'+search+'%' }},
    //             // {'username': { 'like': '%'+capital+'%' }}
    //           //  ]
    //             // };
    //         query = { email: { $regex: '.*' + search + '.*' } };
    //       } else {
    //         query = { };
    //       }
    //       let columns = [
    //         'id',
    //         'username',
    //         'firstname',
    //         'lastname',
    //         'email',
    //         'chips',
    //         'status',
    //         'isBot',
    //       ]
    //
    //       let playersC = await Sys.App.Services.UserServices.getUserData(query);
    //       let playersCount = playersC.length;
    //       let data = await Sys.App.Services.UserServices.getUserDatatable(query, length, start);
    //
    //       var obj = {
    //         'draw': req.query.draw,
    //         'recordsTotal': playersCount,
    //         'recordsFiltered': playersCount,
    //         'data': data
    //       };
    //             res.send(obj);
    //     } catch (e) {
    //         //console.log("Error",e);
    //     }
    // },
    //
    // addUser: async function(req,res){
    //     try {
    //         var data = {
    //                 App : Sys.Config.App.details,
    //                 error: req.flash("error"),
    //                 success: req.flash("success"),
    //                 userActive : 'active'
    //             };
    //             return res.render('user/add',data);
    //     } catch (e) {
    //         //console.log("Error",e);
    //     }
    // },
    //
    // addUserPostData: async function(req,res){
    //     try {
    //       // res.send(req.files.image.name); return;
    //       let player = await Sys.App.Services.UserServices.getUserData({email: req.body.email});
    //       if (player && player.length >0) {
    //         req.flash('error', 'User Already Present');
    //         res.redirect('/');
    //         return;
    //       }else {
    //         // if (req.files) {
    //         //   let image = req.files.image;
    //         //
    //         //   // Use the mv() method to place the file somewhere on your server
    //         //   image.mv('/profile/'+req.files.image.name, function(err) {
    //         //     if (err){
    //         //       req.flash('error', 'User Already Present');
    //         //       return res.redirect('/');
    //         //     }
    //         //
    //         //     // res.send('File uploaded!');
    //         //   });
    //         // }
    //         await Sys.App.Services.UserServices.insertUserData(
    //           {
    //             name: req.body.username,
    //             email: req.body.email,
    //             role: req.body.role,
    //             status: req.body.status,
    //             password : bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(8), null)
    //             // image: req.files.image.name
    //           }
    //         )
    //         req.flash('success','User create successfully');
    //         res.redirect('/user');
    //       }
    //       // req.flash('sucess', 'Player Registered successfully');
    //       // res.redirect('/');
    //     } catch (e) {
    //         //console.log("Error",e);
    //     }
    // },
    //
    // getUserDelete: async function(req,res){
    //     try {
    //       let player = await Sys.App.Services.UserServices.getUserData({_id: req.body.id});
    //       if (player || player.length >0) {
    //         await Sys.App.Services.UserServices.deleteUser(req.body.id)
    //         return res.send("success");
    //       }else {
    //         return res.send("error");
    //       }
    //     } catch (e) {
    //         //console.log("Error",e);
    //     }
    // },
    //
    // editUser: async function(req,res){
    //   try {
    //     let user = await Sys.App.Services.UserServices.getSingleUserData({_id: req.params.id});
    //     var data = {
    //                 App : Sys.Config.App.details,
    //                 error: req.flash("error"),
    //                 success: req.flash("success"),
    //                 user: user,
    //                 userActive : 'active'
    //             };
    //     return res.render('user/add',data);
    //     // res.send(player);
    //   } catch (e) {
    //     //console.log("Error",e);
    //   }
    // },
    //
    // editUserPostData: async function(req,res){
    //     try {
    //       let player = await Sys.App.Services.UserServices.getUserData({_id: req.params.id});
    //       if (player && player.length >0) {
    //
    //           if (req.files) {
    //             let image = req.files.image;
    //
    //             // Use the mv() method to place the file somewhere on your server
    //             image.mv('/profile/'+req.files.image.name, function(err) {
    //               if (err){
    //                 req.flash('error', 'User Already Present');
    //                 return res.redirect('/');
    //               }
    //
    //               // res.send('File uploaded!');
    //             });
    //           }
    //           await Sys.App.Services.UserServices.updateUserData(
    //             {
    //               _id: req.params.id
    //               // image: req.files.image.name
    //             },{
    //               name: req.body.username,
    //               // email: req.body.email,
    //               role: req.body.role,
    //               status: req.body.status,
    //               // password : bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(8), null)
    //               // image: req.files.image.name
    //             }
    //           )
    //           req.flash('success','User update successfully');
    //           res.redirect('/user');
    //
    //       }else {
    //         req.flash('error', 'No User found');
    //         res.redirect('/');
    //         return;
    //       }
    //       // req.flash('sucess', 'Player Registered successfully');
    //       // res.redirect('/');
    //     } catch (e) {
    //         //console.log("Error",e);
    //     }
    // },

    /*initiateTransaction: async function(req,res) {
      try{
        //console.log("req.body.:",req.body);
        let transacAmount = parseInt(req.body.amount * 100)
        let amount = parseInt(req.body.amount)

        if (amount < 100) {
          return res.send({status: 'Error', response: "Minimum Deposit should be 100 or Greater"})
        }
        let player = await Sys.App.Services.PlayerServices.getSinglePlayerData({_id: req.body.playerId});
          if (!player) {
            return res.send({status: 'Error', response: "No Such Player Found"})
          }
          let payment_data={
            playerId : req.body.playerId,
            name     : req.body.name,
            amount   : transacAmount,
            // amount   : parseInt(req.body.amount * 100),
            email    : req.body.email,
            phone    : req.body.phone,
          };

          let paymentLinkData = await Sys.App.Services.PaymentServices.getpaymentLink(payment_data);
          //console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~")
          //console.log("Order ID :",paymentLinkData.order_id);
          //console.log("Playment Data :",paymentLinkData.short_url);
          //console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~")

       let data = {
          phone       : req.body.phone,
          amount      : amount,
          playerId    : player.id,
          firstname   : player.username,
          email       : req.body.email,
          productinfo : "RummyCash",
          type        : "Debit",
          orderId     : paymentLinkData.order_id,
          paymentLink : paymentLinkData.short_url,
          status      : 'Pending',
				  createdAt   : Date.now(),
 			  	updatedAt   : Date.now(),

        };

        let transaction = await Sys.App.Services.TransactionServices.createTransaction(data);
        let lockCash = 0;
        let requiredRewardPoint = 0;
        // here comes the validation of promo code and calculation of lock/loyality points as per that.
        if (req.body.promoCode) {
          if (!amount || amount < 100) {
            return res.send({status: 'Error', response: "Deposit amount should be 100 or more"})
          }
          //console.log("###########################################################");
          //console.log("###########################################################");
          //console.log("data.promoCode", req.body.promoCode);
          //console.log("###########################################################");
          //console.log("###########################################################");
          // check for any previous deposits
          let previousDepositCount = await Sys.App.Services.TransactionServices.getDepositCount({ playerId: req.body.playerId, status: 'Success' });
          // if no deposit present then implement code of welcome
          //console.log('previousDepositCount', previousDepositCount);
          if (previousDepositCount == 0 && req.body.promoCode == 'Welcome') {
            // 100-999 => get locked bonus, 25% of the value of deposit value
            // 1000-1999 => get locked bonus, 50% of the value of deposit value
            // 2000 or more => get locked bonus, 100% of amount but max 3000.
            let percentage = 0;
            if (amount > 99 && amount < 1000) {
              percentage = 25;
            }else if (amount > 999 && amount < 2000) {
              percentage = 50;
            }else if (amount > 1999) {
              percentage = 100;
            }
            lockCash = parseFloat((amount*percentage)/100);
            if (lockCash > 3000) {
              lockCash = 3000;
            }
          }
          // if single entry present then implment code of firsttopup
          else if (previousDepositCount == 1 && req.body.promoCode == 'FirstRecharge') {
            // get 50% of the amount but max 3000
            //console.log('FirstRechange');
            let percentage = 50;
            lockCash = parseFloat((amount*percentage)/100);
            if (lockCash > 3000) {
              lockCash = 3000;
            }
          }
          // if 2 or more entry is present then proceed as per the promo code present in the system(if it is a valid code)
          else {
            // put code for other promo code as per flow of promo code gets decided.
            // Check wether promocode is there and is valid(in terms of time).
            //console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%");
            //console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%");
            //console.log("beyond 3rd transaction with promocode", req.body.promoCode);
            let validPromoCode = await Sys.App.Services.PromocodeServices.getSinglePromocodeData({ code: req.body.promoCode, start_date : { $lt : Date.now()}, end_date : { $gt : Date.now()}  });
            if (validPromoCode) {
              // check wether promo code is used by player
              let validPromoCodeUsed = 0
              validPromoCodeUsed = await Sys.App.Services.PromocodeServices.getHistoryCount({ promocode: req.body.promoCode, playerId : req.body.playerId  });
              if (validPromoCodeUsed < validPromoCode.individual_usage_limit) {
                let percentage = validPromoCode.offer;
                lockCash = parseFloat((amount*percentage)/100);
                if (lockCash > validPromoCodeUsed.maximum_offer) {
                  lockCash = validPromoCodeUsed.maximum_offer;
                }
              }else {
                return res.send({status: 'Error', response: "Promo Code Already Used Maximum Times"})
              }
            }else {
              return res.send({status: 'Error', response: "No Such Valid promoCode Found"})
            }
          }
          //console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
          //console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
          //console.log("transaction._id", paymentLinkData.order_id);
          await Sys.App.Services.PromocodeServices.createPromoApplyHistory({
            playerId          : req.body.playerId,
            promocode         : req.body.promoCode,
            transactionNumber : paymentLinkData.order_id,
            offeredChips      : lockCash
          });

        }

        // if Player is getting some lock bonus/points then calculate requiredRewardPoint
        if (lockCash > 0) {
          requiredRewardPoint = parseFloat(amount/10);
        }
        let requiredRewardPointReached = true;
        if (parseFloat(requiredRewardPoint) != 0) {
          requiredRewardPointReached = false;
        }
        let cashManager = await Sys.App.Services.TransactionServices.getPlayerCashData({ playerId : req.body.playerId });
        //console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
        //console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
        //console.log("transaction._id", paymentLinkData.order_id);
        let rr;
        if (cashManager && cashManager.requiredRewardPoint) {
          rr = parseFloat(cashManager.requiredRewardPoint) + parseFloat(requiredRewardPoint);
        }
        else{
          rr = parseFloat(requiredRewardPoint); 
        }
        let depositData = {
           playerId                       : req.body.playerId,
           transactionId                  : paymentLinkData.order_id,
           depositCash                    : amount,
           lockCash                       : lockCash,
           requiredRewardPoint            : rr,
           status                         : 'Pending',
           requiredRewardPointReached     : requiredRewardPointReached,
         };
        let cashDepositManage = await Sys.App.Services.TransactionServices.createCashDepositManage(depositData);

        return res.send({status: 'Success', response: paymentLinkData.short_url})

       //     res.send(paymentLinkData.short_url);

      }catch(error){
        //console.log(error);
        throw error;
      }




    //   payumoney.setKeys('BZljyBz9', 'xfSm7TuOAc', 'YszouLv9nm2C588JAajxKHsHq6cqabfekktc5mUlk3g=');
    //   payumoney.isProdMode(false); // production = true, test = false
    //   let player = await Sys.App.Services.PlayerServices.getSinglePlayerData({_id: req.body.playerId});
    //   if (!player) {
    //     return res.send({status: 'Error', response: "No Such Player Found"})
    //   }
    //   let data = {
    //     phone       : req.body.phone,
    //     amount      : req.body.amount,
    //     playerId    : player.id,
    //     firstname   : player.username,
    //     email       : req.body.email,
    //     productinfo : "RummyCash",
    //     type        : "Debit",
    //     surl        : req.headers.host+"/createTransaction/success",
    //     furl        : req.headers.host+"/createTransaction/failure",
    //     status      : 'Pending'
    //   };
    //   let transaction = await Sys.App.Services.TransactionServices.createTransaction(data);
    //   // data.txnid = transaction._id;
    //   if (!transaction) {
    //     return res.send({status: 'Error', response: "Something Went Wrong"});
    //   }
    //   var paymentData = {
    //       productinfo: data.productinfo,
    //       txnid: transaction._id.toString(),
    //       amount: data.amount,
    //       email: data.email,
    //       phone: data.phone,
    //       lastname: data.firstname,
    //       firstname: data.firstname,
    //       surl: "http://"+req.headers.host+"/createTransaction/success", //"http://localhost:3000/payu/success"
    //       furl: "http://"+req.headers.host+"/createTransaction/failure", //"http://localhost:3000/payu/fail"
    //   };

    //   payumoney.makePayment(paymentData, function(error, response) {
    //   if (error) {
    //     // Some error
    //     //console.log("--------------------------------------------------");
    //     //console.log('error',error);
    //     //console.log("--------------------------------------------------");
    //     return res.send({status: 'Error', response: "Something Went Wrong Regarding Payment Creation"});
    //   } else {
    //     // Payment redirection link
    //     //console.log(response);
    //     return res.send({status: 'Success', response: response})
    //   }
    // });

    },*/
    initiateTransaction: async function(req,res) {
      try{
        //console.log("req.body.:",req.body);
        let transacAmount = parseInt(req.body.amount * 100)
        let amount = parseInt(req.body.amount)

        if (amount < 100) {
          return res.send({status: 'Error', response: "Minimum Deposit should be 100 or Greater"})
        }
        let player = await Sys.App.Services.PlayerServices.getSinglePlayerData({_id: req.body.playerId});
          if (!player) {
            return res.send({status: 'Error', response: "No Such Player Found"})
          }
          let payment_data={
            playerId : req.body.playerId,
            name     : req.body.name,
            amount   : transacAmount,
            // amount   : parseInt(req.body.amount * 100),
            email    : req.body.email,
            phone    : req.body.phone,
          };

          let paymentLinkData = await Sys.App.Services.PaymentServices.getpaymentLink(payment_data);
          //console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~")
          //console.log("Order ID :",paymentLinkData.order_id);
          //console.log("Playment Data :",paymentLinkData.short_url);
          //console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~")

       let data = {
          phone       : req.body.phone,
          amount      : amount,
          playerId    : player.id,
          firstname   : player.username,
          email       : req.body.email,
          productinfo : "RummyCash",
          type        : "Debit",
          orderId     : paymentLinkData.order_id,
          paymentLink : paymentLinkData.short_url,
          status      : 'Pending',
          createdAt   : Date.now(),
           updatedAt   : Date.now(),

        };

        let transaction = await Sys.App.Services.TransactionServices.createTransaction(data);
        let lockCash = 0;
        let requiredRewardPoint = 0;
        // here comes the validation of promo code and calculation of lock/loyality points as per that.
        if (req.body.promoCode) {
          if (!amount || amount < 100) {
            return res.send({status: 'Error', response: "Deposit amount should be 100 or more"})
          }
          //console.log("###########################################################");
          //console.log("###########################################################");
          //console.log("data.promoCode", req.body.promoCode);
          //console.log("###########################################################");
          //console.log("###########################################################");
          // check for any previous deposits
          let previousDepositCount = await Sys.App.Services.TransactionServices.getDepositCount({ playerId: req.body.playerId, status: 'Success' });
          // if no deposit present then implement code of welcome
          //console.log('previousDepositCount', previousDepositCount);
          if (previousDepositCount == 0 && req.body.promoCode.toUpperCase() == 'WELCOME') {
            // 100-999 => get locked bonus, 25% of the value of deposit value
            // 1000-1999 => get locked bonus, 50% of the value of deposit value
            // 2000 or more => get locked bonus, 100% of amount but max 3000.
            let percentage = 0;
            if (amount > 99 && amount < 1000) {
              percentage = 25;
            }else if (amount > 999 && amount < 2000) {
              percentage = 50;
            }else if (amount > 1999) {
              percentage = 100;
            }
            lockCash = parseFloat((amount*percentage)/100);
            if (lockCash > 3000) {
              lockCash = 3000;
            }
          }
          // if single entry present then implment code of firsttopup
          else if (previousDepositCount == 1 && req.body.promoCode.toUpperCase() == 'FIRSTRECHARGE') {
            // get 50% of the amount but max 3000
            //console.log('FirstRechange');
            let percentage = 50;
            lockCash = parseFloat((amount*percentage)/100);
            if (lockCash > 3000) {
              lockCash = 3000;
            }
          }
          // if 2 or more entry is present then proceed as per the promo code present in the system(if it is a valid code)
          else {
            // put code for other promo code as per flow of promo code gets decided.
            // Check wether promocode is there and is valid(in terms of time).
            //console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%");
            //console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%");
            //console.log("beyond 3rd transaction with promocode", req.body.promoCode);
            let validPromoCode = await Sys.App.Services.PromocodeServices.getSinglePromocodeData({ code: req.body.promoCode, start_date : { $lt : Date.now()}, end_date : { $gt : Date.now()}  });
            if (validPromoCode) {
              // check wether promo code is used by player
              let validPromoCodeUsed = 0
              validPromoCodeUsed = await Sys.App.Services.PromocodeServices.getHistoryCount({ promocode: req.body.promoCode, playerId : req.body.playerId  });
              if (validPromoCodeUsed < validPromoCode.individual_usage_limit) {
                let percentage = validPromoCode.offer;
                lockCash = parseFloat((amount*percentage)/100);
                if (lockCash > validPromoCodeUsed.maximum_offer) {
                  lockCash = validPromoCodeUsed.maximum_offer;
                }
              }else {
                return res.send({status: 'Error', response: "Promo Code Already Used Maximum Times"})
              }
            }else {
              return res.send({status: 'Error', response: "No Such Valid promoCode Found"})
            }
          }
          //console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
          //console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
          //console.log("transaction._id", paymentLinkData.order_id);
          await Sys.App.Services.PromocodeServices.createPromoApplyHistory({
            playerId          : req.body.playerId,
            promocode         : req.body.promoCode,
            transactionNumber : paymentLinkData.order_id,
            offeredChips      : lockCash
          });

        }

        /*====================== Start Refferal Code Logic =============================*/
          if (player && player.signupReferralCode) {
             //get refferal code player details
             let refferal_player = await Sys.App.Services.PlayerServices.getSinglePlayerData({myReferralCode: player.signupReferralCode});
             if (refferal_player) {
               //count Player Deposite count
               let previousDepositCount = await Sys.App.Services.TransactionServices.getDepositCount({ playerId: req.body.playerId, status: 'Success' });
                // if no deposit present then implement code of refferal
                //console.log('previousDepositCount', previousDepositCount);
                //if count == 0
                if (previousDepositCount == 0) {
                  let previousInstanceBonusDepositCount = await Sys.App.Services.TransactionServices.getInstanceBonusDepositCount({ refferalPlayerId: refferal_player._id, status: 'Success' });
                  let refferal_percentage = 0;
                  if (previousInstanceBonusDepositCount == 0 || previousInstanceBonusDepositCount == 1) {
                    refferal_percentage = 5;
                  }
                  if (previousInstanceBonusDepositCount == 2 || previousInstanceBonusDepositCount == 3) {
                    refferal_percentage = 10;
                  }
                  if (previousInstanceBonusDepositCount == 4 || previousInstanceBonusDepositCount == 5 || previousInstanceBonusDepositCount == 6) {
                    refferal_percentage = 15;
                  }
                  if (previousInstanceBonusDepositCount == 7 || previousInstanceBonusDepositCount == 8) {
                    refferal_percentage = 20;
                  }
                  if (previousInstanceBonusDepositCount >= 9) {
                    refferal_percentage = 25;
                  }
                  let refferal_amount = parseFloat((amount*refferal_percentage)/100);
                  let refferal_deposit_data = {
                    playerId : req.body.playerId,
                    refferalPlayerId : refferal_player._id,
                    refferalCode : player.signupReferralCode,
                    transactionId: paymentLinkData.order_id,
                    refferalBonus : refferal_amount,
                    status       : 'Pending'
                  }
                  await Sys.App.Services.TransactionServices.createInstanceBonusDepositManage(refferal_deposit_data);
                }
             } 
          }
        /*=================  End Refferal Code Logic ==================*/
        // if Player is getting some lock bonus/points then calculate requiredRewardPoint
        if (lockCash > 0) {
          requiredRewardPoint = parseFloat(amount/10);
        }
        let requiredRewardPointReached = true;
        if (parseFloat(requiredRewardPoint) != 0) {
          requiredRewardPointReached = false;
        }
        let cashManager = await Sys.App.Services.TransactionServices.getPlayerCashData({ playerId : req.body.playerId });
        //console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
        //console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
        //console.log("transaction._id", paymentLinkData.order_id);
        let rr;
        if (cashManager && cashManager.requiredRewardPoint) {
          rr = parseFloat(cashManager.requiredRewardPoint) + parseFloat(requiredRewardPoint);
        }
        else{
          rr = parseFloat(requiredRewardPoint); 
        }
        let depositData = {
           playerId                       : req.body.playerId,
           transactionId                  : paymentLinkData.order_id,
           depositCash                    : amount,
           lockCash                       : lockCash,
           requiredRewardPoint            : rr,
           status                         : 'Pending',
           requiredRewardPointReached     : requiredRewardPointReached,
         };
        let cashDepositManage = await Sys.App.Services.TransactionServices.createCashDepositManage(depositData);
        return res.send({status: 'Success', response: paymentLinkData.short_url});
      }catch(error){
        //console.log(error);
        throw error;
      }
    },
    paymentTransaction: async function(req,res) {
      try{
        //console.log("req.body.:",req.body);
        let transacAmount = parseInt(req.body.amount * 100)
        let amount = parseInt(req.body.amount)
        if (req.body.payment_type === undefined || req.body.payment_type === null || req.body.payment_type == "") {
          req.body.payment_type = "razorpay"
        }
        if (amount < 100) {
          return res.send({status: 'Error', response: "Minimum Deposit should be 100 or Greater"})
        }
        if (amount > 25000) {
          return res.send({status: 'Error', response: "Maximum Deposit per day should be 25000 or less."})
        }
        let player = await Sys.App.Services.PlayerServices.getSinglePlayerData({_id: req.body.playerId});
          if (!player) {
            return res.send({status: 'Error', response: "No Such Player Found"})
          }
          var TransactionLimit_per_day_cond =  {$and: 
                [
                  {playerId: req.body.playerId,status:"paid"},
                  { 
                   "updatedAt" : 
                      {     
                          $gte:   new Date(new Date().setHours(00,00,00)) ,     
                          $lt :  new Date(new Date().setHours(23,59,59)) 
                     } 
                  }
                ]
        }
        console.log("TransactionLimit_per_day_cond : ",TransactionLimit_per_day_cond);
         let TransactionLimitPerDayData = await Sys.App.Services.TransactionServices.getByData(TransactionLimit_per_day_cond);
         if (TransactionLimitPerDayData.length > 0) {
            var transaction_total = 0;
            TransactionLimitPerDayData.map(item => {
              transaction_total = transaction_total + item.amount;
            });
            if (transaction_total > 25000) {
               return res.send({status: 'Error', response: "Maximum Deposit per day should be 25000 or less."})
            }
            transaction_total = transaction_total + amount;
            if (transaction_total > 25000) {
               return res.send({status: 'Error', response: "Maximum Deposit per day should be 25000 or less."})
            }
         } 
          const currentdate = new Date();
          const firstDayofCurrentMonth = new Date(currentdate.getFullYear(), currentdate.getMonth(), 1);
          const lastDayofCurrentMonth = new Date(currentdate.getFullYear(), currentdate.getMonth() + 1, 0);   
         var TransactionLimit_per_month_cond =  {$and: 
                [
                  {playerId: req.body.playerId,status:"paid"},
                  { 
                   "updatedAt" : 
                      {     
                          $gte:   firstDayofCurrentMonth ,     
                          $lt :  lastDayofCurrentMonth 
                     } 
                  }
                ]
        }
        console.log("TransactionLimit_per_month_cond : ",TransactionLimit_per_month_cond);
        let TransactionLimitPerMonthData = await Sys.App.Services.TransactionServices.getByData(TransactionLimit_per_month_cond);
         if (TransactionLimitPerMonthData.length > 0) {
            var transaction_total = 0;
            TransactionLimitPerMonthData.map(item => {
              transaction_total = transaction_total + item.amount;
            });
            if (transaction_total > 250000) {
               return res.send({status: 'Error', response: "Maximum Deposit per month should be 250000 or less."})
            }
            transaction_total = transaction_total + amount;
            if (transaction_total > 250000) {
               return res.send({status: 'Error', response: "Maximum Deposit per month should be 250000 or less."})
            }
         }    
          let paymentLinkData;
          let payment_data ;
          let order_data ;
          if (req.body.payment_type && req.body.payment_type == "paytm") {
            payment_data={
              amount   : amount
            };
            paymentLinkData = await Sys.App.Services.PaymentServices.getpaytmpaymentLink(payment_data);
            //console.log("LINK_DATA : ",paymentLinkData);
            order_data = paymentLinkData.order_id;
            let data = {
                phone       : req.body.phone,
                amount      : amount,
                playerId    : player.id,
                firstname   : player.username,
                email       : req.body.email,
                productinfo : "RummyCash",
                type        : "Debit",
                orderId     : paymentLinkData.order_id,
                paymentLink : paymentLinkData.short_url,
                status      : 'Pending',
                createdAt   : Date.now(),
                updatedAt   : Date.now(),
                //for paytm
                payment_type:req.body.payment_type,
                CHECKSUMHASH:paymentLinkData.CHECKSUMHASH
              };

              let transaction = await Sys.App.Services.TransactionServices.createTransaction(data);

          }else{
            payment_data={
              playerId : req.body.playerId,
              name     : req.body.name,
              amount   : transacAmount,
              // amount   : parseInt(req.body.amount * 100),
              email    : req.body.email,
              phone    : req.body.phone,
            };

            paymentLinkData = await Sys.App.Services.PaymentServices.getpaymentLink(payment_data);
            order_data = paymentLinkData.order_id;
            //console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~")
            //console.log("Order ID :",paymentLinkData.order_id);
            //console.log("Playment Data :",paymentLinkData.short_url);
            //console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
            let data = {
                phone       : req.body.phone,
                amount      : amount,
                playerId    : player.id,
                firstname   : player.username,
                email       : req.body.email,
                productinfo : "RummyCash",
                type        : "Debit",
                orderId     : paymentLinkData.order_id,
                paymentLink : paymentLinkData.short_url,
                status      : 'Pending',
                createdAt   : Date.now(),
                 updatedAt   : Date.now(),

              };

              let transaction = await Sys.App.Services.TransactionServices.createTransaction(data);
          }

          let lockCash = 0;
          let requiredRewardPoint = 0;
          // here comes the validation of promo code and calculation of lock/loyality points as per that.
          if (req.body.promoCode) {
            if (!amount || amount < 100) {
              return res.send({status: 'Error', response: "Deposit amount should be 100 or more"})
            }
            //console.log("###########################################################");
            //console.log("###########################################################");
            //console.log("data.promoCode", req.body.promoCode);
            //console.log("###########################################################");
            //console.log("###########################################################");
            // check for any previous deposits
            let previousDepositCount = await Sys.App.Services.TransactionServices.getDepositCount({ playerId: req.body.playerId, status: 'Success' });
            // if no deposit present then implement code of welcome
            //console.log('previousDepositCount', previousDepositCount);
            if (previousDepositCount == 0 && req.body.promoCode.toUpperCase() == 'WELCOME') {
              // 100-999 => get locked bonus, 25% of the value of deposit value
              // 1000-1999 => get locked bonus, 50% of the value of deposit value
              // 2000 or more => get locked bonus, 100% of amount but max 3000.
              let percentage = 0;
              if (amount > 99 && amount < 1000) {
                percentage = 25;
              }else if (amount > 999 && amount < 2000) {
                percentage = 50;
              }else if (amount > 1999) {
                percentage = 100;
              }
              lockCash = parseFloat((amount*percentage)/100);
              if (lockCash > 3000) {
                lockCash = 3000;
              }
            }
            // if single entry present then implment code of firsttopup
            else if (previousDepositCount == 1 && req.body.promoCode.toUpperCase() == 'FIRSTRECHARGE') {
              // get 50% of the amount but max 3000
              //console.log('FirstRechange');
              let percentage = 50;
              lockCash = parseFloat((amount*percentage)/100);
              if (lockCash > 3000) {
                lockCash = 3000;
              }
            }
            // if 2 or more entry is present then proceed as per the promo code present in the system(if it is a valid code)
            else {
              // put code for other promo code as per flow of promo code gets decided.
              // Check wether promocode is there and is valid(in terms of time).
              //console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%");
              //console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%");
              //console.log("beyond 3rd transaction with promocode", req.body.promoCode);
              let validPromoCode = await Sys.App.Services.PromocodeServices.getSinglePromocodeData({ code: req.body.promoCode, start_date : { $lt : Date.now()}, end_date : { $gt : Date.now()}  });
              if (validPromoCode) {
                // check wether promo code is used by player
                let validPromoCodeUsed = 0
                validPromoCodeUsed = await Sys.App.Services.PromocodeServices.getHistoryCount({ promocode: req.body.promoCode, playerId : req.body.playerId  });
                if (validPromoCodeUsed < validPromoCode.individual_usage_limit) {
                  let percentage = validPromoCode.offer;
                  lockCash = parseFloat((amount*percentage)/100);
                  if (lockCash > validPromoCodeUsed.maximum_offer) {
                    lockCash = validPromoCodeUsed.maximum_offer;
                  }
                }else {
                  return res.send({status: 'Error', response: "Promo Code Already Used Maximum Times"})
                }
              }else {
                return res.send({status: 'Error', response: "No Such Valid promoCode Found"})
              }
            }
            //console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
            //console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
            ////console.log("transaction._id", paymentLinkData.order_id);
            await Sys.App.Services.PromocodeServices.createPromoApplyHistory({
              playerId          : req.body.playerId,
              promocode         : req.body.promoCode,
              transactionNumber : paymentLinkData.order_id,
              offeredChips      : lockCash
            });

          }

          /*====================== Start Refferal Code Logic =============================*/
            if (player && player.signupReferralCode) {
               //get refferal code player details
               let refferal_player = await Sys.App.Services.PlayerServices.getSinglePlayerData({myReferralCode: player.signupReferralCode});
               if (refferal_player) {
                 //count Player Deposite count
                 let previousDepositCount = await Sys.App.Services.TransactionServices.getDepositCount({ playerId: req.body.playerId, status: 'Success' });
                  // if no deposit present then implement code of refferal
                  //console.log('previousDepositCount', previousDepositCount);
                  //if count == 0
                  if (previousDepositCount == 0) {
                    let previousInstanceBonusDepositCount = await Sys.App.Services.TransactionServices.getInstanceBonusDepositCount({ refferalPlayerId: refferal_player._id, status: 'Success' });
                    let refferal_percentage = 0;
                    if (previousInstanceBonusDepositCount == 0 || previousInstanceBonusDepositCount == 1) {
                      refferal_percentage = 5;
                    }
                    if (previousInstanceBonusDepositCount == 2 || previousInstanceBonusDepositCount == 3) {
                      refferal_percentage = 10;
                    }
                    if (previousInstanceBonusDepositCount == 4 || previousInstanceBonusDepositCount == 5 || previousInstanceBonusDepositCount == 6) {
                      refferal_percentage = 15;
                    }
                    if (previousInstanceBonusDepositCount == 7 || previousInstanceBonusDepositCount == 8) {
                      refferal_percentage = 20;
                    }
                    if (previousInstanceBonusDepositCount >= 9) {
                      refferal_percentage = 25;
                    }
                    let refferal_amount = parseFloat((amount*refferal_percentage)/100);
                    let refferal_deposit_data = {
                      playerId : req.body.playerId,
                      refferalPlayerId : refferal_player._id,
                      refferalCode : player.signupReferralCode,
                      transactionId: paymentLinkData.order_id,
                      refferalBonus : refferal_amount,
                      status       : 'Pending'
                    }
                    await Sys.App.Services.TransactionServices.createInstanceBonusDepositManage(refferal_deposit_data);
                  }
               } 
            }
          /*=================  End Refferal Code Logic ==================*/
          // if Player is getting some lock bonus/points then calculate requiredRewardPoint
          if (lockCash > 0) {
            requiredRewardPoint = parseFloat(amount/10);
          }
          let requiredRewardPointReached = true;
          if (parseFloat(requiredRewardPoint) != 0) {
            requiredRewardPointReached = false;
          }
          let cashManager = await Sys.App.Services.TransactionServices.getPlayerCashData({ playerId : req.body.playerId });
          //console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
          //console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
          ////console.log("transaction._id", paymentLinkData.order_id);
          let rr;
          if (cashManager && cashManager.requiredRewardPoint) {
            rr = parseFloat(cashManager.requiredRewardPoint) + parseFloat(requiredRewardPoint);
          }
          else{
            rr = parseFloat(requiredRewardPoint); 
          }
          let depositData = {
             playerId                       : req.body.playerId,
             transactionId                  : paymentLinkData.order_id,
             depositCash                    : amount,
             lockCash                       : lockCash,
             requiredRewardPoint            : rr,
             status                         : 'Pending',
             requiredRewardPointReached     : requiredRewardPointReached,
           };
          let cashDepositManage = await Sys.App.Services.TransactionServices.createCashDepositManage(depositData);  
          return res.send({status: 'Success', response: paymentLinkData.short_url});
          
          // if (req.body.payment_type && req.body.payment_type == "paytm") {
          //   paymentLinkData.payment_type=req.body.payment_type;
          //   // return res.send({status: 'Success', 
          //   //                 response: Sys.Config.App.paytm_test.PAYTM_FINAL_URL,
          //   //                 data:paymentLinkData
          //   //               });
          //   return res.send({status: 'Success', response: paymentLinkData.short_url});
          // }else{
          //   //let data = {payment_type:req.body.payment_type}
          //   return res.send({status: 'Success', 
          //                   response: paymentLinkData.short_url,
          //                   data:{payment_type:req.body.payment_type}
          //                 });
          // }
       
        // let lockCash = 0;
        // let requiredRewardPoint = 0;
        
        // // if Player is getting some lock bonus/points then calculate requiredRewardPoint
        // if (lockCash > 0) {
        //   requiredRewardPoint = parseFloat(amount/10);
        // }
        // let requiredRewardPointReached = true;
        // if (parseFloat(requiredRewardPoint) != 0) {
        //   requiredRewardPointReached = false;
        // }
        // let cashManager = await Sys.App.Services.TransactionServices.getPlayerCashData({ playerId : req.body.playerId });
        // //console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
        // //console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
        // //console.log("transaction._id", paymentLinkData.ORDER_ID);
        // let rr;
        // if (cashManager && cashManager.requiredRewardPoint) {
        //   rr = parseFloat(cashManager.requiredRewardPoint) + parseFloat(requiredRewardPoint);
        // }
        // else{
        //   rr = parseFloat(requiredRewardPoint); 
        // }
        // let depositData = {
        //    playerId                       : req.body.playerId,
        //    transactionId                  : paymentLinkData.ORDER_ID,
        //    depositCash                    : amount,
        //    lockCash                       : lockCash,
        //    requiredRewardPoint            : rr,
        //    status                         : 'Pending',
        //    requiredRewardPointReached     : requiredRewardPointReached,
        //  };
        // let cashDepositManage = await Sys.App.Services.TransactionServices.createCashDepositManage(depositData);
        //return res.send({status: 'Success', response: paymentLinkData.process_transaction_url,data:paymentLinkData});
      }catch(error){
        //console.log(error);
        throw error;
      }
    },

    paymentStatus: async function(req,res){
            try {
                var data = {
                        App : Sys.Config.App.details,
                        error: req.flash("error"),
                        success: req.flash("success")
                    };
                    return res.render('transactions/status',data);
            } catch (e) {
                //console.log("Error",e);
            }
        },

    successTransaction: async function(req,res){
      //console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&");
      //console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&");
      //console.log("req.body.txnid.", req.body.txnid);
      //console.log("req.body.", req.body);
      //console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&");
      //console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&");
      let data = {
        // mihpayid            : req.body.mihpayid,
        // hash                : req.body.hash,
        // encryptedPaymentId  : req.body.encryptedPaymentId,
        // bank_ref_num        : req.body.bank_ref_num,
        // payuMoneyId         : req.body.payuMoneyId,
        status              : 'Success'
      }
      let transaction = await Sys.App.Services.TransactionServices.updateTransaction({orderId : req.body.txnid}, data);
      let transactionDone = await Sys.App.Services.TransactionServices.getSingleTransaction({orderId : req.body.txnid});
      let transactionPlayer = await Sys.App.Services.PlayerServices.getSinglePlayerData({_id : transactionDone.playerId});
      //console.log('-------------------------------------------------------------');
      //console.log('transactionPlayer',transactionPlayer);
      //console.log('transactionDone',transactionDone);
      // //console.log('(parseInt(transactionPlayer.cash)+transactionDone.amount).toString()', (parseInt(transactionPlayer.cash)+transactionDone.amount).toString());
      //console.log('-------------------------------------------------------------');
      // return false;

      // update deposit entry Manager
      await Sys.App.Services.TransactionServices.updateManageDeposit({ transactionId : req.body.txnid }, { status : "Success"});
      let depositData = await Sys.App.Services.TransactionServices.getSingleDeposit({ transactionId : req.body.txnid });
      let cashManager = await Sys.App.Services.TransactionServices.getPlayerCashData({ playerId : depositData.playerId });

      let updatedCash = parseFloat(cashManager.totalCash) + parseFloat(depositData.depositCash) ;
      let newWithdrawLimit = parseFloat(cashManager.withdrawLimit);
      if (depositData.lockCash == 0) {
        newWithdrawLimit = newWithdrawLimit + parseFloat(depositData.depositCash);
      }

      let cashManageData = {
        totalCash               : updatedCash ,
        depositedCash           : parseFloat(cashManager.depositedCash) + parseFloat(depositData.depositCash) ,
        lockCash                : cashManager.lockCash + parseFloat(depositData.lockCash) ,
        withdrawLimit           : newWithdrawLimit  ,
        requiredRewardPoint     : parseFloat(depositData.requiredRewardPoint)  ,
        // requiredRewardPoint     : parseFloat(cashManager.requiredRewardPoint) + parseFloat(depositData.requiredRewardPoint)  ,
      }
      // update Cash Manager
      await Sys.App.Services.TransactionServices.updateCashManager({ playerId : depositData.playerId }, cashManageData );

      await Sys.App.Services.PlayerServices.updatePlayerData(
        {
          _id: transactionDone.playerId
        },{
          cash: updatedCash.toString(),
          // cash: (parseInt(transactionPlayer.cash)+transactionDone.amount).toString(),
        }
      )

      // MaintainChips History
      let chipsHistory = await Sys.App.Services.ChipsHistoryServices.insertChipsData({
        user_id             : transactionDone.playerId,
        username            : transactionPlayer.username,
        chips               : transactionDone.amount,
        type                : "Debit",
        reason              : "User Deposit",
        isValid             : "Yes",
        transactionNumber   : req.body.txnid,
        previousBalance     : parseInt(transactionPlayer.cash),
        afterBalance        : parseInt(transactionPlayer.cash)+transactionDone.amount,
      });

      // //console.log(req.body);
      return res.send('<h1>Your Payment is been done Successfully</h1>');
    },

    failureTransaction: async function(req,res){
      let data = {
        status : 'Fail'
      }
      let transaction = await Sys.App.Services.TransactionServices.updateTransaction({_id : req.body.txnid}, data);
      await Sys.App.Services.TransactionServices.updateManageDeposit({ transactionId : req.body.txnid }, { status : "Failed"});
      return res.send('<h1>Your Payment is been Failed</h1>');
    },

    transactionHistory: async function(req, res){
        try{
          var data = {
            App : Sys.Config.App.details,
            error: req.flash("error"),
            success: req.flash("success"),
            transactionHistoryMenu : 'active',
          };
          return res.render('transactions/transaction-history',data);
        }catch (e){
          //console.log("Error",e);
        }
    },

    getTransactionHistory: async function(req, res){
        try{

           let start = parseInt(req.query.start);
           let length = parseInt(req.query.length);
           let search = req.query.search.value;
           let query = {};
           if (search != '') {
             query = { email: { $regex: '.*' + search + '.*' }};
           }
           if(req.query.is_date_search == "yes" && search == '' )
           {
             query = {  createdAt:{$gte: req.query.start_date, $lt: req.query.end_date} };
           }
           if(req.query.is_date_search == "yes" && search != '' )
           {
             query = { email: { $regex: '.*' + search + '.*' }, createdAt:{$gte: req.query.start_date, $lt: req.query.end_date} };
           }
           //console.log(query);
           let transactionC = await Sys.App.Services.TransactionServices.getByData(query);
           let transactionCount = transactionC.length;
           let data = await Sys.App.Services.TransactionServices.getTransactionDatatable(query, length, start);
        /*
           for(var m= 0; m < data.length; m++ ){
             let dt = new Date(data[m].createdAt);
             ////console.log("created at", moment(dt).format('YYYY/MM/DD'));
             data[m].createdAt =moment(dt).format('YYYY/MM/DD');

           }*/
           ////console.log("all game data",data.length);
           var obj = {
            'draw': req.query.draw,
            'recordsTotal': transactionCount,
            'recordsFiltered': transactionCount,
            'data': data
          };
          res.send(obj);
        }catch(e){
          //console.log(e);
        }
    },
    getPlayerTransactionHistory: async function(req, res){
        try{

           let transactionC = await Sys.App.Services.TransactionServices.getByData({playerId:req.params.id});
           let transactionCount = transactionC.length;
           var obj = {
            'recordsTotal': transactionCount,
            'data': transactionC
          };
          res.send(obj);
        }catch(e){
          //console.log(e);
        }
    },
    checkPaymentInfo: async function(req, res){
      //console.log("Called .........");
        try{
          // res.send(moment(new Date()).format('DD'));
          // return false;
            //find the recoed which is pending and record created in 30 mins
            var thrteenMinuteOld = new Date();
            //console.log( "created at", moment(new Date()).format('YYYY/MM/DD, H:mm:ss ') );

            thrteenMinuteOld.setMinutes(thrteenMinuteOld.getMinutes()-30);
           //console.log( "created at", moment(thrteenMinuteOld).format('YYYY/MM/DD, H:mm:ss ') );
           //console.log("&&&&&&&&&&&&&&&&&&&&&&");
           //console.log(new Date(thrteenMinuteOld));

            let pendingTransactions = await Sys.App.Services.TransactionServices.getByData({ status:'Pending' });

            //console.log("######################################################");
            //console.log(pendingTransactions.length);
            //console.log("######################################################");
            let updatePaymentData = await Sys.App.Services.PaymentServices.updatePaymentStatus(pendingTransactions);

            let expiredTransactions = [];
            for (var i = 0; i < pendingTransactions.length; i++) {

              // res.send(moment(new Date(pendingTransactions[i].createdAt)).format('DD'));
              if ( moment(new Date(pendingTransactions[i].createdAt)).format('DD') != moment(new Date()).format('DD') && moment(new Date(pendingTransactions[i].createdAt)).format('DD') != parseInt(parseInt(moment(new Date()).format('DD'))-1) ) {
                //console.log("pendingTransactions[i].createdAt)).format('DD')", moment(new Date(pendingTransactions[i].createdAt)).format('DD')  );
                //console.log("moment(new Date()).format('DD')", moment(new Date()).format('DD') );
                expiredTransactions.push(pendingTransactions[i])
                // //console.log("Pushed");
              }
            }
            // //console.log("Pushed1");
            let cancelPaymentStatus =await Sys.App.Services.PaymentServices.cancelPaymentStatus(expiredTransactions)
            // //console.log("Pushed2");
            // res.send("Done")
            // return false;



            // return false;

            //cancel status of expired record (expired time == 30 min)
            // let expiredTransactions = await Sys.App.Services.TransactionServices.getByData({status:'Pending',createdAt:{$lt: thrteenMinuteOld}});
            //
            // let cancelPaymentStatus =await Sys.App.Services.PaymentServices.cancelPaymentStatus(expiredTransactions)
          //  res.send(updatePaymentData);
          return res.send("Done");
        }catch(error){
            //console.log(error);
            return new Error("Error", error);
        }

    },
    

}
