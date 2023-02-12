var GoogleStrategy = require('passport-google-oauth20').Strategy;
var configAuth = require('./social_media_login');var bcrypt = require('bcryptjs');
var Sys = require('../Boot/Sys');
module.exports = function(passport){

	passport.serializeUser(function(user, cb) {
			   //console.log("useremail", player.email);
	       cb(null, user.email);
	});

	   
  passport.deserializeUser(async function(email, cb) {
   	   try{
   	  	   let findUser=await Sys.App.Services.UserServices.getUserData({email:email});
   	  	   //console.log("final user deserialise", findUser);
   	      if(findUser)
   			{
   				return cb(null, findUser);
   			}
   			else{
   				return cb(new Error('user not found'));
   			}
   	   }catch(e){
   	   	cb(e)
   	   }
   	   
  });



  passport.use(new GoogleStrategy({
       clientID: configAuth.googleAuth.clientID,
       clientSecret: configAuth.googleAuth.clientSecret,
       callbackURL: configAuth.googleAuth.callbackURL,
     },
     async function(accessToken, refreshToken, profile, cb) {
     	try{

        //console.log(profile);
     		
     		let user = {
     				profile_id:profile.id,
            username: profile.displayName,
            name:profile.name.givenName + profile.name.familyName,
            /*firstname: profile.name.givenName,
            lastname:profile.name.familyName,*/
     				provider:profile.provider,
   			    email:profile.emails[0].value,
            password: bcrypt.hashSync(profile.id, bcrypt.genSaltSync(8), null),
   			    role:'admin'
     		}
        console.log("useer___________________________",user);
     		let query= {
     			$or:[
     					{email:user.email},
     					//{_id:user.profile_id}
     			]
     		}
     		let getUser=await Sys.App.Services.UserServices.getUserData(query);
     		
     		if(getUser)
     		{
     			return cb(null, getUser);
     		}
     		else{
     			let insertedUser=await Sys.App.Services.UserServices.insertUserData(user);
          console.log("Inserted User",insertedUser);
     			if(insertedUser){
             return cb(null, insertedUser);
     			}else{
            console.log("player insersion error");
            return cb(null);
          }
          
			}

     	}catch(e){
     		console.log(e);
     	}
  
     	
     }
  ));
 

}