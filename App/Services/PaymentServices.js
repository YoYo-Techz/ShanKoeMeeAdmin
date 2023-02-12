
 'use strict';
 var Sys = require('../../Boot/Sys');
 const checksum = require('../../Checksum/checksum');
 const shortid = require('shortid');
 var moment = require('moment');
const https = require('https')
 const razorPay = require('razorpay');
 var instanceStagin = new razorPay({
   key_id: 'rzp_test_9sOsw6AHDUJfec', //
   key_secret: 'PgaQPlVgpckj69qbwbSRBRs7'
 });

 // Live


 var instance = new razorPay({
    key_id: 'rzp_live_rRcSpFhZIpyc6j', //
    key_secret: '0C8e9mPcuxgRedtj8UaAlTXx'

  });


 module.exports = {

    getpaymentLink: async function(data){
        try{
            let d = new Date();
            let expiry = Math.floor( d.setMinutes(d.getMinutes() + 18) /1000 );
            //console.log(expiry);  //unix epoc time
            let params ={
            "customer": {
                "name": data.name,
                "email": data.email,
                "contact": data.phone
            },
            "type": "link",
            "view_less": 1,
            "amount": data.amount,
            "currency": "INR",
            "description": "The Rummy Round",
            "expire_by": expiry,
            "sms_notify": 0,
            "email_notify": 0,
            }

           return await instance.invoices.create(params);

     }catch(error){
       //console.log("Error in Pay ",error);
       return new Error('Pay Error ',error);

     }
    },
    getpaytmpaymentLink: async function(data){
        try{
          //console.log("payTm_configs : ",Sys.Config.App.paytm_test);
           
            return new Promise((resolve, reject) => {
              // let orderid = shortid.generate();
              //   let paymentObj = {
              //     ORDER_ID: "order_"+orderid,
              //     CUST_ID: "order_"+orderid,
              //     INDUSTRY_TYPE_ID: Sys.Config.App.paytm_test.INDUSTRY_TYPE_ID,
              //     CHANNEL_ID: Sys.Config.App.paytm_test.CHANNEL_ID,
              //     TXN_AMOUNT: data.amount.toString(),
              //     MID: Sys.Config.App.paytm_test.MID,
              //     WEBSITE: Sys.Config.App.paytm_test.WEBSITE,
              //     CALLBACK_URL: Sys.Config.App.paytm_test.CALLBACK_URL
              //   };

              // checksum.genchecksum(
              //   paymentObj,
              //   Sys.Config.App.paytm_test.MKEY,
              //   (err, result) => {
              //     if (err) {
              //       return reject('Error while generating checksum');
              //     } else {
              //       paymentObj.CHECKSUMHASH = result;
              //       paymentObj.process_transaction_url = Sys.Config.App.paytm_test.PAYTM_FINAL_URL;
              //       return resolve(paymentObj);
              //     }
              //   }
              // );
              /* initialize an object */
              var paytmParams = {};
              var date = moment();
              //console.log(date);
              var expiry = date.add(32, 'minutes').format('DD/MM/YYYY HH:mm:ss');// it will add 11 mins in the current time and will give time in 03:35 PM format; can use m or minutes 
              //console.log(expiry);
              /* body parameters */
              paytmParams.body = {

                  /* Find your MID in your Paytm Dashboard at https://dashboard.paytm.com/next/apikeys */
                  "mid" : Sys.Config.App.paytm_test.MID,

                  /* Possible value are "GENERIC", "FIXED", "INVOICE" */
                  "linkType" : "FIXED",

                   /* Enter your choice of payment link description here, special characters are not allowed */
                  "linkDescription" : "You requested payment of "+parseFloat(data.amount),

                  /* Enter your choice of payment link name here, special characters and spaces are not allowed */
                  "linkName" : "TheRummyRound",
                  "amount":parseFloat(data.amount),
                  "expiryDate":expiry,
                  "sendSms":true
              };

              //console.log("paytmParams.body : ",paytmParams.body);
              /**
              * Generate checksum by parameters we have in body
              * Find your Merchant Key in your Paytm Dashboard at https://dashboard.paytm.com/next/apikeys 
              */
              checksum.genchecksumbystring(JSON.stringify(paytmParams.body), Sys.Config.App.paytm_test.MKEY, function(err, result){

                  /* head parameters */
                  paytmParams.head = {

                      /* This will be AES */
                      "tokenType" : "AES",

                      /* put generated checksum value here */
                      "signature" : result
                  };
                  //console.log("paytmParams.head : ",paytmParams.head);
                  /* prepare JSON string for request */
                  var post_data = JSON.stringify(paytmParams);

                  var options = {

                      /* for Staging */
                      //hostname: 'securegw-stage.paytm.in',

                      /* for Production */
                       hostname: 'securegw.paytm.in',

                      port: 443,
                      path: '/link/create',
                      method: 'POST',
                      headers: {
                          'Content-Type': 'application/json',
                          'Content-Length': post_data.length
                      }
                  };

                  // Set up the request
                  var response = "";
                  var post_req = https.request(options, function(post_res) {
                      post_res.on('data', function (chunk) {
                          response += chunk;
                      });

                      post_res.on('end', function(){
                          let paytm_Response = JSON.parse(response);
                          //console.log('PAYTM_Response: ', paytm_Response);
                          //console.log('PAYTM_Response: ', paytm_Response.body.linkId);
                          //console.log('PAYTM_Response: ', paytm_Response.body.shortUrl);
                          let payment_Obj = {
                            order_id :paytm_Response.body.linkId,
                            short_url:paytm_Response.body.shortUrl,
                            CHECKSUMHASH:result
                          }
                          return resolve(payment_Obj);
                      });
                  });

                  // post the data
                  post_req.write(post_data);
                  post_req.end();
              });
            });
     }catch(error){
       //console.log("Error in Pay ",error);
       return new Error('PayTm Error ',error);

     }
    },
    //only old razorPay update payment status
    /*updatePaymentStatus: async function(data){
        try{


            for(let order of data){
              // //console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
              // //console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
              // //console.log("order", order);
              // //console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
              // //console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
              
                let getOrderDetails=await instance.orders.fetchPayments(order.orderId);
                // //console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
                // //console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
                // //console.log("order", getOrderDetails);
                // //console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
                // //console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
                // //console.log("order.orderId", order.orderId);
                if(getOrderDetails.items.length > 0 ){
                    //console.log("getOrderDetails.items[0].status :",getOrderDetails.items[0].status)
                    if(getOrderDetails.items[0].status == 'captured')
                    {
                        let orderData ={
                            status: 'paid',
                            paymentId:getOrderDetails.items[0].id,
                        };
                        //console.log("amount",getOrderDetails.items[0]);
                        let amountPaid=parseFloat(getOrderDetails.items[0].amount)/100;

                         let updateStatus=await Sys.App.Services.TransactionServices.updateTransaction({_id: order.id }, orderData);
                         let getPlayer=await Sys.App.Services.PlayerServices.getPlayerData({_id: order.playerId});

                         let instanceBonusManager = await Sys.App.Services.TransactionServices.getSingleInstanceBonusDeposit({ transactionId: order.orderId });
                         if (instanceBonusManager) {
                           let referTransaction = await Sys.App.Services.TransactionServices.updateInstanceBonusManageDeposit({ transactionId : order.orderId }, { status : "Success"});
                           let refferalPlayer=await Sys.App.Services.PlayerServices.getPlayerData({_id: instanceBonusManager.refferalPlayerId});
                           let updatedInstanceBonus = (refferalPlayer.instance_bonus) ? parseFloat(refferalPlayer.instance_bonus) : 0 + (instanceBonusManager.refferalBonus) ? parseFloat(instanceBonusManager.refferalBonus) : 0;
                           await Sys.App.Services.PlayerServices.updatePlayerData(
                             {
                               _id: instanceBonusManager.refferalPlayerId
                             },{
                               instance_bonus: updatedInstanceBonus.toString(),
                             }
                           )
                         }
                         
                         //~ update deposit entry Manager
                         await Sys.App.Services.TransactionServices.updateManageDeposit({ transactionId : order.orderId }, { status : "Success"});
                         //Instance Bonus Deposite Manager
                         
                         let depositData = await Sys.App.Services.TransactionServices.getSingleDeposit({ transactionId : order.orderId });
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
                             _id: depositData.playerId
                           },{
                             cash: updatedCash.toString(),
                             // cash: (parseInt(transactionPlayer.cash)+transactionDone.amount).toString(),
                           }
                         )

                        //~





                        // let playerData={
                        //     cash:parseFloat(getPlayer[0].cash) + amountPaid,
                        //
                        //  };
                        // let updatepalyersChips =await Sys.App.Services.PlayerServices.updatePlayerData({_id: order.playerId}, playerData);

                        let getPlayerUserName = await Sys.App.Services.PlayerServices.getSinglePlayerData({_id: order.playerId});

                        let insertChips = {
                            playerId : order.playerId,
                            userName :getPlayerUserName.username,
                            cash :     amountPaid,
                            message :  'Added By Payment Through RazorPay',
                            transactionNumber : getOrderDetails.items[0].id,
                            beforeBalance : parseFloat(getPlayer[0].cash),
                            afterBalance  : parseFloat(getPlayer[0].cash) + amountPaid,
                            status :       'success',
                            gameType : '',
                            tableType : '',
                            tranType : 'cash',

                        }
                        let addPlayerChipsCashHistory =await Sys.App.Services.playerChipsCashHistoryService.insertChipsData(insertChips);

                    }else if (getOrderDetails.items[0].status == 'failed') {
                      let cancelData ={
                                  status: 'Cancel',
                      };
                      await Sys.App.Services.TransactionServices.updateTransaction({_id: order.id }, cancelData);
                    }
                }
            }
            return data;

        }catch(error){
            //console.log(error);
            return new Error("Error", error);
        }

    },*/
    updatePaymentStatus: async function(data){
        try{


            for(let order of data){
              // //console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
              // //console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
              // //console.log("order", order);
              // //console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
              // //console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
              
              if (order && order.payment_type === undefined) {
                let getOrderDetails=await instance.orders.fetchPayments(order.orderId);
                // //console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
                // //console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
                // //console.log("order", getOrderDetails);
                // //console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
                // //console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
                // //console.log("order.orderId", order.orderId);
                if(getOrderDetails.items.length > 0 ){
                    //console.log("getOrderDetails.items[0].status :",getOrderDetails.items[0].status)
                    if(getOrderDetails.items[0].status == 'captured')
                    {
                        let orderData ={
                            status: 'paid',
                            paymentId:getOrderDetails.items[0].id,
                        };
                        //console.log("amount",getOrderDetails.items[0]);
                        let amountPaid=parseFloat(getOrderDetails.items[0].amount)/100;

                         let updateStatus=await Sys.App.Services.TransactionServices.updateTransaction({_id: order.id }, orderData);
                         let getPlayer=await Sys.App.Services.PlayerServices.getPlayerData({_id: order.playerId});

                         let instanceBonusManager = await Sys.App.Services.TransactionServices.getSingleInstanceBonusDeposit({ transactionId: order.orderId });
                         if (instanceBonusManager) {
                           let referTransaction = await Sys.App.Services.TransactionServices.updateInstanceBonusManageDeposit({ transactionId : order.orderId }, { status : "Success"});
                           let refferalPlayer=await Sys.App.Services.PlayerServices.getPlayerData({_id: instanceBonusManager.refferalPlayerId});
                           let updatedInstanceBonus = (refferalPlayer.instance_bonus) ? parseFloat(refferalPlayer.instance_bonus) : 0 + (instanceBonusManager.refferalBonus) ? parseFloat(instanceBonusManager.refferalBonus) : 0;
                           await Sys.App.Services.PlayerServices.updatePlayerData(
                             {
                               _id: instanceBonusManager.refferalPlayerId
                             },{
                               instance_bonus: updatedInstanceBonus.toString(),
                             }
                           )
                         }
                         
                         //~ update deposit entry Manager
                         await Sys.App.Services.TransactionServices.updateManageDeposit({ transactionId : order.orderId }, { status : "Success"});
                         //Instance Bonus Deposite Manager
                         
                         let depositData = await Sys.App.Services.TransactionServices.getSingleDeposit({ transactionId : order.orderId });
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
                             _id: depositData.playerId
                           },{
                             cash: updatedCash.toString(),
                             // cash: (parseInt(transactionPlayer.cash)+transactionDone.amount).toString(),
                           }
                         )

                        //~





                        // let playerData={
                        //     cash:parseFloat(getPlayer[0].cash) + amountPaid,
                        //
                        //  };
                        // let updatepalyersChips =await Sys.App.Services.PlayerServices.updatePlayerData({_id: order.playerId}, playerData);

                        let getPlayerUserName = await Sys.App.Services.PlayerServices.getSinglePlayerData({_id: order.playerId});

                        let insertChips = {
                            playerId : order.playerId,
                            userName :getPlayerUserName.username,
                            cash :     amountPaid,
                            message :  'Added By Payment Through RazorPay',
                            transactionNumber : getOrderDetails.items[0].id,
                            beforeBalance : parseFloat(getPlayer[0].cash),
                            afterBalance  : parseFloat(getPlayer[0].cash) + amountPaid,
                            status :       'success',
                            gameType : '',
                            tableType : '',
                            tranType : 'cash',

                        }
                        let addPlayerChipsCashHistory =await Sys.App.Services.playerChipsCashHistoryService.insertChipsData(insertChips);

                    }else if (getOrderDetails.items[0].status == 'failed') {
                      let cancelData ={
                                  status: 'Cancel',
                      };
                      await Sys.App.Services.TransactionServices.updateTransaction({_id: order.id }, cancelData);
                    }
                }

              }
              if (order && order.payment_type == "paytm") {
                    //console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
                    //console.log("ORDERID : ",order.orderId);
                    //console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
                    
                    var paytmParams = {};
                    /* body parameters */
                    paytmParams.body = {
                        /* Find your MID in your Paytm Dashboard at https://dashboard.paytm.com/next/apikeys */
                        "mid" : Sys.Config.App.paytm_test.MID,
                        /* Enter link id here whose transactions needs to be fetched */
                        "linkId" : order.orderId,
                    };
                    let paytm_res = await doChecksum(paytmParams.body);
                    //console.log("paytm_res : ",paytm_res);
                    if(paytm_res.body.orders.length > 0){
                      ////console.log("paytm_res.STATUS :",paytm_res.STATUS);
                      if(paytm_res.body.orders[0].orderStatus == 'SUCCESS')
                      {
                          let orderData ={
                              status: 'paid',
                              paymentId:paytm_res.body.orders[0].txnId,
                          };
                          //console.log("amount",paytm_res.body.orders[0].txnAmount);
                          //let amountPaid=parseFloat(getOrderDetails.items[0].amount)/100;
                          let amountPaid=parseFloat(paytm_res.body.orders[0].txnAmount);

                           let updateStatus=await Sys.App.Services.TransactionServices.updateTransaction({_id: order.id }, orderData);
                           let getPlayer=await Sys.App.Services.PlayerServices.getPlayerData({_id: order.playerId});

                           let instanceBonusManager = await Sys.App.Services.TransactionServices.getSingleInstanceBonusDeposit({ transactionId: order.orderId });
                           if (instanceBonusManager) {
                             let referTransaction = await Sys.App.Services.TransactionServices.updateInstanceBonusManageDeposit({ transactionId : order.orderId }, { status : "Success"});
                             let refferalPlayer=await Sys.App.Services.PlayerServices.getPlayerData({_id: instanceBonusManager.refferalPlayerId});
                             let updatedInstanceBonus = (refferalPlayer.instance_bonus) ? parseFloat(refferalPlayer.instance_bonus) : 0 + (instanceBonusManager.refferalBonus) ? parseFloat(instanceBonusManager.refferalBonus) : 0;
                             await Sys.App.Services.PlayerServices.updatePlayerData(
                               {
                                 _id: instanceBonusManager.refferalPlayerId
                               },{
                                 instance_bonus: updatedInstanceBonus.toString(),
                               }
                             )
                           }
                           
                           //~ update deposit entry Manager
                           await Sys.App.Services.TransactionServices.updateManageDeposit({ transactionId : order.orderId }, { status : "Success"});
                           //Instance Bonus Deposite Manager
                           
                           let depositData = await Sys.App.Services.TransactionServices.getSingleDeposit({ transactionId : order.orderId });
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
                               _id: depositData.playerId
                             },{
                               cash: updatedCash.toString(),
                               // cash: (parseInt(transactionPlayer.cash)+transactionDone.amount).toString(),
                             }
                           )

                          //~





                          // let playerData={
                          //     cash:parseFloat(getPlayer[0].cash) + amountPaid,
                          //
                          //  };
                          // let updatepalyersChips =await Sys.App.Services.PlayerServices.updatePlayerData({_id: order.playerId}, playerData);

                          let getPlayerUserName = await Sys.App.Services.PlayerServices.getSinglePlayerData({_id: order.playerId});

                          let insertChips = {
                              playerId : order.playerId,
                              userName :getPlayerUserName.username,
                              cash :     amountPaid,
                              message :  'Added By Payment Through Paytm',
                              transactionNumber : paytm_res.body.orders[0].txnId,
                              beforeBalance : parseFloat(getPlayer[0].cash),
                              afterBalance  : parseFloat(getPlayer[0].cash) + amountPaid,
                              status :       'success',
                              gameType : '',
                              tableType : '',
                              tranType : 'cash',

                          }
                          let addPlayerChipsCashHistory =await Sys.App.Services.playerChipsCashHistoryService.insertChipsData(insertChips);

                      }else if (paytm_res.body.orders[0].orderStatus == 'FAILURE') {
                        let cancelData ={
                                    status: 'Cancel',
                        };
                        await Sys.App.Services.TransactionServices.updateTransaction({_id: order.id }, cancelData);
                      }
                    }      
              }
                
            }
            return data;

        }catch(error){
            //console.log(error);
            return new Error("Error", error);
        }

    },

    cancelPaymentStatus: async function(data){
        try{

          // let getOrderDetails=await instance.orders.fetchPayments(order.orderId);
          //
          // if(getOrderDetails.items.length > 0 ){
          //
          // }

            for(let transact of data){

                let cancelData ={
                            status: 'Cancel',
                };
                await Sys.App.Services.TransactionServices.updateTransaction({_id: transact.id }, cancelData);

            }
            return data;
        }catch(error){
            //console.log(error);
            return new Error("Error", error);
        }
    }

 }

function doRequest(options, data) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      res.setEncoding('utf8');
      let responseBody = '';

      res.on('data', (chunk) => {
        responseBody += chunk;
      });

      res.on('end', () => {
        resolve(JSON.parse(responseBody));
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    req.write(data)
    req.end();
  });
}
function doChecksum(data){
  return new Promise((resolve, reject) => {
      checksum.genchecksumbystring(JSON.stringify(data), "%OKJ3lYL99gNYENO", function(err, result){
          //return resolve(result);
           var paytmParams = {};

            /* body parameters */
            paytmParams.body = {

                /* Find your MID in your Paytm Dashboard at https://dashboard.paytm.com/next/apikeys */
                "mid" : Sys.Config.App.paytm_test.MID,

                /* Enter link id here whose transactions needs to be fetched */
                "linkId" : data.linkId,
            };

           paytmParams.head = {

              /* This will be AES */
              "tokenType" : "AES",

              /* put generated checksum value here */
              "signature" : result
          };

          /* prepare JSON string for request */
          var post_data = JSON.stringify(paytmParams);

          var options = {

              /* for Staging */
              //hostname: 'securegw-stage.paytm.in',

              /* for Production */
               hostname: 'securegw.paytm.in',

              port: 443,
              path: '/link/fetchTransaction',
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
                  'Content-Length': post_data.length
              }
          };

          // Set up the request
          var response = "";
          var post_req = https.request(options, function(post_res) {
              post_res.on('data', function (chunk) {
                  response += chunk;
              });

              post_res.on('end', function(){
                  return resolve(JSON.parse(response));
                  ////console.log('Response: ', order.body.orders[0].orderStatus);
              });
          });

          // post the data
          post_req.write(post_data);
          post_req.end();
      });
  });
}

 //5be182daa04de613817ac99b
