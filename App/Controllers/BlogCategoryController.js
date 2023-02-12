var Sys = require('../../Boot/Sys');
var bcrypt = require('bcryptjs');

module.exports = {
    blogCategories: async function(req,res){
        try {
            var data = {
                    App : Sys.Config.App.details,
                    error: req.flash("error"),
                    success: req.flash("success"),
                    blogCategoriesActive : 'active'
                };
                return res.render('blogCategories/blogCategories',data);
        } catch (e) {
            //console.log("Error",e);
        }
    },
    listBlogCategories: async function (req, res){
        try {
          let query = {};
          let data = await Sys.App.Services.OtherAllService.getBlogCategories(query);
          let BlogCategoriesCount = data.length;
          var obj = {
            'recordsTotal': BlogCategoriesCount,
            'data': data
          };

          res.send(obj);
        } catch (e) {
          //console.log("Error",e);
        }
    },
    addBlogCategories : async  function(req , res){
        try{
            var data = {
                App : Sys.Config.App.details,
                error: req.flash("error"),
                success: req.flash("success"),
                blogCategoriesActive : 'active'
            };
            return res.render('blogCategories/add',data);
        } catch(e){
            //console.log("Error",e);
        }
    },
    blogCategoriesEdit : async  function(req , res){
        //console.log("ID : ",req.params.id);
        try{
            let blogCategories = await Sys.App.Services.OtherAllService.getBlogCategoriesDetails({_id: req.params.id});
            //console.log("blogCategories : ",blogCategories);
            var data = {
                App : Sys.Config.App.details,
                error: req.flash("error"),
                success: req.flash("success"),
                blogCategoriesActive : 'active',
                blogCategories:blogCategories
            };
            return res.render('blogCategories/add',data);
        } catch(e){
            //console.log("Error",e);
        }
    },
    addBlogCategoriesPostData: async function(req,res){
        try {
                await Sys.App.Services.OtherAllService.createBlogCategoriesData(
                  {
                    name: req.body.name,
                  }
                )
                req.flash('success','Blog Category created successfully');
                res.redirect('/blogCategories');
        } catch (e) {
            //console.log("Error",e);
        }
    },
    blogCategoriesEditPostData: async function(req,res){
        try {
          let blogCategories = await Sys.App.Services.OtherAllService.getBlogCategoriesDetails({_id: req.params.id});
          //console.log(blogCategories);
          if (blogCategories) {

                await Sys.App.Services.OtherAllService.updateBlogCategoriesData(
                {
                  _id: req.params.id
                  },{
                    name: req.body.name
                  }
                  )
                req.flash('success','blogCategories updated successfully');
                res.redirect('/blogCategories');
              }else {
                req.flash('error','blogCategories not found');
              }
          } catch (e) {
            //console.log("Error",e);
          }
    },
    getBlogCategoriesDelete: async function(req,res){
        try {
          let blogCategories = await Sys.App.Services.OtherAllService.getBlogCategoriesDetails({_id: req.body.id});
          if (blogCategories) {
            await Sys.App.Services.OtherAllService.deleteBlogCategories(req.body.id)
            return res.send("success");
          }else {
            return res.send("error");
          }
        } catch (e) {
            //console.log("Error",e);
        }
    },
}
