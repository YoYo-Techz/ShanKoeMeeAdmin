const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const TournamentSchema = new Schema({
			 name: {
                type: 'string',
                required: true
            },
            min_players: {
				type: 'number',
				required: true
            },
            max_players: {
				type: 'number',
				required: true
            },
            register_from: {
				type: 'string',
				required: true
            },
            tournament_date_time: {
				type: 'string',
				required: true
			},
            description: {
				type: 'string',
				required: true
			},
			blind_level: {
				type: 'number',
				required: true
			},
			breaks_start_in: {
				type: 'number',
				required: true
			},
			breaks_time: {
				type: 'number',
				required: true
			},
			stacks: {
				type: 'string',
				required: true
			},
			status: {
				type: 'string',
				required: true
			},
			buy_in: {
				type: 'number',
				required: true
			},
			entry_fee: {
				type: 'number',
				required: true
            },
			players: {
				type: 'array',
				defaultsTo: []
			},
			rooms: {
				type: 'array',
				defaultsTo: []
            },
	},{ collection: 'tournaments' });
mongoose.model('tournaments', TournamentSchema);
 
