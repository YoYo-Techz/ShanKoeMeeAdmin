var Sys = require('../../Boot/Sys');
var bcrypt = require('bcryptjs');

module.exports = {
    seo: async function(req,res){
        try {
            var data = {
                    App : Sys.Config.App.details,
                    error: req.flash("error"),
                    success: req.flash("success"),
                    seoActive : 'active'
                };
                return res.render('seo/seo',data);
        } catch (e) {
            console.log("Error",e);
        }
    },
    listSeo: async function (req, res){
        try {
          let query = {};
          let data = await Sys.App.Services.OtherAllService.getSeos(query);
          let SeoCount = data.length;
          var obj = {
            'recordsTotal': SeoCount,
            'data': data
          };

          res.send(obj);
        } catch (e) {
          console.log("Error",e);
        }
    },
    addSeo : async  function(req , res){
        try{
            var data = {
                App : Sys.Config.App.details,
                error: req.flash("error"),
                success: req.flash("success"),
                seoActive : 'active'
            };
            return res.render('seo/add',data);
        } catch(e){
            console.log("Error",e);
        }
    },
    seoEdit : async  function(req , res){
        console.log("ID : ",req.params.id);
        try{
            let seo = await Sys.App.Services.OtherAllService.getSeoDetails({_id: req.params.id});
            console.log("seo : ",seo);
            var data = {
                App : Sys.Config.App.details,
                error: req.flash("error"),
                success: req.flash("success"),
                seoActive : 'active',
                seo:seo
            };
            return res.render('seo/add',data);
        } catch(e){
            console.log("Error",e);
        }
    },
    addSeoPostData: async function(req,res){
        try {
                await Sys.App.Services.OtherAllService.createSeoData(
                  {
                    url: req.body.url,
                    title: req.body.title,
                    description: req.body.description,
                    keywords: req.body.keywords
                  }
                )
                req.flash('success','SEO created successfully');
                res.redirect('/seo');
        } catch (e) {
            console.log("Error",e);
        }
    },
    seoEditPostData: async function(req,res){
        try {
          let seo = await Sys.App.Services.OtherAllService.getSeoDetails({_id: req.params.id});
          console.log(seo);
          if (seo) {

                await Sys.App.Services.OtherAllService.updateSeoData(
                {
                  _id: req.params.id
                  },{
                    url: req.body.url,
                    title: req.body.title,
                    description: req.body.description,
                    keywords: req.body.keywords
                  }
                  )
                req.flash('success','SEO updated successfully');
                res.redirect('/seo');
              }else {
                req.flash('error','SEO not found');
              }
          } catch (e) {
            console.log("Error",e);
          }
    },
    getSeoDelete: async function(req,res){
        try {
          let seo = await Sys.App.Services.OtherAllService.getSeoDetails({_id: req.body.id});
          if (seo) {
            await Sys.App.Services.OtherAllService.deleteSeo(req.body.id)
            return res.send("success");
          }else {
            return res.send("error");
          }
        } catch (e) {
            console.log("Error",e);
        }
    },
    getSeoDetailsByURL: async function(req,res){
      console.log("========//  SEO /======");
        try {
          let seo = await Sys.App.Services.OtherAllService.getSeoDetails({url: req.body.url});
          if (seo) {
            let seoObj = {
              url: (seo.url) ? seo.url : "",
              title: (seo.title) ? seo.title : "",
              description: (seo.description) ? seo.description : "",
              keywords: (seo.keywords) ? seo.keywords : ""
            }
            res.send({status : true,data : seoObj});
          }else {
           res.send({status : false});
          }
        } catch (e) {
            console.log("Error",e);
        }
    },
}
