var Sys = require('../../../../Boot/Sys');


module.exports = {

	joinRoom: async function (socket, data) {
		try {
			let player = await Sys.Game.Practice.Points.Services.PlayerServices.getById(data.playerId);
			if (!player) {
				return { status: 'fail', result: null, message: 'No Player Found!.', statusCode: 401 }
			}
			data.socketId = socket.id; // Player Socket ID.
			if (parseInt(player.chips) < parseInt(data.entryFees)) {
				return { status: 'fail', message: 'Insufficient chips.' };
			}

			let room = await Sys.Game.Practice.Points.Controllers.RoomProcess.checkRoomSeatAvilability(data);
			if (room instanceof Error) {
				return { status: 'fail', result: null, message: room.message, statusCode: 401 }
			}

			//console.log(".................................................................")
			//console.log("Room ID :",room.id)
			//console.log(".................................................................")

			data.roomId = room.id; // Save Room Id

			room = await Sys.Game.Practice.Points.Controllers.RoomProcess.joinRoom(player, data);
			if (room instanceof Error) {
				return { status: 'fail', result: null, message: room.message, statusCode: 401 }
			}
			socket.join(room.id); // Subscribe Room.
			socket.myData = {};
			socket.myData.roomID = room.id;
			socket.myData.gameType = 'points';
			socket.myData.playerID = player.id;
			socket.myData.roomID = room.id;

			return {
				status: 'success',
				message: "Player Room Joind successfuly.",
				result: {
					roomId: room.id
				}
			};
		} catch (error) {
			Sys.Log.info('Error in joinRoom : ' + error);
			return new Error('Error in joinRoom');
		}
	},

	rejoinRoom:async function(socket,data){
		try{
			let player = await Sys.Game.Practice.Points.Services.PlayerServices.getById(data.playerId);
			if (!player) {
				return { status: 'fail', result: null, message: 'No Player Found!.', statusCode: 401 }
			}
			data.socketId = socket.id; // Player Socket ID.

			let room = await Sys.Game.Practice.Points.Services.RoomServices.get(data.roomId);
			// let room = await Sys.Game.Practice.Points.Services.RoomServices.getActiveRoom(data);
			// let room = await Sys.Game.Practice.Points.Controllers.RoomProcess.checkRoomSeatAvilability(data);
			if (room instanceof Error || room.length < 1) {
				return { status: 'fail', result: null, message: room.message, statusCode: 401 }
			}

			//console.log(".................................................................")
			// //console.log("Room ID :",room[0]._id)
			//console.log(".................................................................")

			// data.roomId = room[0]._id; // Save Room Id
			 room = await Sys.Game.Practice.Points.Controllers.RoomProcess.joinRoom(player, data);
			if (room instanceof Error) {
				return { status: 'fail', result: null, message: room.message, statusCode: 401 }
			}
			socket.join(room.id); // Subscribe Room.
			socket.myData = {};
			socket.myData.roomID = room.id;
			socket.myData.gameType = 'points';
			socket.myData.playerID = player.id;
			socket.myData.roomID = room.id;

			// check for player is present in table
			let palyeravilable = false;
      for (let i = 0; i < room.players.length; i++) {
        if ( room.players[i].id == data.playerId && room.players[i].status != 'Left' ) {
          palyeravilable = true;
          break
        }
      }
      if(!palyeravilable){
        return { status: 'fail',result: null,message: "Player Not Found!",	statusCode: 401	};
      }

			// joker Cards broadcast
			if (room.status =='Running') {
				setTimeout(async function(){
					// Send Room Joker Cards & OpneDeck Card information
		      let isPrintedJoker  = false;
		      let jokerCard       = room.game.jokerCard[0];
		      if (room.game.jokerCard[0] == 'PJ') {
		        isPrintedJoker  = true;
		        jokerCard       = 'AS';
		      }
		      let joObj = {
		        // upperJoker2     : '',
		        // upperJoker1     : room.game.upperJoker[0],
		        // lowerJoker2     : '',
		        // lowerJoker1     : room.game.lowerJoker[0],
		        jokerCard       : jokerCard,
		        OpenCard        : room.game.openDeck[room.game.openDeck.length-1],
		        isPrintedJoker  : isPrintedJoker,
		        isReJoin				: true
		      }
					await Sys.Io.of(Sys.Config.Namespace.PracticePoints).to(socket.id).emit('JokerOpenCardInfo', joObj);
					room.players.forEach(async function (player) {
						let playerCards = {
							playerId : player.id,
							cards : player.cards,
						};
						// //console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
						// //console.log("COUNTTURN",player.turnCount);
						// //console.log("GAME ID:",room.game.id);
						// //console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
						if(room.status=='Running' && player.id == data.playerId )
						{
							if ( player.turnCount < 2 ) {
								//console.log("PLAYER TURN COUNT111",player.turnCount);
								//console.log("player.username111",player.username);
								//console.log("PlayerDeck111",playerCards)
								await Sys.Io.of(Sys.Config.Namespace.PracticePoints).to(socket.id).emit('PlayerDeck', playerCards);
							} else {
								//console.log("PLAYER TURN COUNT222",player.turnCount);
								//console.log("player.username222",player.username);
								if (player.turnCount==2) {
								await Sys.Io.of(Sys.Config.Namespace.PracticePoints).to(socket.id).emit('PlayerDeck', playerCards);
									//console.log("PLAYER DECK DATA",playerCards);
								}
								await Sys.Io.of(Sys.Config.Namespace.PracticePoints).to(socket.id).emit('ReconnectPlayerDeck', playerCards);
								//console.log("ReconnectPlayerDeck222",playerCards)
							}
						}

					});
					await Sys.Io.of(Sys.Config.Namespace.PracticePoints).to(socket.id).emit('TurnPlayer', {
	          playerId: room.getCurrentPlayer().id
	        });
				}, 1000)

			}


			//console.log("////////////////////////////////////////////////////////////");
			//console.log("////////////////////////////////////////////////////////////");
			//console.log("////////////////////////////////////////////////////////////");
			//console.log("reached this checkpoint", {
			// 	status: 'success',
			// 	message: "Player Room Joind successfuly.",
			// 	result: {
			// 		roomId: room.id
			// 	}
			// });
			//console.log("////////////////////////////////////////////////////////////");
			//console.log("////////////////////////////////////////////////////////////");
			//console.log("////////////////////////////////////////////////////////////");
			return {
				status: 'success',
				message: "Player Room Joind successfuly.",
				result: {
					roomId: room.id
				}
			};
		}
		catch(e){
			//console.log('e',e)
		}
	},

	pushOpenDeck: async function (socket, data) {
		try {
			let action = await Sys.Game.Practice.Points.Controllers.RoomProcess.pushOpenDeck(data);
			if (action instanceof Error) {
				return { status: 'fail', result: null, message: action.message, statusCode: 401 }
			}
			return {
				status: 'success',
				result: null,
				data: action,
				message: 'Player action successful.'
			};
		} catch (error) {
			Sys.Log.info('Error in pushOpenDeck : ' + error);
			return new Error('Error in pushOpenDeck');
		}
	},

	popOpenDeck: async function (socket, data) {
		try {
			let action = await Sys.Game.Practice.Points.Controllers.RoomProcess.popOpenDeck(data);
			if (action instanceof Error) {
				return { status: 'fail', result: null, message: action.message, statusCode: 401 }
			}
			return {
				status: 'success',
				result: null,
				data: action,
				message: 'Player action successful.'
			};
		} catch (error) {
			Sys.Log.info('Error in popOpenDeck : ' + error);
			return new Error('Error in popOpenDeck');
		}
	},

	popCloseDeck: async function (socket, data) {
		try {
			let action = await Sys.Game.Practice.Points.Controllers.RoomProcess.popCloseDeck(data);
			if (action instanceof Error) {
				return { status: 'fail', result: null, message: action.message, statusCode: 401 }
			}
			return {
				status: 'success',
				result: null,
				data: action,
				message: 'Player action successful.'
			};
		} catch (error) {
			Sys.Log.info('Error in popCloseDeck : ' + error);
			return new Error('Error in popCloseDeck');
		}
	},

	openCloseJoker : async function(socket,data){
		try {
			////console.log("Data",data);
			let room = await Sys.Game.Practice.Points.Services.RoomServices.get(data.roomId);
			 //console.log("Room ::",room.status);

				if (!room) {
					return { status: 'fail',result: null,message: "Room not found",	statusCode: 401	};
				}
				if(room.status != 'Running'){
					return { status: 'fail',result: null,message: "Room Not Running",	statusCode: 401	};
				}
				if(room.game.status != 'Running'){
					return { status: 'fail',result: null,message: "Game Not Running",	statusCode: 401	};
				}
				let joObj = {
					jokerCard : room.game.jokerCard[0],
					OpenCard : room.game.openDeck[room.game.openDeck.length-1]
				}
				////console.log("joObj" ,joObj);
				return { status: 'success',result: joObj,
				message: "Room Data",	statusCode: 200	};

		} catch (error) {
			Sys.Log.info('Error in openCloseJoker : ' + error);
			return new Error('Error in openCloseJoker');
		}
	},

	leaveRoom: async function (socket, data) {
		try {
			let responce = await Sys.Game.Practice.Points.Controllers.RoomProcess.leaveRoom(data);
			if (responce instanceof Error) {
				return { status: 'fail', result: null, message: responce.message, statusCode: 401 }
			}
			socket.leave(data.roomId);
			if (responce.status == 'success') {
				socket.leave(data.roomId);
				return {
					status: 'success',
					message: 'Player Leave successfuly.',
					result: null
				};
			} else {
				return {
					status: 'fail',
					message: 'Something Wont wrong',
					result: null
				};
			}
		} catch (error) {
			Sys.Log.info('Error in leaveRoom : ' + error);
			return new Error('Error in leaveRoom');
		}
	},

	getOpenDeckList: async function (socket, data) {
		try {
			let action = await Sys.Game.Practice.Points.Controllers.RoomProcess.getOpenDeckList(data);
			if (action instanceof Error) {
				return { status: 'fail', result: null, message: action.message, statusCode: 401 }
			}
			return {
				status: 'success',
				result: null,
				data: action,
				message: 'Player action successful.'
			};
		} catch (error) {
			Sys.Log.info('Error in getOpenDeckList : ' + error);
			return new Error('Error in getOpenDeckList');
		}
	},

	playerDrop: async function (socket, data) {
		try {
			let action = await Sys.Game.Practice.Points.Controllers.RoomProcess.playerDrop(data);
			if (action instanceof Error) {
				return { status: 'fail', result: null, message: action.message, statusCode: 401 }
			}
			return {
				status: 'success',
				result: null,
				data: action,
				message: 'Player action successful.'
			};
		} catch (error) {
			Sys.Log.info('Error in playerDrop : ' + error);
			return new Error('Error in playerDrop');
		}
	},

	playerCardsScore: async function (socket, data) {
		try {
			let action = await Sys.Game.Practice.Points.Controllers.RoomProcess.playerCardsScore(data);
			if (action instanceof Error) {
				return { status: 'fail', result: null, message: action.message, statusCode: 401 }
			}
			return {
				status: 'success',
				result: null,
				data: action,
				message: 'Player action successful.'
			};
		} catch (error) {
			Sys.Log.info('Error in playerCardsScore : ' + error);
			return new Error('Error in playerCardsScore');
		}
	},

	playerTableCards: async function (socket, data) {
		try {
			let action = await Sys.Game.Practice.Points.Controllers.RoomProcess.playerTableCards(data);
			if (action instanceof Error) {
				return { status: 'fail', result: null, message: action.message, statusCode: 401 }
			}
			return {
				status: 'success',
				result: null,
				data: action,
				message: 'Player action successful.'
			};
		} catch (error) {
			Sys.Log.info('Error in playerTableCards : ' + error);
			return new Error('Error in playerTableCards');
		}
	},

	playerCards: async function (socket, data) {
		try {
			//console.log("playerCards called", data);
			let action = await Sys.Game.Practice.Points.Controllers.RoomProcess.playerCards(data);
			if (action instanceof Error) {
				return { status: 'fail', result: null, message: action.message, statusCode: 401 }
			}
			//console.log("##############################################");
			//console.log("action",action);
			return {
				status: 'success',
				result: null,
				data: action,
				message: 'Player action successful.'
			};
		} catch (error) {
			Sys.Log.info('Error in playerCardsScore : ' + error);
			return new Error('Error in playerCardsScore');
		}
	},

	popOpenDeck: async function (socket, data) {
		try {
			let action = await Sys.Game.Practice.Points.Controllers.RoomProcess.popOpenDeck(data);
			if (action instanceof Error) {
				return { status: 'fail', result: null, message: action.message, statusCode: 401 }
			}
			return {
				status: 'success',
				result: null,
				data: action,
				message: 'Player action successful.'
			};
		} catch (error) {
			Sys.Log.info('Error in popOpenDeck : ' + error);
			return new Error('Error in popOpenDeck');
		}
	},

	declarefinishGame: async function (socket, data) {
		try {
			let action = await Sys.Game.Practice.Points.Controllers.RoomProcess.declarefinishGame(data);
			if (action instanceof Error) {
				return { status: 'fail', result: null, message: action.message, statusCode: 401 }
			}
			return {
				status: 'success',
				result: null,
				data: action,
				message: 'Player action successful.'
			};
		} catch (error) {
			Sys.Log.info('Error in declarefinishGame : ' + error);
			return new Error('Error in declarefinishGame');
		}
	},

	declareGame: async function (socket, data) {
		try {
			let action = await Sys.Game.Practice.Points.Controllers.RoomProcess.declareGame(data);
			if (action instanceof Error) {
				return { status: 'fail', result: null, message: action.message, statusCode: 401 }
			}
			return {
				status: 'success',
				result: null,
				data: action,
				message: 'Player action successful.'
			};
		} catch (error) {
			Sys.Log.info('Error in declareGame : ' + error);
			return new Error('Error in declareGame');
		}
	},

	reconnectGame: async function (socket, data) {
		try {
			let player = await Sys.Game.Practice.Points.Services.PlayerServices.getById(data.playerId);
			if (!player) {
				return { status: 'fail', result: null, message: 'No Player Found!.', statusCode: 401 }
			}
			let room = await Sys.Game.Practice.Points.Controllers.RoomProcess.findGame(data);
			if (room instanceof Error) {
				return { status: 'fail', result: null, message: room.message, statusCode: 401 }
			}
			socket.join(room.id); // Subscribe Room.

			room = await Sys.Game.Practice.Points.Controllers.RoomProcess.reconnectGame(socket, data);
			if (room instanceof Error) {
				return { status: 'fail', result: null, message: room.message, statusCode: 401 }
			}

			socket.myData = {};
			socket.myData.roomID = room.id;
			socket.myData.gameType = 'points';
			socket.myData.playerID = player.id;
			socket.myData.roomID = room.id;

			return {
				status: 'success',
				message: "Player Room Joind successfuly.",
				result: {
					roomId: room.id
				}
			};

		} catch (error) {
			Sys.Log.info('Error in reconnectGame : ' + error);
			return new Error('Error in reconnectGame');
		}
	},

	disconnectPlayer: async function (socket, data) {
		try {
			let player = await Sys.Game.Practice.Points.Services.PlayerServices.getById(data.playerID);
			if (!player) {
				return { status: 'fail', result: null, message: 'No Player Found!.', statusCode: 401 }
			}

			let room = await Sys.Game.Practice.Points.Services.RoomServices.get(data.roomID);
			if (!room) {
				return { status: 'fail', result: null, message: "Room not found", statusCode: 401 };
			}

				let leaveRoomData = {
					playerId: data.playerID,
					roomId: data.roomID
				}

				// let responce = await Sys.Game.Practice.Points.Controllers.RoomProcess.leaveRoom(leaveRoomData);
				// if (responce instanceof Error) {
				// 	return { status: 'fail', result: null, message: responce.message, statusCode: 401 }
				// }
				// if (responce.status == 'success') {
				// 	socket.leave(data.roomId);
				// 	return {
				// 		status: 'success',
				// 		message: 'Player Leave successfuly.',
				// 		result: null
				// 	};
				// } else {
				// 	return {
				// 		status: 'fail',
				// 		message: 'Something Wont wrong',
				// 		result: null
				// 	};
				// }
		} catch (error) {
			Sys.Log.info('Error in disconnectPlayer : ' + error);
			return new Error('Error in disconnectPlayer');
		}
	},

	finalCardString: async function (socket, data){
		try{
			let room = await Sys.Game.Practice.Points.Services.RoomServices.get(data.roomId);

			if (!room) {
				return {
					status: 'fail',
					result: null,
					message: "Room not found",
					statusCode: 401
				};
			}
			if (room.status != 'Running') {
				return new Error('Game Finished. Please Try Again!');
			}


			for (let i=0; i < room.players.length; i += 1) {
				if (room.players[i].id == data.playerId && room.players[i].dropped == false) {
					room.players[i].cardsString       = data.cardsString;
					room.players[i].playerScore       = data.score;
					break;
				}
			}
			roomUpdated = await Sys.Game.Practice.Points.Services.RoomServices.update(room);

			return {
				status: 'sucess',
				result:  data.cardsString,
				message: "Socre Updated",
				statusCode: 200
			};
		}catch (error) {
			Sys.Log.info('Error in finalCardString : ' + error);
			return new Error('Error in finalCardString');
		}
	},



}
