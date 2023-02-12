var Sys = require('../../Boot/Sys');
var bcrypt = require('bcryptjs');

module.exports = {

    playerChipsHistory: async function(req,res){
        try {
            var data = {
                    App : Sys.Config.App.details,
                    error: req.flash("error"),
                    success: req.flash("success"),
                    chipsHistory : 'active',
                };
                return res.render('chipsHistory',data);
        } catch (e) {
            //console.log("Error",e);
        }
    },

    getChipsHistory: async function(req,res){
      try{
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

          let chips = await Sys.App.Services.ChipsHistoryServices.getByData(query);
          let chipsCount = chips.length;
          let data = await Sys.App.Services.ChipsHistoryServices.getChipsDatatable(query, length, start);

          var obj = {
            'draw': req.query.draw,
            'recordsTotal': chipsCount,
            'recordsFiltered': chipsCount,
            'data': data
          };
                res.send(obj);

      }catch (e){
        //console.log("Error",e);
      }
    }
}