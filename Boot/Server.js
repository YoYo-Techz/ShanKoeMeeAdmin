'use strict';

var express = require('express');
var	http = require('http');
var fs = require('fs');
var join = require('path').join;
var path      = require("path");
var mongoose = require( 'mongoose' );
var nunjucks = require('nunjucks')
const session =  require('express-session');
var FileStore = require('session-file-store')(session);
var bodyParser = require('body-parser');
var fileUpload = require('express-fileupload');
var flash = require('connect-flash');
var passport = require('passport');
var cookieSession = require('cookie-session');
var jwt = require('jsonwebtoken');
var cron = require('node-cron');
const CronDatabase = require('./database_backup.js');
require('dotenv').config();


// var cookieSession = require('cookie-session');

var LocalStrategy = require('passport-local').Strategy;



//var routes = join(__dirname, '../routes');

var winston = require('winston'); // Logger
require('winston-daily-rotate-file'); // Sys Logger  Daily

var Sys  = new require('../Boot/Sys');

// SSL Setting Start
var fileStoreOptions = {};

var https_options = {

 key: fs.readFileSync("public/SSL/therummyround_private_key.txt"),

 cert: fs.readFileSync("public/SSL/therummyround_com.crt"),

 ca: [

         // fs.readFileSync('SSL/to/CA_root.crt'),

         fs.readFileSync('public/SSL/therummyround_com.ca-bundle')

      ]
};

// let app = express();
// https.createServer(options, app)
// Sys.App = require('https').createServer(https_options, app);
// SSL Setting End

// var fileStoreOptions = {};
Sys.App = express();

// Session
Sys.App.use(session({
	store: new FileStore(fileStoreOptions),
	secret: 'himanshu raval',
	resave: false,
	saveUninitialized: false,
}));

// Sys.App.use(cookieSession({
//   name: 'session',
//   keys: ["golfcookie"],
//   maxAge: 24 * 60 * 60 * 1000 // 24 hours
// }));

// Passport
Sys.App.use(passport.initialize());
Sys.App.use(passport.session());

// Body Parser

Sys.App.use(fileUpload());

// for parsing application/json
Sys.App.use(bodyParser.json());

// for parsing application/xwww-
Sys.App.use(bodyParser.urlencoded());
// Sys.App.use(bodyParser.urlencoded({ extended: true }));

// Flash  for Error & Message
Sys.App.use(flash());

// Set Views
nunjucks.configure('./App/Views', {
    autoescape: true,
    express: Sys.App,
    watch: false,
});
Sys.App.set('view engine', 'html');

Sys.App.use(express.static('./public'));

// https.createServer(options, app)
// Sys.Server = require('https').createServer(https_options, Sys.App);
//Sys.Server = require('https').Server(https_options, Sys.App);
Sys.Server = require('http').Server(https_options, Sys.App);



// Sys.App.use(cookieSession({
//   name: 'session',
//   keys:  ["golfcookie"],

//   // Cookie Options
//   maxAge: 24 * 60 * 60 * 1000 // 24 hours
// }))

// middleware to use session data in all routes
Sys.App.use(function(req,res,next){
    res.locals.session = req.session;
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.setHeader('Access-Control-Allow-Credentials', true);
    console.log("HOST : ",req.headers.host);
    next();
});


Sys.Config = new Array();
fs.readdirSync(join(__dirname, '../Config'))
  .filter(file => ~file.search(/^[^\.].*\.js$/))
  .forEach(function(file) {
  	Sys.Config[file.split('.')[0]] = require(join(join(__dirname, '../Config'), file))
});


// Logger Load
const myCustomLevels = {
  levels: {
    trace: 9,
			input: 8,
			verbose: 7,
			prompt: 6,
			debug: 5,
			info: 4,
			data: 3,
			help: 2,
			warn: 1,
			error: 0
  },
  colors: {
    trace: 'magenta',
			input: 'grey',
			verbose: 'cyan',
			prompt: 'grey',
			debug: 'blue',
			info: 'green',
			data: 'grey',
			help: 'cyan',
			warn: 'yellow',
			error: 'red'
  }
};

Sys.Log = winston.createLogger({

  format: winston.format.json(),
  levels: myCustomLevels.levels ,
  transports: [
    //
    // - Write to all logs with level `info` and below to `combined.log`
    // - Write all logs error (and below) to `error.log`.
    new (winston.transports.DailyRotateFile)({
	   filename: path.join(Sys.Config.App.logger.logFolder, '/'+ Sys.Config.App.logger.logFilePrefix +'-%DATE%.log'),
	   datePattern: 'DD-MM-YYYY', // YYYY-MM-DD-HH
	   zippedArchive: true,
	   maxSize: '20m',
	   maxFiles: '14d'
 	})
  ]
});


if (process.env.NODE_ENV !== 'production') {
  Sys.Log.add(new winston.transports.Console({
			level: 'debug',
			timestamp: true,
			format: winston.format.combine(
				winston.format.colorize(),
             	winston.format.simple(),
             	winston.format.timestamp(),
				winston.format.printf((info) => {
				   const {
				        timestamp, level, message, ...args
				   } = info;

				      const ts = timestamp.slice(0, 19).replace('T', ' ');
				      return `${ts} [${level}]: ${message} ${Object.keys(args).length ? JSON.stringify(args, null, 2) : ''}`;
				})
            ),
	}));
}



Sys.Log.info('Initializing Server...');


fs.readdirSync(path.join(__dirname, '../','./App'))
.filter(function(file) {
	return (file.indexOf(".") !== 0) && (file.indexOf(".") === -1);
})
.forEach(function(dir) {
	if(dir != 'Views' && dir != 'Routes'){ // Ignore Load Views & Routes in Sys Object
		Sys.App[dir] = {};
		Sys.Log.info('Loading... App '+dir);
		fs
		.readdirSync(path.join(__dirname,  '../', './App', dir))
		.filter(function(file) {
			return (file.indexOf(".") !== 0);
		})
		.forEach(function(file) {
			Sys.App[dir][file.split('.')[0]] = require(path.join(__dirname,  '../', './App', dir, file));
		});
	}

});

Sys.Log.info('Loading... Router');
// Load Router
fs.readdirSync(join(__dirname, '../App/Routes'))
  .filter(file => ~file.search(/^[^\.].*\.js$/))
  .forEach(function(file) {
	Sys.App.use('/', require(join(join(__dirname, '../App/Routes'), file))); // Register Router to app.use
});


Sys.Log.info('Loading... Game Server.');
Sys.Game = {};

// function loadGameDirectory(dirPath) {

// 	console.log("Data -->",dirPath)
// 	if (fs.existsSync(path.join(__dirname,  '../', './Game', dirPath))) {
// 		console.log("Folder Exist");
// 		fs.readdirSync(path.join(__dirname,  '../', './Game', dirPath)).filter(function(file) {
// 			console.log("++++++++++++++++>",file);
// 			return (file.indexOf(".") !== 0);
// 		}).forEach(function(subDir) {
// 			dirPath = dirPath+'/'+subDir;
// 			console.log(">>>",dirPath);
// 			if(fs.lstatSync(path.join(__dirname,  '../', './Game', dirPath)).isFile()){
// 				console.log("It is File :");
// 			}else{
// 				console.log("{{{{{{{{",dirPath);
// 				loadGameDirectory(dirPath);
// 			}

// 		});
// 	}else{
// 		console.log("File Exist");
// 	}

// };

// fs.readdirSync(path.join(__dirname, '../','./Game'))
// .filter(function(file) {
// 	return (file.indexOf(".") !== 0) && (file.indexOf(".") === -1);

// }).forEach(function(dir) {
// 	loadGameDirectory(dir);
// });



let insidePath = null;
fs.readdirSync(path.join(__dirname, '../','./Game'))
.filter(function(file) {
	return (file.indexOf(".") !== 0) && (file.indexOf(".") === -1);
}).forEach(function(dir) {
		Sys.Game[dir] = {};
		//Sys.Log.info('Loading... Game '+dir);
		fs.readdirSync(path.join(__dirname,  '../', './Game', dir)).filter(function(file) {
			return (file.indexOf(".") !== 0);
		}).forEach(function(subDir) {

				//Sys.Log.info('Loading... Game Sub Directory :'+subDir);
				insidePath = dir+'/'+subDir;
				if (fs.existsSync(path.join(__dirname,  '../', './Game', insidePath))) {
					if(fs.lstatSync(path.join(__dirname,  '../', './Game', insidePath)).isFile()){
						//Sys.Log.info('Loading... File :'+subDir);
						 Sys.Game[dir][subDir.split('.')[0]] = require(path.join(__dirname,  '../', './Game', dir, subDir)); // Add File in Sub Folder Object
					}else{
						Sys.Game[dir][subDir] = {};
						//Sys.Log.info('Loading... Game Sub Directory Folder:'+insidePath);

						fs.readdirSync(path.join(__dirname,  '../', './Game', insidePath)).filter(function(file) {
							return (file.indexOf(".") !== 0);
						}).forEach(function(subInnerDir) {
							insidePath = dir+'/'+subDir+'/'+subInnerDir;
							//Sys.Log.info('Loading... Game Sub  Inner Directory :'+subInnerDir);
							if(fs.lstatSync(path.join(__dirname,  '../', './Game', insidePath)).isFile()){
								//Sys.Log.info('Loading... Sub  File :'+subInnerDir);
								 Sys.Game[dir][subDir][subInnerDir.split('.')[0]] = require(path.join(__dirname,  '../', './Game', dir+'/'+subDir, subInnerDir)); // Add File in Sub Folder Object
							}else{
								Sys.Game[dir][subDir][subInnerDir] = {};
								//Sys.Log.info('Loading... Game Sub Inner Directory Folder:'+insidePath);

								fs.readdirSync(path.join(__dirname,  '../', './Game', insidePath)).filter(function(file) {
									return (file.indexOf(".") !== 0);
								}).forEach(function(subInnerLastDir) {
									insidePath = dir+'/'+subDir+'/'+subInnerDir+'/'+subInnerLastDir;
								//	Sys.Log.info('Loading... Game Sub  Inner Directory :'+subInnerLastDir);
									if(fs.lstatSync(path.join(__dirname,  '../', './Game', insidePath)).isFile()){
									//	Sys.Log.info('Loading... Sub Last  File :'+subInnerLastDir);
										Sys.Game[dir][subDir][subInnerDir][subInnerLastDir.split('.')[0]] = require(path.join(__dirname,  '../', './Game', dir+'/'+subDir+'/'+subInnerDir, subInnerLastDir)); // Add File in Sub Folder Object
									}else{
									//	Sys.Log.info('Loading... Sub Last  Folder Plase Change Your Code:'+subInnerLastDir);
									}

								});
							}
						});

					}

				}

		});

});



// Load Sys
// Sys.ThreeCards = {
// 				Sockets : {},
// 				Routes : {},
// 				Entities : {},
// 				Services : {},
// 				Controllers : {},
// 				Models : {}
// 			};

// fs.readdirSync(path.join(__dirname, '../','./ThreeCards'))
// .filter(function(file) {
// 	return (file.indexOf(".") !== 0) && (file.indexOf(".") === -1);
// })
// .forEach(function(dir) {
// 	Sys.Log.info('Loading... Sys '+dir);
// 	fs
// 	.readdirSync(path.join(__dirname,  '../', './ThreeCards', dir))
// 	.filter(function(file) {
// 		return (file.indexOf(".") !== 0);
// 	})
// 	.forEach(function(file) {
// 		Sys.ThreeCards[dir][file.split('.')[0]] = require(path.join(__dirname,  '../', './ThreeCards', dir, file));
// 	});

// });


Sys.Log.info('Initializing Variables');
Sys.Rooms = [];
Sys.Timers = [];

Sys.Log.info('Loading... DB Connection');
// Mongodb Connection
var dbURI = process.env.MONGODB_URI;

console.log(dbURI);
mongoose.connect(dbURI,Sys.Config.Database.option);

// CONNECTION EVENTS
// When successfully connected
mongoose.connection.on('connected', async function () {
	Sys.Namespace = [];
	Sys.Log.info('Mongoose default connection open to ' + dbURI);
	await Sys.Game.Practice.Points.Services.RoomServices.resetAllRoom();
	Sys.Io = require('socket.io')(Sys.Server,{'pingTimeout' :Sys.Config.Socket.pingTimeout,'pingInterval' : Sys.Config.Socket.pingInterval});
	 Sys.Log.info('Loading... Socket');

	 Sys.Io.on('connection',async function(socket) {
		Sys.Log.info('Some One Connected :'+socket.id);
			Object.keys(Sys.Game.Common.Sockets).forEach(function(key){ // Register Socket File in Socket Variable
				Sys.Game.Common.Sockets[key](socket)
			})
	 });

	// Practice Point Namespace

	Sys.Io.of(Sys.Config.Namespace.PracticePoints).on('connection', function(socket){
		console.log('User Connected To Practice Points New Namespace');
		Object.keys(Sys.Game.Practice.Points.Sockets).forEach(function(key){ // Register Socket File in Socket Variable
		   Sys.Game.Practice.Points.Sockets[key](socket)
	   	})
	});


	// Practice Pool Namespace
	Sys.Io.of(Sys.Config.Namespace.PracticePool).on('connection', function(socket){
		console.log('User Connected To Practice Pool New Namespace');
		Object.keys(Sys.Game.Practice.Pool.Sockets).forEach(function(key){ // Register Socket File in Socket Variable
			Sys.Game.Practice.Pool.Sockets[key](socket)
	   })
   	});

	// // Practice Deals Namespace
	Sys.Io.of(Sys.Config.Namespace.PracticeDeals).on('connection', function(socket){
		console.log('User Connected To Practice Deals New Namespace');
		Object.keys(Sys.Game.Practice.Deals.Sockets).forEach(function(key){ // Register Socket File in Socket Variable
		   Sys.Game.Practice.Deals.Sockets[key](socket)
	   })
	});

	Sys.Io.of(Sys.Config.Namespace.PracticePointsTwentyOne).on('connection', function(socket){
		console.log('User Connected To Practice Points 21 New Namespace');
		Object.keys(Sys.Game.Practice.PointsTwentyOne.Sockets).forEach(function(key){ // Register Socket File in Socket Variable
			 Sys.Game.Practice.PointsTwentyOne.Sockets[key](socket)
			})
	});

	Sys.Io.of(Sys.Config.Namespace.PracticePointsTwentyFour).on('connection', function(socket){
		console.log('User Connected To Practice Points 24 New Namespace');
		Object.keys(Sys.Game.Practice.PointsTwentyFour.Sockets).forEach(function(key){ // Register Socket File in Socket Variable
			 Sys.Game.Practice.PointsTwentyFour.Sockets[key](socket)
			})
	});
    /**
	 * Cash Socket
	 */

	// Cash Game Points
	Sys.Io.of(Sys.Config.Namespace.CashPoints).on('connection', function(socket){
 		console.log('User Connected To Cash Points New Namespace');
 		Object.keys(Sys.Game.CashGame.Points.Sockets).forEach(function(key){ // Register Socket File in Socket Variable
 		   Sys.Game.CashGame.Points.Sockets[key](socket)
 	   })
	 });

    // Cash Game Pool
	Sys.Io.of(Sys.Config.Namespace.CashPool).on('connection', function(socket){
  		console.log('User Connected To Cash Pool New Namespace');
		  Object.keys(Sys.Game.CashGame.Pool.Sockets).forEach(function(key){ // Register Socket File in Socket Variable
  		   Sys.Game.CashGame.Pool.Sockets[key](socket)
  	   })
	});

	// Cash Game Deal
	Sys.Io.of(Sys.Config.Namespace.CashDeals).on('connection', function(socket){
	 	console.log('User Connected To Cash Deals New Namespace');
	 	Object.keys(Sys.Game.CashGame.Deals.Sockets).forEach(function(key){ // Register Socket File in Socket Variable
	 		Sys.Game.CashGame.Deals.Sockets[key](socket)
	 	})
	});

	Sys.Io.of(Sys.Config.Namespace.CashPointsTwentyOne).on('connection', function(socket){
		console.log('User Connected To Cash Points 21 New Namespace');
		Object.keys(Sys.Game.CashGame.CashTwentyOne.Sockets).forEach(function(key){ // Register Socket File in Socket Variable
			 Sys.Game.CashGame.CashTwentyOne.Sockets[key](socket)
			})
	});

	Sys.Io.of(Sys.Config.Namespace.CashPointsTwentyFour).on('connection', function(socket){
		console.log('User Connected To Cash Points 24 New Namespace');
		Object.keys(Sys.Game.CashGame.CashTwentyFour.Sockets).forEach(function(key){ // Register Socket File in Socket Variable
			 Sys.Game.CashGame.CashTwentyFour.Sockets[key](socket)
			})
	});


	Sys.Server.listen(Sys.Config.Socket.port,function() {
		Sys.App.use(function(req, res, next) {
			res.render('404.html');
		});

		cron.schedule('59 23 * * *', () => {
		  console.log('running a club status task every day at 11:59 PM....');
		  Sys.App.Controllers.PlayerController.updateClubStatusCronJob();
		});

		console.log("(---------------------------------------------------------------)");
		console.log(" |                    Server Started...                        |");
		console.log(" |                  http://"+Sys.Config.Database[Sys.Config.Database.connectionType].mongo.host+":"+Sys.Config.Socket.port+"                      |");
		console.log("(---------------------------------------------------------------)");


		// setInterval(function(){
		// 	const {rss,heapTotal} = process.memoryUsage();
		// 	// Send Broadcast only for Dashboard
		// 	let data = {
		// 		rss : parseInt(rss/1024/1024),
		// 		heap : parseInt(heapTotal/1024/1024),
		// 	}
		// 	console.log("Memory :",data)
		// }, 1000);

		//Sys.Log.info('Server Start.... Port :'+Sys.Config.Socket.port);
	});

});

// If the connection throws an error
mongoose.connection.on('error',async function (err) {
  Sys.Log.info('Mongoose default connection error: ' + err);
});

// When the connection is disconnected
mongoose.connection.on('disconnected', function () {
  Sys.Log.info('Mongoose default connection disconnected');
});

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', function() {
  mongoose.connection.close(function () {
    Sys.Log.info('Mongoose default connection disconnected through app termination');
    process.exit(0);
  });
});

// //Payment Status Update
// cron.schedule('* * * * *', () => {
//   Sys.App.Controllers.TransactController.checkPaymentInfo();
// });
// // AutoBackUp MongoDb Database  every Day (at 12:00 AM)
// cron.schedule('59 11 * * *', () => {
//   CronDatabase.dbAutoBackUp();
// });
module.exports = {app: Sys.App, server: Sys.Server};
