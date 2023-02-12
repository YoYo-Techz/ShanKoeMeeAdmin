module.exports = {
	connectionType :  'local',
	option : {
		autoIndex: false, // Don't build indexes
	  	reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
	  	reconnectInterval: 500, // Reconnect every 500ms
	  	poolSize: 10, // Maintain up to 10 socket connections
	  	// If not connected, return errors immediately rather than waiting for reconnect
	  	bufferMaxEntries: 0,
	    useNewUrlParser: true,
	    poolSize: 2,
	    promiseLibrary: global.Promise
	},

	local: {
		mode: 'local',
		mongo: {
			host: '164.52.199.98',
			port: 26767,
			user: 'rummys_admin',
			password : 'Kiranku123$',
			database: 'rummys'
		}

	},
	staging: {
			mode: 'staging',
			mongo: {
				host: '164.52.199.98',
				port: 26767,
				user: 'rummys_admin',
				password : 'Kiranku123$',
				database: 'rummys'
			}
	},
	production: {
		mode: 'production',
		mongo: {
			host: '164.52.199.98',
			port: 26767,
			user: 'rummys_admin',
			password : 'Kiranku123$',
			database: 'rummys'
		}
	}
}
