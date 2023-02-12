var jwt = require('jsonwebtoken');

var jwtcofig = {
  'secret': 'AisJwtAuth'
};

module.exports = {
    loginCheck: function(req, res, next){
        if(req.session.login){
            
            res.redirect('/dashboard');
        }else{
            next();
        }
    },
    Authenticate: function(req, res, next){
        if(req.session.login){
            
            jwt.verify(req.session.details.jwt_token, jwtcofig.secret, function(err, decoded) {
                if (err){
                            //return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
                            req.session.destroy(function(err) {
                                req.logout();
                                return res.redirect('/');
                            })
                        }
                else{
                            res.locals.session = req.session.details;
                            next();
                    }

            });

            //next();
        }else{
            res.redirect('/');
        }
    }
}