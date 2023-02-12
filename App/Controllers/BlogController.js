var Sys = require('../../Boot/Sys');
var bcrypt = require('bcryptjs');

module.exports = {
    blogs: async function(req,res){
        try {
            var data = {
                    App : Sys.Config.App.details,
                    error: req.flash("error"),
                    success: req.flash("success"),
                    blogActive  : 'active'
                };
                return res.render('blogs/blogs',data);
        } catch (e) {
            //console.log("Error",e);
        }
    },
    addBlog : async  function(req , res){

        try{

            var data = {
                App : Sys.Config.App.details,
                error: req.flash("error"),
                success: req.flash("success"),
                blogActive : 'active'
            };
            return res.render('blogs/add',data);
        } catch(e){
            //console.log("Error",e);
        }
    },
    blogEdit : async  function(req , res){
        //console.log("ID : ",req.params.id);
        try{
            let blog = await Sys.App.Services.OtherAllService.getBlogDetails({_id: req.params.id});
            //console.log("blog : ",blog);
            var data = {
                App : Sys.Config.App.details,
                error: req.flash("error"),
                success: req.flash("success"),
                blogActive : 'active',
                blog:blog
            };
            return res.render('blogs/add',data);
        } catch(e){
            //console.log("Error",e);
        }
    },
    addBlogPostData: async function(req,res){
        try {
          //console.log("BODY : ",req.body);
            var d = new Date();
            var time = d.getTime();
            var file =req.files.photo;
            var file1 =req.files.photo1;
            filename =  time+'_'+ (file.name).replace(" ", "_") ;
            filename1 =  time+'_'+ (file1.name).replace(" ", "_") ;
            let data = await Sys.App.Services.OtherAllService.getLastBlogDetails({});
            
            var title  = req.body.title.toLowerCase();
            let title_string = title.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '');
            let title_url = title_string.replace(/ /g,"-");
            
            var id = ( data && data.id) ? parseInt(data.id)+1: parseInt(1);
                await Sys.App.Services.OtherAllService.createBlogsData(
                {
                  title: req.body.title,
                  title_url:title_url,
                  id:id,
                  createdBy: "Admin",
                  page_meta_title: req.body.page_meta_title,
                  page_meta_keywords: req.body.page_meta_keywords,
                  page_meta_description: req.body.page_meta_description,
                  page_meta_url: req.body.page_meta_url,
                  tag:"",
                  isDisplayHomePage:true,
                  categoryName:req.body.categoryName,
                  photo:filename,
                  photo1:filename1,
                  description: req.body.description
                }
              )
                file.mv("./public/other/blog/"+filename,function(err){
                  if(err){
                    //console.log("error occured");
                  }
                });
                file.mv("./public/other/blog/"+filename1,function(err){
                  if(err){
                    //console.log("error occured");
                  }
                });

                req.flash('success','Blog create successfully');
                res.redirect('/blog');
        } catch (e) {
            //console.log("Error",e);
        }
    },
     blogEditPostData: async function(req,res){
        try {
          let blog = await Sys.App.Services.OtherAllService.getBlogDetails({_id: req.params.id});
          //console.log(blog);
          var filename;
          var filename1;
            if (req.files.photo) {
                var d = new Date();
                var time = d.getTime();
                var file =req.files.photo;
                filename =  time+'_'+ (file.name).replace(" ", "_") ;
                file.mv("./public/other/blog/"+filename,function(err){
                  if(err){
                    //console.log("error occured");
                  }
                });
            }else{
                filename = blog.photo;
            }
            if (req.files.photo1) {
                var d1 = new Date();
                var time1 = d1.getTime();
                var file1 =req.files.photo1;
                filename1 =  time1+'_'+ (file1.name).replace(" ", "_") ;
                file.mv("./public/other/blog/"+filename1,function(err){
                  if(err){
                    //console.log("error occured");
                  }
                });
            }else{
                filename1 = blog.photo1;
            }
            //console.log(filename);
          if (blog) {
                var title  = req.body.title.toLowerCase();
                let title_string = title.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '');
                let title_url = title_string.replace(/ /g,"-");
                await Sys.App.Services.OtherAllService.updateBlog(
                {
                  _id: req.params.id
                  },{
                      title: req.body.title,
                      title_url:title_url,
                      page_meta_title: req.body.page_meta_title,
                      page_meta_keywords: req.body.page_meta_keywords,
                      page_meta_description: req.body.page_meta_description,
                      page_meta_url: req.body.page_meta_url,
                      tag:"",
                      categoryName:req.body.categoryName,
                      photo:filename,
                      photo1:filename1,
                      description: req.body.description
                  }
                  )
                req.flash('success','Blog updated successfully');
                res.redirect('/blog');
              }else {
                req.flash('error','Blog not found');
                //return res.send({"status":false,"message":"Testimonials not found"});
              }
          } catch (e) {
            //console.log("Error",e);
          }
    },
    getBlogDelete: async function(req,res){
        try {
          let blog = await Sys.App.Services.OtherAllService.getBlogDetails({_id: req.body.id});
          if (blog) {
            await Sys.App.Services.OtherAllService.deleteBlog(req.body.id)
            return res.send("success");
          }else {
            return res.send("error");
          }
        } catch (e) {
            //console.log("Error",e);
        }
    },
}
