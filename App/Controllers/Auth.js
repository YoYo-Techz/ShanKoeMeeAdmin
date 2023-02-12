var Sys = require('../../Boot/Sys');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var jwtcofig = {
  'secret': 'AisJwtAuth'
};
// nodemialer to send email
const nodemailer = require('nodemailer');
// create a defaultTransport using gmail and authentication that are
// stored in the `config.js` file.
var defaultTransport = nodemailer.createTransport({
 service: 'Gmail',
 auth: {
   user: Sys.Config.App.mailer.auth.user,
   pass: Sys.Config.App.mailer.auth.pass
 }
});

module.exports = {
    login: async function(req,res){
        try {

            var data = {
                    App : Sys.Config.App.details,
                    error: req.flash("error"),
                    success: req.flash("success"),

                };
            let isDefaultUser = null;
            isDefaultUser = await Sys.App.Services.UserServices.getUserData({});

            if (isDefaultUser == null || isDefaultUser.length == 0) {
                let insertedUser=await Sys.App.Services.UserServices.insertUserData(
                       {
                         name: Sys.Config.App.defaultUserLogin.name,
                         email: Sys.Config.App.defaultUserLogin.email,
                         password: bcrypt.hashSync(Sys.Config.App.defaultUserLogin.password, bcrypt.genSaltSync(8), null),
                         role: Sys.Config.App.defaultUserLogin.role,
                       }
                    );
            }

            return res.render('login',data);
        } catch (e) {
            //console.log("Error",e);
        }
    },

    register: async function(req,res){
        try {

            var data = {
                    App : Sys.Config.App.details,
                    error: req.flash("error"),
                    success: req.flash("success"),
                };

            return res.render('register',data);
        } catch (e) {
            //console.log("Error",e);
        }
    },
    postLogin: async function(req,res){
        try {

          // res.send(req.body); return;
            //console.log("req.body.email->",req.body.email);
            let player = null;
            player = await Sys.App.Services.UserServices.getUserData({email: req.body.email});
            // res.send(player); return;
            //
            if (player == null || player.length == 0) {
              req.flash('error', 'No Such Player Found');
              return res.redirect('/');
            }
            var passwordTrue;
            if(bcrypt.compareSync(req.body.password, player[0].password)) {
              passwordTrue = true;
            } else {
              // Passwords don't match
              passwordTrue = false;
            }
            if (passwordTrue == true) {
              //console.log("Users->",Sys.App.Services.UserServices);
              // let User = await Sys.App.Services.UserServices.getByData({email:req.body.email});
              // //console.log("Users->",User);

              // set jwt token
              var token = jwt.sign({ id: player[0].id }, jwtcofig.secret, {
                          expiresIn: 60*60*24 // expires in 24 hours
                        });

              ////console.log("Token",token);
              // User Authenticate Success
              req.session.login = true;
              req.session.details = {
                  id : player[0].id,
                  name : player[0].name,
                  jwt_token : token,
                  // avatar : 'default.png'
              };
              req.flash('success','Welcome To Admin Panel');
              return res.redirect('/dashboard');
            }else {
              req.flash('error', 'Invalid Credentials');
              return res.redirect('/');
            }
            // if(req.body.email == 'rummy@aistechnolabs.com'){
            //
            // }else{
            //     req.flash('error', 'Invalid Credentials ');
            //     res.redirect('/');
            // }


            // var data = {
            //         App : Sys.Config.App.details
            //     };
            // return res.render('login.html',data);
        } catch (e) {
            //console.log("Error",e);
        }
    },
    forgotPassword: async function(req,res){
        try {
            var data = {
                    App : Sys.Config.App.details,
                    error: req.flash("error"),
                    success: req.flash("success"),
                };

            return res.render('forgot-password',data);
        } catch (e) {
            //console.log("Error",e);
        }
    },
    forgotPasswordSendMail: async function(req, res){
        try {
            var data = {
                    App : Sys.Config.App.details,
                    error: req.flash("error"),
                    success: req.flash("success"),
                };
            let user = null;
            user = await Sys.App.Services.UserServices.getUserData({email: req.body.email});
            if (user == null || user.length == 0) {
              req.flash('error', 'No Such User Found,Please Enter Valid Registered Email.');
              return res.redirect('/forgot-password');
            }
            var token = jwt.sign({ id: req.body.email }, jwtcofig.secret, {
                        expiresIn: 300 // expires in 24 hours
                      });

            await Sys.App.Services.UserServices.updateUserData(
                {
                  _id: user[0]._id
                },{
                  resetPasswordToken:token,
                  resetPasswordExpires:Date.now() + 60*60*60*60*24,
                }
              );
            var mailOptions = {
                    to: req.body.email,
                    from: 'Wongo Poker',
                    subject: 'Wongo Poker Password Reset',
                    text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                      'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                      'http://' + req.headers.host + '/reset-password/' + token + '\n\n' +
                      'If you did not request this, please ignore this email and your password will remain unchanged.\n'
            };
            defaultTransport.sendMail(mailOptions, function(err) {
                    if (!err) {
                      req.flash('success', 'An e-mail has been sent to ' + req.body.email + ' with further instructions.');
                      defaultTransport.close();
                      return res.redirect('/forgot-password');
                    } else {
                      //console.log(err);
                      req.flash('error', 'Error sending mail,please try again After some time.');
                      return res.redirect('/forgot-password');
                    }

            });

        } catch (e) {
            //console.log("Error",e);
        }
    },
    resetPassword: async function(req, res){
        try {
            var data = {
                    App : Sys.Config.App.details,
                    error: req.flash("error"),
                    success: req.flash("success"),
                };
            let user = null;
            var query = {
                          resetPasswordToken: req.params.token,
                          resetPasswordExpires: { $gt: Date.now() }
                        }
            user = await Sys.App.Services.UserServices.getUserData({
                          resetPasswordToken: req.params.token,
                          resetPasswordExpires: { $gt: Date.now() }
                        });

            if (user == null || user.length == 0) {
              req.flash('error', 'Password reset token is invalid or has expired.');
              return res.redirect('/forgot-password');
            }
            data.user = user[0];
            //console.log("final user",data);
            return res.render('reset-password',data);
        } catch (e) {
            //console.log("Error",e);
        }
    },
    postResetPassword: async function(req, res){
      try{
          var data = {
                  App : Sys.Config.App.details,
                  error: req.flash("error"),
                  success: req.flash("success"),
              };
          let user = null;
          user = await Sys.App.Services.UserServices.getUserData({
                        resetPasswordToken: req.params.token,
                        resetPasswordExpires: { $gt: Date.now() }
                      });

          if (user == null || user.length == 0) {
            req.flash('error', 'Password reset token is invalid or has expired.');
            return res.redirect('/forgot-password');
          }

          await Sys.App.Services.UserServices.updateUserData(
              {
                _id: req.body.id
              },{
                password : bcrypt.hashSync(req.body.pass_confirmation, bcrypt.genSaltSync(8), null)
              }
            )
          req.flash('success','Password updated successfully,Now you can Login with your New Pasword.');
          return res.redirect('/');

      }catch(e){
          //console.log("Error",e);
          req.flash('error', 'Error while upating password');
          return res.redirect(req.header('Referer'));
      }


    },
    logout: async function(req,res){
        //console.log("Logout");
        try {
            req.session.destroy(function(err) {
                req.logout();
                return res.redirect('/');
              })
        } catch (e) {
            //console.log("Error",e);
        }
    },

    profile: async function (req , res){
        // //console.log("session details id----------->",req.session.details.id);
        try{
            user = await Sys.App.Services.UserServices.getSingleUserData({_id: req.session.details.id});

            var data = {
                    App : Sys.Config.App.details,
                    error: req.flash("error"),
                    success: req.flash("success"),
                    user:user
                };

            return res.render('profile',data);
        }catch (e){


        }
    },


    profileUpdate: async function(req,res){
        try{
          user = await Sys.App.Services.UserServices.getSingleUserData({_id: req.body.id});
           if(user){
            await Sys.App.Services.UserServices.updateUserData(
                {
                  _id: req.body.id
                },{
                  email : req.body.email,
                  name : req.body.name
                }
              )
              req.flash('success','Profile update successfully');
              res.redirect('/profile');

           }else{
             req.flash('error', 'profile not update successfully');
            return res.redirect('/profile');
           }
        }catch (e){
            //console.log("Error",e);
        }
    },


    ChangePassword : async function (req,res){
        try{

            user = await Sys.App.Services.UserServices.getSingleUserData({_id: req.body.id});
           if(user){
            await Sys.App.Services.UserServices.updateUserData(
                {
                  _id: req.body.id
                },{
                  password : bcrypt.hashSync(req.body.pass_confirmation, bcrypt.genSaltSync(8), null)
                }
              )
              req.flash('success','Password update successfully');
              res.redirect('/profile');

           }else{
             req.flash('error', 'Password not update successfully');
            return res.redirect('/profile');
           }
        }catch (e){
            //console.log("Error",e);
        }
    },



    // signup: async function(req,res){
    //     try {
    //         var data = {
    //                 App : Sys.Config.App.details
    //             };
    //         return res.render('login.html',data);
    //     } catch (e) {
    //         //console.log("Error",e);
    //     }
    // },
    // postSignup: async function(req,res){
    //     try {
    //         //console.log("req.body.email->",req.body.email);
    //         var data = {
    //                 App : Sys.Config.App.details
    //             };
    //         return res.render('login.html',data);
    //     } catch (e) {
    //         //console.log("Error",e);
    //     }
    // }
}
