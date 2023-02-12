var Sys = require('../../Boot/Sys');
var bcrypt = require('bcryptjs');

module.exports = {
    testimonials: async function(req,res){
        try {
            var data = {
                    App : Sys.Config.App.details,
                    error: req.flash("error"),
                    success: req.flash("success"),
                    testimonialActive : 'active'
                };
                return res.render('testimonials/testimonials',data);
        } catch (e) {
            console.log("Error",e);
        }
    },
    addTestimonials : async  function(req , res){

        try{

            var data = {
                App : Sys.Config.App.details,
                error: req.flash("error"),
                success: req.flash("success"),
                testimonialActive : 'active'
            };
            return res.render('testimonials/add',data);
        } catch(e){
            console.log("Error",e);
        }
    },
    testimonialEdit : async  function(req , res){
        console.log("ID : ",req.params.id);
        try{
            let testimonial = await Sys.App.Services.OtherAllService.getTestimonialDetails({_id: req.params.id});
            console.log("testimonial : ",testimonial);
            var data = {
                App : Sys.Config.App.details,
                error: req.flash("error"),
                success: req.flash("success"),
                testimonialActive : 'active',
                testimonial:testimonial
            };
            return res.render('testimonials/add',data);
        } catch(e){
            console.log("Error",e);
        }
    },

    // getUser: async function(req,res){
    //   // res.send(req.query.start); return false;
    //     try {
    //       let start = parseInt(req.query.start);
    //       let length = parseInt(req.query.length);
    //       let search = req.query.search.value;

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

    //       let playersC = await Sys.App.Services.UserServices.getUserData(query);
    //       let playersCount = playersC.length;
    //       let data = await Sys.App.Services.UserServices.getUserDatatable(query, length, start);

    //       var obj = {
    //         'draw': req.query.draw,
    //         'recordsTotal': playersCount,
    //         'recordsFiltered': playersCount,
    //         'data': data
    //       };
    //             res.send(obj);
    //     } catch (e) {
    //         console.log("Error",e);
    //     }
    // },


    addTestimonialsPostData: async function(req,res){
        try {
            var d = new Date();
            var time = d.getTime();
            var file =req.files.photo;
            filename =  time+'_'+ (file.name).replace(" ", "_") ;
            
                await Sys.App.Services.OtherAllService.createTestimonialsData(
                  {
                    username: req.body.username,
                    photo: filename,
                    description: req.body.description
                  }
                )
                file.mv("./public/other/testimonials/"+filename,function(err){
                  if(err){
                    console.log("error occured");
                  }
                });

                req.flash('success','Testimonials create successfully');
                res.redirect('/testimonials');
        } catch (e) {
            console.log("Error",e);
        }
    },
    testimonialEditPostData: async function(req,res){

        try {


          let testimonial = await Sys.App.Services.OtherAllService.getTestimonialDetails({_id: req.params.id});
          console.log(testimonial);
          var filename;
            if (req.files.photo) {
                var d = new Date();
                var time = d.getTime();
                var file =req.files.photo;
                filename =  time+'_'+ (file.name).replace(" ", "_") ;
                file.mv("./public/other/testimonials/"+filename,function(err){
                  if(err){
                    console.log("error occured");
                  }
                });
            }else{
                filename = testimonial.photo;
            }
            console.log(filename);
          if (testimonial) {

                await Sys.App.Services.OtherAllService.updateTestimonialsData(
                {
                  _id: req.params.id
                  },{
                    username: req.body.username,
                    photo: filename,
                    description: req.body.description
                  }
                  )
                //return res.send({"status":true,"message":"Testimonials update successfully"});
                

                req.flash('success','Testimonials updated successfully');
                res.redirect('/testimonials');
              }else {
                req.flash('error','Testimonials not found');
                //return res.send({"status":false,"message":"Testimonials not found"});
              }
          } catch (e) {
            console.log("Error",e);
          }
    },

   getTestimonialDelete: async function(req,res){
        try {
          let testimonial = await Sys.App.Services.OtherAllService.getTestimonialDetails({_id: req.body.id});
          if (testimonial) {
            await Sys.App.Services.OtherAllService.deleteTestimonial(req.body.id)
            return res.send("success");
          }else {
            return res.send("error");
          }
        } catch (e) {
            console.log("Error",e);
        }
    },
}
