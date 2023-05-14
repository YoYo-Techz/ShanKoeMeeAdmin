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
			host: process.env.DB_HOST,
			user: process.env.DB_USER,
			password: process.env.DB_PASSWORD,
			database: process.env.DB_NAME,
			port: process.env.DB_PORT,
		}

	},
	staging: {
			mode: 'staging',
			mongo: {
				host: process.env.DB_HOST,
				user: process.env.DB_USER,
				password: process.env.DB_PASSWORD,
				database: process.env.DB_NAME,
				port: process.env.DB_PORT,
			}
	},
	production: {
		mode: 'production',
		mongo: {
			host: process.env.DB_HOST,
			user: process.env.DB_USER,
			password: process.env.DB_PASSWORD,
			database: process.env.DB_NAME,
			port: process.env.DB_PORT,
		}
	}
}
