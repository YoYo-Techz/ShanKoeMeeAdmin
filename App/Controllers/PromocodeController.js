var Sys = require('../../Boot/Sys');
var bcrypt = require('bcryptjs');
const moment = require('moment');
module.exports = {

    promocode: async function(req, res){
      try {

        var data = {
          App : Sys.Config.App.details,
          error: req.flash("error"),
          success: req.flash("success"),
          promocodeActive : 'active'
        };
        return res.render('promocode/promocode',data);
      } catch (e) {
        console.log("Error",e);
      }
    },

    addPromocode: async function(req, res){
      try {

        var data = {
          App : Sys.Config.App.details,
          error: req.flash("error"),
          success: req.flash("success"),
        };
        return res.render('promocode/addPromocode',data);
      } catch (e) {
        console.log("Error",e);
      }
    },

    addPromocodePostData:async function(req, res){
      try{
        let fileName;
        if (req.files) {
          let image = req.files.image;
          var re = /(?:\.([^.]+))?$/;
          var ext = re.exec(image.name)[1];
          fileName = Date.now()+'.'+ext;

          // image.mv('./public/promocode/'+fileName, function(err) {
          //   if (err){
          //     req.flash('error', 'Error Uploading Profile Avatar');
          //     console.log("error");
          //     return res.redirect('/promocode');
          //   }
          // });
        }
        await Sys.App.Services.PromocodeServices.insertPromocodeData(
          {
            name: req.body.name,
            status: req.body.status,
            code: req.body.code,
            min_transaction: req.body.min_transaction,
            offer: req.body.offer,
            maximum_offer: req.body.maximum_offer,
            usage_limit: req.body.usage_limit,
            individual_usage_limit: req.body.individual_usage_limit,
            start_date: req.body.start_date,
            end_date: req.body.end_date,
            // image: 'promocode/'+fileName
          }
        )
        req.flash('success','Promocode Added.');
        res.redirect("/promocode");

      }catch (e){
        console.log("Error",e);

      }
    },

    getPromocode: async function(req, res){
      try {
        let start = parseInt(req.query.start);
        let length = parseInt(req.query.length);
        let search = req.query.search.value;

        let query = {};
        if (search != '') {
        query = { name: { $regex: '.*' + search + '.*' } };
        } else {
          query = { };
        }

        let promocodeCount = await Sys.App.Services.PromocodeServices.getPromocodeCount(query);
        //let stacksCount = stacksC.length;
        let data = await Sys.App.Services.PromocodeServices.getPromocodeDatatable(query, length, start);
        var obj = {
          'draw': req.query.draw,
          'recordsTotal': promocodeCount,
          'recordsFiltered': promocodeCount,
          'data': data
        };
        res.send(obj);
      } catch (e) {
        console.log("Error",e);
      }
    },

    editPromocode:async function(req,res){
      try{
      let promocode = await Sys.App.Services.PromocodeServices.getSinglePromocodeData({_id: req.params.id});
      let start_date = moment(promocode.start_date).format('YYYY-MM-DD HH:mm');
      let end_date = moment(promocode.end_date).format('YYYY-MM-DD HH:mm');
      var data = {
        App : Sys.Config.App.details,
        error: req.flash("error"),
        success: req.flash("success"),
        agentActive : 'active',
        promocode: promocode,
        start_date: start_date,
        end_date, end_date
      };
      return res.render('promocode/addPromocode',data);
      }catch(e){
        console.log("Error", e);
        return new Error("Error", e);
      }
    },

    editPromocodePostData: async function(req,res){
        try {
          let promocode = await Sys.App.Services.PromocodeServices.getSinglePromocodeData({_id: req.params.id});
          let fileName;
          if (promocode) {
              if (req.files.image) {
                 let image = req.files.image;
                 var re = /(?:\.([^.]+))?$/;
                 var ext = re.exec(image.name)[1];
                 fileName = 'promocode/'+Date.now()+'.'+ext;

                 image.mv('./public/'+fileName, function(err) {
                   if (err){
                     req.flash('error', 'Error Uploading Profile Avatar');
                     console.log("error");
                     return res.redirect('/promocode');
                   }
                 });
              }else{
                fileName = promocode.image;
              }
              await Sys.App.Services.PromocodeServices.updatePromocodeData(
                {
                  _id: req.params.id
                },{
                    name: req.body.name,
                    status: req.body.status,
                    code: req.body.code,
                    min_transaction: req.body.min_transaction,
                    offer: req.body.offer,
                    maximum_offer: req.body.maximum_offer,
                    usage_limit: req.body.usage_limit,
                    individual_usage_limit: req.body.individual_usage_limit,
                    start_date: req.body.start_date,
                    end_date: req.body.end_date,
                    image: fileName
                }
              )
              req.flash('success','Promocode updated successfully');
              res.redirect('/promocode');

          }else {
            req.flash('error', 'Promocode not updated successfully');
            res.redirect('/promocode/add');
            return;
          }
          // req.flash('sucess', 'Player Registered successfully');
          // res.redirect('/');
        } catch (e) {
            console.log("Error",e);
        }
    },

    deletePromocode: async function(req, res){
        try {
            let promocode = await Sys.App.Services.PromocodeServices.getSinglePromocodeData({_id: req.body.id});
            if (promocode || promocode.length >0) {
              await Sys.App.Services.PromocodeServices.deletePromocode(req.body.id)
              return res.send("success");
            }else {
              return res.send("error");
            }
          } catch (e) {
              console.log("Error",e);
          }
    },

    history: async function(req , res){
      try {
        let promocode =await Sys.App.Services.PromocodeServices.getSinglePromocodeData({_id: req.params.id});
        let promocodeCount = await Sys.App.Services.PromocodeServices.getHistoryCount({promocode: req.params.id});
        var data = {
          App : Sys.Config.App.details,
          error: req.flash("error"),
          success: req.flash("success"),
          promocodeActive : 'active',
          promocodeId : req.params.id,
          promocode: promocode.code,
          promocodeCount: promocodeCount,
        };
        return res.render('promocode/history',data);
      } catch (e) {
        console.log("Error",e);
      }

    },

    getHistory: async function(req, res){
      try {
        let start = parseInt(req.query.start);
        let length = parseInt(req.query.length);
        let search = req.query.search.value;

        let query = {};
        if (search != '') {    //name: { $regex: '.*' + search + '.*' }
          query = { promocode: req.params.id };
        } else {
          query = { promocode: req.params.id };
        }

        let promocodeCount = await Sys.App.Services.PromocodeServices.getHistoryCount(query);
        //let stacksCount = stacksC.length;
        let data = await Sys.App.Services.PromocodeServices.getHistoryPopulatedData(query, null, {skip: start, limit: length,sort:{createdAt:-1}}, 'player');

        var obj = {
          'draw': req.query.draw,
          'recordsTotal': promocodeCount,
          'recordsFiltered': promocodeCount,
          'data': data
        };
        res.send(obj);
      } catch (e) {
        console.log("Error",e);
      }
    },

    getAllPromoCodes: async function(req, res){
      try {

        let ResObj = [];
        let previousDepositCount = await Sys.App.Services.TransactionServices.getDepositCount({ playerId: req.body.playerId, status: 'Success' });
        if (previousDepositCount == 0) {

          ResObj.push({
            promoCode : 'Welcome',
            description : 'First Deposit',
            information : 'PromoCode Can be used 1 Time and for first time Deposit'
          });

        }
        else if (previousDepositCount == 1) {

          ResObj.push({
            promoCode : 'FirstTopUp',
            description : 'Second Deposit',
            information : 'PromoCode Can be used 1 Time and for Second time Deposit'
          });

        }
        // else {

          let validPromoCode = await Sys.App.Services.PromocodeServices.getPromocodeData({ status: 'Active' });
          // let validPromoCode = await Sys.App.Services.PromocodeServices.getPromocodeData({ start_date : { $lt : Date.now()}, end_date : { $gt : Date.now()}  });
          for (var i = 0; i < validPromoCode.length; i++) {
            let promoCodeUsedCount = 0;
            promoCodeUsedCount = await Sys.App.Services.PromocodeServices.getHistoryCount({ promocode: validPromoCode[i].code, playerId: req.body.playerId  });
            if (promoCodeUsedCount < validPromoCode[i].individual_usage_limit) {
              ResObj.push({
                promoCode : validPromoCode[i].code,
                description : validPromoCode[i].name,
                information : 'PromoCode Can be used '+validPromoCode[i].individual_usage_limit+' Time and gives extra '+validPromoCode[i].offer+'% upto '+validPromoCode[i].maximum_offer
              });
            }
          }

        // }

        res.json(ResObj);
      } catch (e) {
        console.log("Error is getting promocodes",e);
      }
    },
}
