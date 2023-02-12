var Sys = require('../../Boot/Sys');
var bcrypt = require('bcryptjs');

module.exports = {
	stacks: async function(req,res){
		try {

			var data = {
				App : Sys.Config.App.details,
				error: req.flash("error"),
				success: req.flash("success"),
        stackActive : 'active'
			};
			return res.render('cashGame/stacks',data);
		} catch (e) {
			console.log("Error",e);
		}
	},

	getStacks: async function(req,res){

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

            let stacksC = await Sys.App.Services.StacksServices.getByData(query);
            let stacksCount = stacksC.length;
            let data = await Sys.App.Services.StacksServices.getStacksDatatable(query, length, start);
            var obj = {
            	'draw': req.query.draw,
            	'recordsTotal': stacksCount,
            	'recordsFiltered': stacksCount,
            	'data': data
            };
            res.send(obj);
        } catch (e) {
        	console.log("Error",e);
        }
    },

    addStacks: async function(req,res){
    	try {

			var data = {
				App : Sys.Config.App.details,
				error: req.flash("error"),
				success: req.flash("success"),
        stackActive : 'active'
			};
			return res.render('cashGame/addStacks',data);
		} catch (e) {
			console.log("Error",e);
		}
    },

    postStacks: async function(req,res){
    	try{
    
    	 await Sys.App.Services.StacksServices.insertStacksData(
              {
                minStack: req.body.minStacks,
                maxStack: req.body.maxStack,
                flag: req.body.flag,
              }
            )
            req.flash('success','Stack create successfully');
            res.redirect("/cashgames/stacks");

    	}catch (e){
    		console.log("Error",e);

    	}
    },

    getStacksDelete: async function(req,res){
    	try {
          let stacks = await Sys.App.Services.StacksServices.getStacksData({_id: req.body.id});
          if (stacks || stacks.length >0) {
            await Sys.App.Services.StacksServices.deleteStacks(req.body.id)
            return res.send("success");
          }else {
            return res.send("error");
          }
        } catch (e) {
            console.log("Error",e);
        }
    },

    editstacks: async function(req,res){
    	 try {
        let stack = await Sys.App.Services.StacksServices.getStacksData({_id: req.params.id});
        return res.render('cashGame/addStacks',{stack: stack , stackActive : 'active'});
        // res.send(player);
      } catch (e) {
        console.log("Error",e);
      }

    },

    editStacksPostData: async function(req,res){
        try {
          let stacks = await Sys.App.Services.StacksServices.getStacksData({_id: req.params.id});
          if (stacks) {

              await Sys.App.Services.StacksServices.updateStacksData(
                {
                  _id: req.params.id
                },{
                    minStack: req.body.minStacks,
	                maxStack: req.body.maxStack,
	                flag: req.body.flag,
                }
              )
              req.flash('success','Stacks update successfully');
              res.redirect('/cashgames/stacks');

          }else {
            req.flash('error', 'Stack not update successfully');
            res.redirect('/cashgames/stacks');
            return;
          }
          // req.flash('sucess', 'Player Registered successfully');
          // res.redirect('/');
        } catch (e) {
            console.log("Error",e);
        }
    },
}