'use strict';

const mongoose = require('mongoose');
const User = mongoose.model('user');

class myservices {
    async testServices(data){
        console.log("My SErvices Worked");
        return "Data ->"+data
    }

    async addServices(data){
    	console.log("save Before");
		const user = new User({ title: 'Himanshu' });
		try {
		    // I'm awaiting the result of my save operation
		    const saveResult = await user.save();
		    // Return the created object as result	
		    	  console.log("My SErvices Record Saved! ");
		           return "Data ->"+saveResult;
		     
		  } catch(err) { // Something went wrong
		    // Pass back the error
		    return  err;
		  }

			console.log("save After");

    }


    async updateServices(data){
    	console.log("save Before");

    	User.findById('5b4345df892b535b63dffd40', (err, user) => {
    // This assumes all the fields of the object is present in the body.
    user.title = 'Himanshu Raval';
     
    user.save((saveErr, updatedUser) => {
        return "Data ->"+updatedUser;
    });
});

		// const user = new User({ title: 'shiv_tets' },{$set:{title:"Naomi"}});
		// try {
		//     // I'm awaiting the result of my save operation
		//     const saveResult = await user.update();
		//     // Return the created object as result	
		//     	  console.log("My SErvices Record Updated! ");
		//            return "Data ->"+saveResult;
		     
		//   } catch(err) { // Something went wrong
		//     // Pass back the error
		//     console.log(err);
		//     return  err;
		//   }

	console.log("save After");

    }



}
module.exports  = myservices