'use strict';

var express = require('express')
  , router = express.Router()


// Load Controllers  
//var mycont = require('../controllers/mycontroller');
  



// router.get('/coinpayment', async function(req, res) {
//   client.createTransaction({
// 				'currency1' : 'LTC',
// 				'currency2' : 'LTC',
// 				'amount' : 2.123
// 	 }, await function(err,result){
// 					if(err) {
// 							console.log(err); 
// 					}
// 					 console.log(result);
// 					 return res.send({result : result});
// 		});
// });



// router.get('/session', async function(req, res) {
// 	var sess = req.session
//   if (sess.views) {
//     sess.views++
//     res.setHeader('Content-Type', 'text/html')
//     res.write('<p>views: ' + sess.views + '</p>')
//     res.write('<p>expires in: ' + (sess.cookie.maxAge / 1000) + 's</p>')
//     res.end()
//   } else {
//     sess.views = 1
//     res.end('welcome to the session demo. refresh!')
//   }
 
// });



//var server = require('../config/server');

// console.log("Rooms Show ->",Sys.Rooms);

//  Sys.Rooms[123] = {
//  	City : "Ahemdabad"
//  };

router.get('/', async function(req, res) {
	res.render('index.html');
});

// router.get('/test-controller', async function(req, res) {
//   mycont.test(req, res);
// });



// router.get('/test',  async function(req, res) {

// 	test.create({ title: 'shiv_tets' }, function (err, awesome_instance) {
// 	  if (err) return res.send(err);
// 	  // saved!
// 	  console.log("awesome_instance ",awesome_instance);
// 	  res.send('Record Saved!');

// 	});
// })

// Car models page
// router.get('/test2', async  function(req, res) {
// 	//       console.log("4Rooms Show ->",server.Rooms[123]);
// 	// server.Rooms[123] = {
//  // 	City : "Test 2",
//  // 	State : "Gujarat",
//  // 	Mobile : 9998000756,
//  // 	NAme : "Hiamnshu Raval"
//  // }
//   res.send('Audi Q7, BMW X5, Mercedes GL')
// })

// router.get('/insert_user', async  function(req, res) {
//  	User.create({ name: 'Mahadev',email:'himansu@hr.com' }, function (err, awesome_instance) {
// 	  if (err) return res.send("Erro:"+err);
// 	  // saved!
// 	  console.log("awesome_instance ",awesome_instance);
// 	  res.send('Record Saved!');

// 	});
  
// })


// router.get('/insert_room', async  function(req, res) {
//  	Room.create({ name: 'Shiv',user:'5b50973e0f89e1408aa3afa2' }, function (err, awesome_instance) {
// 	  if (err) return res.send("Erro:"+err);
// 	  // saved!
// 	  console.log("awesome_instance ",awesome_instance);
// 	  res.send('Record Saved!');

// 	});
  
// })


// router.get('/show', async  function(req, res) {
//  	Room.findOne({ name: 'Shiv'}).populate('user').exec(function (err, room) {
//     if (err) return res.send("Erro:"+err);
//     console.log('The Name is %s', room.user.name);
//     res.send('Found');
//     // prints "The author is Ian Fleming"
//   });
  
// })

 
module.exports = router