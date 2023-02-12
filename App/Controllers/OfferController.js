var Sys = require('../../Boot/Sys');
var bcrypt = require('bcryptjs');

module.exports = {
    offers: async function(req,res){
        try {
            var data = {
                    App : Sys.Config.App.details,
                    error: req.flash("error"),
                    success: req.flash("success"),
                    offerActive : 'active'
                };
                return res.render('offers/offers',data);
        } catch (e) {
            //console.log("Error",e);
        }
    },
    addOffers : async  function(req , res){

        try{

            var data = {
                App : Sys.Config.App.details,
                error: req.flash("error"),
                success: req.flash("success"),
                offerActive : 'active'
            };
            return res.render('offers/add',data);
        } catch(e){
            //console.log("Error",e);
        }
    },
    offerEdit : async  function(req , res){
        //console.log("ID : ",req.params.id);
        try{
            let offer = await Sys.App.Services.OtherAllService.getOfferDetails({_id: req.params.id});
            //console.log("offer : ",offer);
            var data = {
                App : Sys.Config.App.details,
                error: req.flash("error"),
                success: req.flash("success"),
                offerActive : 'active',
                offer:offer
            };
            return res.render('offers/add',data);
        } catch(e){
            //console.log("Error",e);
        }
    },
    addOffersPostData: async function(req,res){
        try {
            var d = new Date();
            var time = d.getTime();
            var file =req.files.name;
            filename =  time+'_'+ (file.name).replace(" ", "_") ;
            let data = await Sys.App.Services.OtherAllService.getLastOfferDetails({});
            
            var id = ( data && data.id) ? parseInt(data.id)+1: parseInt(1);
                await Sys.App.Services.OtherAllService.createOffersData(
                  {
                    id: id,
                    createdBy:"Admin",
                    name: filename,
                    title: req.body.title,
                    terms: req.body.terms
                  }
                )
                file.mv("./public/other/offers/"+filename,function(err){
                  if(err){
                    //console.log("error occured");
                  }
                });

                req.flash('success','Offers create successfully');
                res.redirect('/offers');
        } catch (e) {
            //console.log("Error",e);
        }
    },
     offerEditPostData: async function(req,res){
        try {
          let offer = await Sys.App.Services.OtherAllService.getOfferDetails({_id: req.params.id});
          //console.log(offer);
          var filename;
            if (req.files.name) {
                var d = new Date();
                var time = d.getTime();
                var file =req.files.name;
                filename =  time+'_'+ (file.name).replace(" ", "_") ;
                file.mv("./public/other/offers/"+filename,function(err){
                  if(err){
                    //console.log("error occured");
                  }
                });
            }else{
                filename = offer.name;
            }
            //console.log(filename);
          if (offer) {

                await Sys.App.Services.OtherAllService.updateOffer(
                {
                  _id: req.params.id
                  },{
                    name: filename,
                    title: req.body.title,
                    terms: req.body.terms
                  }
                  )
                //return res.send({"status":true,"message":"Testimonials update successfully"});
                

                req.flash('success','Offer updated successfully');
                res.redirect('/offers');
              }else {
                req.flash('error','offer not found');
                //return res.send({"status":false,"message":"Testimonials not found"});
              }
          } catch (e) {
            //console.log("Error",e);
          }
    },
    getOfferDelete: async function(req,res){
        try {
          let offer = await Sys.App.Services.OtherAllService.getOfferDetails({_id: req.body.id});
          if (offer) {
            await Sys.App.Services.OtherAllService.deleteOffer(req.body.id)
            return res.send("success");
          }else {
            return res.send("error");
          }
        } catch (e) {
            //console.log("Error",e);
        }
    },
}
