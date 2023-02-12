var Sys = require('../../Boot/Sys');
var bcrypt = require('bcryptjs');

module.exports = {
    users: async function(req,res){
        try {
            var data = {
                    App : Sys.Config.App.details,
                    error: req.flash("error"),
                    success: req.flash("success"),
                    userActive : 'active'
                };
                return res.render('user/user',data);
        } catch (e) {
            console.log("Error",e);
        }
    },

    getUser: async function(req,res){
      // res.send(req.query.start); return false;
        try {
          let start = parseInt(req.query.start);
          let length = parseInt(req.query.length);
          let search = req.query.search.value;

          let query = {};
          if (search != '') {
            let capital = search;
            // query = {
              // or: [
                // {'username': { 'like': '%'+search+'%' }},
                // {'username': { 'like': '%'+capital+'%' }}
              //  ]
                // };
            query = { email: { $regex: '.*' + search + '.*' } };
          } else {
            query = { };
          }
          let columns = [
            'id',
            'username',
            'firstname',
            'lastname',
            'email',
            'chips',
            'status',
            'isBot',
          ]

          let playersC = await Sys.App.Services.UserServices.getUserData(query);
          let playersCount = playersC.length;
          let data = await Sys.App.Services.UserServices.getUserDatatable(query, length, start);

          var obj = {
            'draw': req.query.draw,
            'recordsTotal': playersCount,
            'recordsFiltered': playersCount,
            'data': data
          };
                res.send(obj);
        } catch (e) {
            console.log("Error",e);
        }
    },

    addUser: async function(req,res){
        try {
            var data = {
                    App : Sys.Config.App.details,
                    error: req.flash("error"),
                    success: req.flash("success"),
                    userActive : 'active'
                };
                return res.render('user/add',data);
        } catch (e) {
            console.log("Error",e);
        }
    },

    addUserPostData: async function(req,res){
        try {
          // res.send(req.files.image.name); return;
          let player = await Sys.App.Services.UserServices.getUserData({email: req.body.email});
          if (player && player.length >0) {
            req.flash('error', 'User Already Present');
            res.redirect('/');
            return;
          }else {
            // if (req.files) {
            //   let image = req.files.image;
            //
            //   // Use the mv() method to place the file somewhere on your server
            //   image.mv('/profile/'+req.files.image.name, function(err) {
            //     if (err){
            //       req.flash('error', 'User Already Present');
            //       return res.redirect('/');
            //     }
            //
            //     // res.send('File uploaded!');
            //   });
            // }
            await Sys.App.Services.UserServices.insertUserData(
              {
                name: req.body.username,
                email: req.body.email,
                role: req.body.role,
                status: req.body.status,
                password : bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(8), null)
                // image: req.files.image.name
              }
            )
            req.flash('success','User create successfully');
            res.redirect('/user');
          }
          // req.flash('sucess', 'Player Registered successfully');
          // res.redirect('/');
        } catch (e) {
            console.log("Error",e);
        }
    },

    getUserDelete: async function(req,res){
        try {
          let player = await Sys.App.Services.UserServices.getUserData({_id: req.body.id});
          if (player || player.length >0) {
            await Sys.App.Services.UserServices.deleteUser(req.body.id)
            return res.send("success");
          }else {
            return res.send("error");
          }
        } catch (e) {
            console.log("Error",e);
        }
    },

    editUser: async function(req,res){
      try {
        let user = await Sys.App.Services.UserServices.getSingleUserData({_id: req.params.id});
        var data = {
                    App : Sys.Config.App.details,
                    error: req.flash("error"),
                    success: req.flash("success"),
                    user: user,
                    userActive : 'active'
                };
        return res.render('user/add',data);
        // res.send(player);
      } catch (e) {
        console.log("Error",e);
      }
    },

    editUserPostData: async function(req,res){
        try {
          let player = await Sys.App.Services.UserServices.getUserData({_id: req.params.id});
          if (player && player.length >0) {

              if (req.files) {
                let image = req.files.image;

                // Use the mv() method to place the file somewhere on your server
                image.mv('/profile/'+req.files.image.name, function(err) {
                  if (err){
                    req.flash('error', 'User Already Present');
                    return res.redirect('/');
                  }

                  // res.send('File uploaded!');
                });
              }
              await Sys.App.Services.UserServices.updateUserData(
                {
                  _id: req.params.id
                  // image: req.files.image.name
                },{
                  name: req.body.username,
                  // email: req.body.email,
                  role: req.body.role,
                  status: req.body.status,
                  // password : bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(8), null)
                  // image: req.files.image.name
                }
              )
              req.flash('success','User update successfully');
              res.redirect('/user');

          }else {
            req.flash('error', 'No User found');
            res.redirect('/');
            return;
          }
          // req.flash('sucess', 'Player Registered successfully');
          // res.redirect('/');
        } catch (e) {
            console.log("Error",e);
        }
    },
}
