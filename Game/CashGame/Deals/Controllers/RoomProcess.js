var Sys = require('../../../../Boot/Sys');

module.exports = {
    checkRoomSeatAvilability: async function(data){
        try {
            /**/
             let room,rooms,isEmptySpace;
            /**/
            Sys.Log.info('<=> Check Room Seat Avilability Called || ');
            data.noOfSeats = 2;
            // if (data.dealtype == 6) {
            //   data.noOfSeats = 6
            // }
	        rooms = await Sys.Game.Common.Services.RoomServices.getByData({
                type: 'CashGame', // 'Practice','Cashgame',''
                tableType: data.gameType, // 'Points',Pool','Deals'
		            maxPlayers: data.noOfSeats,
		            gameOverPoint: data.dealtype, // Deal Type Use insted of GameoverPoints
                entryFees :data.entryFees,
                owner: 'user',
                status: { $ne: 'Running' }, // When Table is Running, player can not sit on table.
                status: { $ne: 'Finished' }, // When Table is Finished, player can not sit on table.
            });

            isEmptySpace = false;
            if (rooms) {
              //console.log("=======================================================");
              //console.log("Room Length", rooms.length);
              //console.log("=======================================================");
            rooms.forEach(function (rm) {
              let playersLength = 0;
              for (var i = 0; i < rm.players.length; i++) {
                if (rm.players[i] && rm.players[i].status != 'Left') {
                  playersLength += 1;
            }
              }
              //console.log("playersLength", playersLength);
                if (playersLength < rm.maxPlayers && isEmptySpace == false) {
                // if (rm.players.length < rm.maxPlayers && isEmptySpace == false) {
                //console.log("=======================================================");
                //console.log("isEmptySpace", isEmptySpace);
                //console.log("roomId", rm.id);
                //console.log("=======================================================");
                isEmptySpace = true;
                    room = rm; // Assign to Room

                }
            });
          }

            //console.log("=======================================================");
            //console.log("isEmptySpace", isEmptySpace);
            //console.log("=======================================================");
            if (isEmptySpace == false) {
                Sys.Log.info('<=> Create New Room || ');

                let rm = await Sys.Game.CashGame.Deals.Services.RoomServices.create(data);
                if (!rm) {
                    return { status: 'fail', result: null, message: 'No Room Created.', statusCode: 401 }
                }
                room = rm; // Assign to Room
		    }
            room = await Sys.Game.CashGame.Deals.Services.RoomServices.get(room.id); //// Just Get Table Data With Format.

            return room;
        }catch (error) {

			Sys.Log.info('Error in checkRoomSeatAvilability : ' + error);
			return new Error('Error in checkRoomSeatAvilability');
        }
	},
    joinRoom: async function(player,data){
        try {


			let i = 0;
            Sys.Log.info('<=> Join Room Called || ');

            let room = await Sys.Game.CashGame.Deals.Services.RoomServices.get(data.roomId);
            if (!room) {
                return { status: 'fail',result: null,message: "Room not found",	statusCode: 401	};
            }


			let oldPlayer = null;
			let playingPlayerCount = 0;
            if (room.players.length > 0) {
                for (i = 0; i < room.players.length; i++) {
                    if (room.players[i].id == player.id) {
                        oldPlayer = room.players[i]
                        break
                    }
                }
			}


		// chek seat in players array
		let seatAvailable = false;
    let playerCount = 0;
    let allSeatIndex = [];
		let playerSeat = [];
    for (let i = 0; i < room.players.length; i++) {
      if (room.players[i].status != 'Left') {
        playerCount++;
        allSeatIndex.push(room.players[i].seatIndex);
      }
    }

		if (playerCount < room.maxPlayers) {
      // let Find Free SeatIndex
			for (let k = 0; k < room.maxPlayers; k++) {
				 if(!allSeatIndex.includes(k)){
					seatAvailable = true;
			 		data.seatIndex = k;
			 		break;
				 }
       }
			}


      // When Fist User Wants to Push on Table.
  		if(allSeatIndex.length == 0){
  			seatAvailable = true;
  			data.seatIndex = 0;
  		}

		// if seat is available add player
		if (seatAvailable) {


			let playerStatus = (room.status == 'waiting' || room.status == 'finished') ? 'sitting' : 'waiting';

			// Player chips Cut
			// let newChips =  parseFloat(parseFloat(player.cash) - parseFloat(data.entryFees));
      // if (parseFloat(data.entryFees) > player.cash) {
      //   newChips = 0;
      // }
			// let updatedPlayer = await Sys.Game.CashGame.Deals.Services.PlayerServices.update(player.id,{ cash: newChips });
			// let trnsObj = {
			// 	playerId : player.id,
			// 	chips             : parseFloat(data.entryFees),
			// 	cash            : 0,
			// 	type              : 'debit',   //debit/credit
			// 	tranType : 'cash',
			// 	gameType : "deals",
			// 	tableType : "CashGame",
			// 	message            : 'Entry Fee Deduct',
			// 	tableNumber            : room.tableNumber,
			// 	transactionNumber : '',
			// 	afterBalance      : newChips,
			// 	status           : 'sucess',
			// }
			// let chipsTransection = await Sys.Game.CashGame.Deals.Services.PlayerServices.cerateChipsCashHistory(trnsObj);


			// Remain
			// Send Brodcast to Player for Chips Updated.

			if (oldPlayer)
			{
				let gameOverPoints = parseFloat(room.gameOverPoint) * 80 ;
				//console.log('<=> Old Player Match || ');
				oldPlayer.chips       = parseFloat(player.chips);
				oldPlayer.socketId    = player.socketId;
				oldPlayer.seatIndex   = data.seatIndex;
				oldPlayer.isBot       = data.isBot;
				oldPlayer.dropped     = false;
				oldPlayer.status      = playerStatus;
				// oldPlayer.cardTurn = true;
				oldPlayer.declare     = false;
				oldPlayer.playerScore = 80;
				oldPlayer.totalPoint  = gameOverPoints;
				oldPlayer.turnCount   = 1;

        oldPlayer.cardTurn    = false;
        if (oldPlayer.cards.length > 13) {
          oldPlayer.cardTurn  = true;
        }
				roomUpdated = await Sys.Game.CashGame.Deals.Services.RoomServices.update(room);

			}else
			{
				await room.AddPlayer(player.id, player.socketId, player.username,playerStatus,0, player.appId, parseFloat(player.cash), 0, data.seatIndex, false);
			}

				roomUpdated = await Sys.Game.CashGame.Deals.Services.RoomServices.update(room);

			let totalPlayers=0;
			let playerInfoDummy = [];
			let joinedPlayer = null;
			for (i = 0; i < room.players.length; i++) {
				if(room.players[i].status != 'Left'){
				totalPlayers++;
            let playerInfoObj = {
              id : room.players[i].id,
              status : room.players[i].status,
              username : room.players[i].username,
              cash : room.players[i].cash,
              chips : parseFloat(room.players[i].chips),
              appId :room.players[i].appid,
              avatar :  room.players[i].appid,
              dropped : room.players[i].dropped,
            };

            playerInfoDummy.push(playerInfoObj);
            if (room.players[i].id == player.id) {
              joinedPlayer = {
                id : room.players[i].id,
                status : room.players[i].status,
                username : room.players[i].username,
                cash : room.players[i].cash,
                chips : parseFloat(room.players[i].chips),
                appId :room.players[i].appid,
                avatar :  room.players[i].appid,
                dropped : room.players[i].dropped,
              };
            }
					}
				}
        let roomStatus = true;
        if (room.status == "Running" && room.game != null) {
          roomStatus = false;
        }

        await Sys.Io.of(Sys.Config.Namespace.CashDeals).to(data.socketId).emit('PlayerList', playerInfoDummy, { isBeforeGameStart: roomStatus });
        await Sys.Io.of(Sys.Config.Namespace.CashDeals).to(room.id).emit('JoinedPlayerInfo',joinedPlayer, { isBeforeGameStart: roomStatus });

		Sys.Log.info('<=> Player count (NewPlayer) || Player Length :'+totalPlayers);
       	//console.log("totalPlayers", totalPlayers);
        let playerCount = totalPlayers;
				if (playerCount > 0) {
          			//console.log("playerCount", playerCount);


					// Game Start
					let playersLength = 0
					for (let i=0; i < room.players.length; i += 1) {
						if (room.players[i].status != 'Left') {
							playersLength += 1;
						}
					}

					if (room.status != 'Running' && playersLength >= room.minPlayers) {
						//console.log("room.timerStart:",room.timerStart);
						if (room.game == null && room.timerStart == false) {
							room.timerStart = true; // When 12 Second Countdown Start.
              				room = await Sys.Game.CashGame.Deals.Services.RoomServices.update(room);
							//console.log('<=> Game Not Running (NewPlayer)');

							let	timer = parseFloat(Sys.Config.Rummy.waitBeforeGameStart);
								Sys.Timers[room.id] = setInterval(async function(room){
									//console.log("OnGameStartWait Send => ",timer);

									await Sys.Io.of(Sys.Config.Namespace.CashDeals).to(room.id).emit('OnGameStartWait', {
										roomId: room.id,
										timer : timer,
										maxTimer :  parseFloat( Sys.Config.Rummy.waitBeforeGameStart)
									});
									timer--;
									if(timer < 1){
										clearTimeout(Sys.Timers[room.id]); // Clear Room Timer
										room.timerStart = false; // Reset Timer Variable
                    room = await Sys.Game.CashGame.Deals.Services.RoomServices.update(room);
                    // playersLength = 0;
                    // for (let i=0; i < room.players.length; i += 1) {
                    //   if (room.players[i].status != 'Left') {
                    //     playersLength += 1;
                    //   }
                    // }
										// //console.log('<===============================>');
										// //console.log('<=> Game Starting [] New <=>');
										// //console.log('<===============================>');
										playersLength = 0;
										for (let i=0; i < room.players.length; i += 1) {
											if (room.players[i].status != 'Left') {
												playersLength += 1;
											}
										}
										 if(playersLength >= room.minPlayers){
											room.StartGame();
										 }else{
											//console.log('<=> Some Player Leave So not Start Game. <=>',playersLength);
										 }
									}
								}, 1000, room);
						}else{

							if(room.game == null){
								//console.log('<=> Game Objec Present but (NewPlayer)');
							}
							//console.log('<=> Game Object Present So Please Wait For Game Finished');
						}
					}
					if (playersLength < room.minPlayers) {
						//console.log('<=> Game IN waiting Stage  (NewPlayer)');
						room.status = 'waiting'
						roomUpdated = await Sys.Game.CashGame.Deals.Services.RoomServices.update(room);
					}

					return room;
				}



		} else {
			return new Error('No Sit Avilable');
		}


        }catch (error) {
			Sys.Log.info('Error in joinRoom : ' + error);
			return new Error('Error in joinRoom');

        }
    },
	newGameStarted: async function(room) {
    try {
  		//console.log('<=> Game Started Brodcast || GameStarted :',room.game.gameNumber);
  		await Sys.Io.of(Sys.Config.Namespace.CashDeals).to(room.id).emit('GameStarted', {
  			message : 'Let Start Game',
  			gameId : room.game.id,
  			gameNumber : room.game.gameNumber
  		});
    }catch (error) {
      Sys.Log.info('Error in newGameStarted : ' + error);
      return new Error('Error in newGameStarted');

    }
	},
 	turnPlayerSelection: async function(room,cardsArray) {
		try{
			let playersCards = [];
      room.participantPlayers = [];
			for (let i = 0; i < room.players.length; i += 1) {
        room.participantPlayers.push({ id : room.players[i].id })

        //console.log("players room.players[i].id :",room.players[i].id);
        // Player chips Cut when priority card set
        let player = await Sys.Game.CashGame.Deals.Services.PlayerServices.getById(room.players[i].id);
        // let newChips =  parseFloat(parseFloat(player.cash) - parseFloat(room.entryFees));
        // if (parseFloat(room.entryFees) > player.cash) {
        //   newChips = 0;
        // }
  			// let updatedPlayer = await Sys.Game.CashGame.Deals.Services.PlayerServices.update(player.id,{ cash: newChips });

        let updatedPlayer = await Sys.Game.CashGame.Deals.Services.PlayerServices.update(player.id,{ cash: (parseFloat(player.cash) - parseFloat(room.entryFees))  });

        let trnsObj = {
  				playerId          : player.id,
          gameId            : room.game.id,
  				chips             : 0,
  				cash              : parseFloat(room.entryFees),
  				type              : 'debit',   //debit/credit
  				tranType          : 'cash',
  				gameType          : "deals",
  				tableType         : "CashGame",
  				message           : 'Entry Fee Deduct',
  				tableNumber       : room.tableNumber,
  				transactionNumber : '',
  				afterBalance      : (parseFloat(player.cash) - parseFloat(room.entryFees)),
  				status            : 'success',
  			}
  			let chipsTransection = await Sys.Game.CashGame.Deals.Services.PlayerServices.cerateChipsCashHistory(trnsObj);

				//console.log("players cardsArray[i] :",cardsArray[i]);
					playersCards.push({
						playerId : room.players[i].id,
						card : cardsArray[i],
						index : i,
					})
			}
			//console.log("players Cards :",playersCards);
      //console.log("################################################");
      //console.log("################################################");
      //console.log('room.participantPlayers', room.participantPlayers);
      //console.log("################################################");
      //console.log("################################################");
			// Find High Cards
			let playerId = null;
			let maxRank = 1;
			for (let i = 0; i < playersCards.length; i += 1) {
				if(maxRank < parseFloat(playersCards[i].card.slice(0,1))){
					maxRank = parseFloat(playersCards[i].card.slice(0,1));
					playerId = playersCards[i].playerId;
					room.currentPlayer = playersCards[i].index;
				}
			}
			let sellectObj = {
				playerCards : playersCards,
				highCardPlayer : playerId
			}
			//console.log("sellectObj Cards :",sellectObj);
      //console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
      //console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
      //console.log("Sending Priority Card");
      //console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
      //console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
			await Sys.Io.of(Sys.Config.Namespace.CashDeals).to(room.id).emit('priorityCards', sellectObj);
			return room;
		}catch (error) {
			Sys.Log.info('Error in turnPlayerSelection : ' + error);
			return new Error('Error in turnPlayerSelection');

		}
	},
	newRoundStarted: async function(room) {
		try{
      //console.log('<=> Game || newRoundStarted :',room.game.gameNumber);
			roomUpdated = await Sys.Game.CashGame.Deals.Services.RoomServices.update(room);
			if (!roomUpdated) {
				return {
					status: 'fail',
					result: null,
					message: "Room not found",
					statusCode: 401
				};
			}


			// Send Room Joker Cards & OpneDeck Card information
			let joObj = {
				jokerCard : room.game.jokerCard[0],
				OpenCard : room.game.openDeck[0]
			}
			await Sys.Io.of(Sys.Config.Namespace.CashDeals).to(room.id).emit('JokerOpenCardInfo', joObj);


			room.players.forEach(async function (player) {
				let playerCards = {
					playerId : player.id,
					cards : player.cards,
				};
				await Sys.Io.of(Sys.Config.Namespace.CashDeals).to(room.id).emit('PlayerDeck', playerCards);
			});
			// Send Second Timer Player Deck for Testing.
			room.players.forEach(async function (player) {
        // ~~~
				// Cut Player Cheip When Card Distribution
				// let playerObj = await Sys.Game.CashGame.Deals.Services.PlayerServices.getById(player.id);
				// let newChips = parseFloat(playerObj.chips)-parseFloat(room.entryFees);
				// let updatedPlayer = await Sys.Game.CashGame.Deals.Services.PlayerServices.update(playerObj.id,{ chips: newChips });

				let playerCards = {
					playerId : player.id,
					cards : player.cards,
				};
				await Sys.Io.of(Sys.Config.Namespace.CashDeals).to(room.id).emit('PlayerDeck', playerCards);
			});


			Sys.Timers[room.id] = setTimeout(async function (room) {

				// Change Current Player Tuen
				let currentPlayer = room.getCurrentPlayer();
				////console.log("currPlr",currentPlayer);
				currentPlayer.cardTurn = false; // Set Turn Variable False.
				currentPlayer.turnCount = parseFloat(currentPlayer.turnCount) + 1; // Update Player Turn Count
				roomUpdated = await Sys.Game.CashGame.Deals.Services.RoomServices.update(room);

				//console.log("currPlr->>>>>>>>>>>>",currentPlayer.id);
				//console.log("NextTurnPlayer Send");
				await Sys.Io.of(Sys.Config.Namespace.CashDeals).to(room.id).emit('TurnPlayer', {
					playerId: room.getCurrentPlayer().id
				});

					let timer = parseFloat(Sys.Config.Rummy.turnTime);
					Sys.Timers[room.id] = setInterval(async function(room){
						//console.log("turnTime First Timer Send ->",timer);
						await Sys.Io.of(Sys.Config.Namespace.CashDeals).to(room.id).emit('OnTurnTimer', {
							playerId: room.getCurrentPlayer().id,
							timer : timer,
							maxTimer :  parseFloat(Sys.Config.Rummy.turnTime),
							name : 'turnTime'
						});
						timer--;
						if(timer < 1){
							clearTimeout(Sys.Timers[room.id]); // Clear Turn Timer
							timer = parseFloat(currentPlayer.extraTime);
							let  extraTimer = parseFloat(currentPlayer.extraTime);
							if(extraTimer < 1){
								clearTimeout(Sys.Timers[room.id]); // Clear Turn Timer
								//console.log("Turn - check is timer not Close...");
								Sys.Game.CashGame.Deals.Controllers.RoomProcess.playerDefaultAction(room.id);
							}else{
								Sys.Timers[room.id] = setInterval(async function(room){
									//console.log("extraTime First Timer Send ->",timer);
									await Sys.Io.of(Sys.Config.Namespace.CashDeals).to(room.id).emit('OnTurnTimer', {
										playerId: room.getCurrentPlayer().id,
										timer : timer,
										maxTimer :  extraTimer,
										name : 'extraTime'
									});
									timer--;
									currentPlayer.extraTime = timer;
									if(timer < 1){
										clearTimeout(Sys.Timers[room.id]); // Clear Turn Timer
										//console.log("Turn - check is timer not Close...");
										Sys.Game.CashGame.Deals.Controllers.RoomProcess.playerDefaultAction(room.id);
									}
								}, 1000, room);
							}

						}
					}, 1000, room);


			}, (500 * room.players.length) + 4000, room)
			return;
		}catch (error) {
			Sys.Log.info('Error in newRoundStarted : ' + error);
			return new Error('Error in newRoundStarted');

		}
	},
	playerDefaultAction: async function(id) {
    try {
		//console.log('playerDefaultAction called');
		clearTimeout(Sys.Timers[id]);
		let room = await Sys.Game.CashGame.Deals.Services.RoomServices.get(id);

		if (room.getCurrentPlayer()) {
			let currentPlayer = room.getCurrentPlayer();
			//console.log("currentPlayer.droppedCount->>",currentPlayer.droppedCount);
			if(currentPlayer.droppedCount == 2){
				// //console.log("Remove Player for 3 Default Turn");
				// let playerData = {
				// 	playerId : currentPlayer.id,
				// 	roomId : room.id
				// }
				// let responce =  await Sys.Game.CashGame.Deals.Controllers.RoomProcess.leftRoom(playerData);
        // if(responce instanceof Error){
    		// 	return { status: 'fail', result: null, message: responce.message, statusCode: 401 }
    		// }
        currentPlayer.playerScore = 80;
        // currentPlayer.playerScore = parseFloat(parseFloat(currentPlayer.playerScore) - 80);

				//  //Save History
				let dataObj = {
					playerId:currentPlayer.id,
					action: 'Left Player For 3 Defult Turn',
					card : '',
					cardString : '',
					time : Date.now()
				}
        // make player Drop
        currentPlayer.dropped = true;
				room = await Sys.Game.CashGame.Deals.Controllers.RoomProcess.saveHistory(room,dataObj);
				// //console.log("Default Turn Player",responce);
        //
			}
      // else{
				currentPlayer.droppedCount = parseFloat(currentPlayer.droppedCount) + 1;

				// Player Auto Discards
				// check Player Have Auto Discard Cards
				let  playercards = currentPlayer.cards.length;
				if(playercards == 14){
					//console.log("Auto Discrds Working..............................");
					let card = currentPlayer.cards.splice(currentPlayer.cards.length - 1,1);
					//console.log("Card : ",card[0]);
					room.game.openDeck.push(card[0]);
					await Sys.Io.of(Sys.Config.Namespace.CashDeals).to(room.id).emit('OnAutoDiscard', {
						playerId: currentPlayer.id,
						card : card[0],
					});
					//Save History
					let dataObj = {
						playerId:currentPlayer.id,
						action: 'Auto Discard',
						card : card[0],
						cardString : '',
						time : Date.now()
					}
					room = await Sys.Game.CashGame.Deals.Controllers.RoomProcess.saveHistory(room,dataObj);
				}

				roomUpdated = await Sys.Game.CashGame.Deals.Services.RoomServices.update(room);
				await Sys.Game.CashGame.Deals.Controllers.RoomProcess.changeTurn(room);
				await Sys.Game.CashGame.Deals.Controllers.RoomProcess.turnFinished(room);
			// }

		}
    }catch (error) {
  		Sys.Log.info('Error in playerDefaultAction : ' + error);
  		return new Error('Error in playerDefaultAction');

  	}
	},
	leftRoom: async function(data) {
    try {
			////console.log("LeftRoom Data", data);
		   if (!data.roomId) {
			   //console.log('<=> Removing Player RoomID Not Found');
			   return {
				   status: 'fail',
				   result: null,
				   message: "Room Not Found",
				   statusCode: 401
			   };
		   }
		   let room = await Sys.Game.CashGame.Deals.Services.RoomServices.get(data.roomId);

		   if (!room) {
		   //console.log('<=> Removing Player Room Not Found');
			   return {
				   status: 'fail',
				   result: null,
				   message: "Room Not Found",
				   statusCode: 401
			   };
		   }
		   //console.log('<=> LeftRoom Called || GAME-NUMBER [] || Data : ',data);
		   //check for user already present //
		   // chek seat in players array
		   let player = null;
		   let playerId = 0;
		   let removePlayer = false; // When Player Status is 'sitting' Or 'waiting' So Left Player From Room;
		   if (room.players.length > 0) {
			   for (let i = 0; i < room.players.length; i++) {
				   if (room.players[i].id == data.playerId && room.players[i].status != 'Left') {

					   if(room.players[i].status == 'sitting' || room.players[i].status == 'waiting'){
						   removePlayer = true;

							// Refund Player his Chips
							let playerObj = await Sys.Game.CashGame.Deals.Services.PlayerServices.getById(data.playerId);
							if(!playerObj){
								return { status: 'fail', result: null, message: 'No Player Found!.', statusCode: 401 }
							}

							let newChips =  parseFloat(parseFloat(playerObj.cash) + parseFloat(room.entryFees));
							let updatedPlayer = await Sys.Game.CashGame.Deals.Services.PlayerServices.update(playerObj.id,{ cash: newChips });
							let trnsObj = {
								playerId          : playerObj.id,
                gameId            : room.game.id,
								chips             : 0,
								cash              : parseFloat(room.entryFees),
								type              : 'credit',   //debit/credit
								tranType          : 'cash',
								gameType          : "deals",
								tableType         : "CashGame",
								message           : 'Entry Fee Refund',
								tableNumber       : room.tableNumber,
								transactionNumber : '',
								afterBalance      : newChips,
								status            : 'success',
							}
							let chipsTransection = await Sys.Game.CashGame.Deals.Services.PlayerServices.cerateChipsCashHistory(trnsObj);




					   }


					   player = room.players[i];
					   room.players[i].status = 'Left';

             if (room.players[i].dropped == false) {
               if(room.players[i].turnCount == 2  || room.players[i].turnCount == 1 ){
   						  room.players[i].playerScore = Sys.Config.Rummy.playerFirstDrop;
   						}else if(room.players[i].turnCount == 3){
   							room.players[i].playerScore = Sys.Config.Rummy.playerSecondDrop;
   						}else{
   							room.players[i].playerScore = Sys.Config.Rummy.playerThirdDrop;
   						}
             }




					   playerId = room.players[i].id;
					   break;
				   }
			   }
		   }
		   if (player) {
			   //console.log('<=> Removing Player || GAME-NUMBER [] ||');

			   if (room.game && room.game.status == 'Running') {

				   //console.log('<=> Game PlayerLeft Broadcast || GAME-NUMBER [] || PlayerLeft : ',player.username);
				   room  = await Sys.Game.CashGame.Deals.Controllers.RoomProcess.checkTurnFinished(room,playerId);

			   }
			   //console.log('Remove Player 123');

			   if(removePlayer){
				   for (let i = 0; i < room.players.length; i++) {
					   if (room.players[i].status == 'Left' && room.players[i].id == playerId) {
						   room.players.splice(i, 1);
					   }
				   }
			   }

			   roomUpdated = await Sys.Game.CashGame.Deals.Services.RoomServices.update(room);



		   await Sys.Io.of(Sys.Config.Namespace.CashDeals).to(room.id).emit('PlayerLeft', { 'playerId': player.id });

		  //  room  =  await Sys.Game.CashGame.Deals.Controllers.RoomProcess.broadcastPlayerInfo(room);
			   return {
				   status: 'success',
				   message: "Player Leave success",
				   statusCode: 200
			   };
		   } else {
			//   //console.log('<=> Removing Player Not Found');
			   return {
				   status: 'fail',
				   result: null,
				   message: "Player not found",
				   statusCode: 401
			   };
		   }
     }catch (error) {
      Sys.Log.info('Error in leftRoom : ' + error);
      return new Error('Error in leftRoom');

    }
	},
  	broadcastPlayerInfo: async function(room) {
	// 	try {
	// 		// let seatIndexArray = [room.maxPlayers-1];
	// 		let totalPlayers=0;
	// 		for (var i = 0; i < room.players.length; i++) {
	// 			if(room.players[i].status != 'Left'){
	// 				totalPlayers++;
	// 			}
	// 		}
    //   		let playerInfoDummy = [];
	// 		 let playerFreeSeats = [];
	// 		// Just Send Player Info for Remainig Player
	// 		for (var i = 0; i < room.players.length; i++) {
	// 			if(room.players[i].status != 'Left'){
	// 				let playerInfoObj = {
	// 					id : room.players[i].id,
	// 					status : room.players[i].status,
	// 					username : room.players[i].username,
	// 					cash : room.players[i].cash,
	// 					chips : room.players[i].chips,
	// 					appId :room.players[i].appid,
	// 					avatar :  room.players[i].appid,
	// 					dropped : room.players[i].dropped,
	// 					seatIndex : room.players[i].seatIndex,
	// 					totalPlayers : totalPlayers
	// 				};

	// 				playerInfoDummy.push(playerInfoObj);

	// 				//console.log('<=> Send Self Players Broadcast  || PlayerInfo :',  room.players[i].username);

	// 				// await Sys.Io.of(Sys.Config.Namespace.PracticePoints).to(room.id).emit('PlayerInfo', playerInfoObj);
	// 			}
	// 		}
    // for (var i = 0; i < 6; i++) {
    //   let seatMatch = false;
    //   for (var j = 0; j < room.players.length; j++) {
    //     if (i == room.players[j].seatIndex && room.players[j].status != "Left") {
    //       seatMatch = true;
    //     }
    //   }
    //   if (seatMatch == false) {
    //     playerFreeSeats.push(i)
    //   }
    // }

    // // let tempPlayerArr = []
    // // for (var i = 0; i < playerInfoDummy.length; i++) {
    // //   for (var k = 0; k < playerInfoDummy.length; k++) {
    // //     if (i == playerInfoDummy[k].seatIndex) {
    // //       tempPlayerArr.push(playerInfoDummy[k])
    // //     }
    // //   }
    // // }

    // // let dataArr = [];
    // // dataArr.push(playerInfoDummy);
    // // dataArr.push({vacantSeat: playerFreeSeats});
	// 	await Sys.Io.of(Sys.Config.Namespace.CashDeals).to(room.id).emit('playerInfoDummy', playerInfoDummy,{vacantSeat: playerFreeSeats});
	// 	return room;
	// }catch (error) {
	// 	Sys.Log.info('Error in broadcastPlayerInfo : ' + error);
	// 	return new Error('Error in broadcastPlayerInfo');

	// }
	},
	checkTurnFinished: async function(room,playerId) {
    try {
  		//console.log('<=> checkTurnFinished  Called || GAME-NUMBER ['+room.game.gameNumber+'] || ');
  		if (room.getCurrentPlayer().id == playerId) {
  			await Sys.Game.CashGame.Deals.Controllers.RoomProcess.changeTurn(room);
  			await Sys.Game.CashGame.Deals.Controllers.RoomProcess.turnFinished(room);
  			return room;
  		}else{
  			let playinPlayer = 0;
  			//console.log('Check Player Count.');
  			// Count no Of Player
  			for (let i=0; i < room.players.length; i += 1) {
  				//console.log("room.players[i].status:",room.players[i].status);
  				if (room.players[i].dropped === false && room.players[i].status === 'playing' ) {
  					playinPlayer++;
  				}
  			}
  			//console.log("No Of Player:",playinPlayer);
  			if(playinPlayer == 1){
  				clearTimeout(Sys.Timers[room.id]);
          room.timerStart = false;
          room = await Sys.Game.CashGame.Deals.Services.RoomServices.update(room);
  				// Call Save History.
  				room.game.status = 'Finished';
  				await Sys.Game.CashGame.Deals.Controllers.RoomProcess.gameFinished(room);

  			}
  			return room;
  		}
    }catch (error) {
      Sys.Log.info('Error in checkTurnFinished : ' + error);
      return new Error('Error in checkTurnFinished');

    }
	},
	changeTurn: async function(room) {
    try {
  		let i;
  		let currentTurn = room.currentPlayer;
  		//console.log("Change Turn Current Turn:",currentTurn);
          //For each player, check
          for (i = currentTurn; i < room.players.length; i += 1) {
  			//console.log("room.players[i].dropped >>>",room.players[i].dropped)
  				//console.log("room.players[i].status >>>",room.players[i].status)
              if (room.players[i].dropped === false && room.players[i].status === 'playing' && i != room.currentPlayer) {
                  room.currentPlayer = i;
                  break
              }
  		}
  		//console.log("New :",currentTurn);
  		//console.log("Old Player Turn :",room.currentPlayer);
          if (currentTurn == room.currentPlayer) {
              for (i = 0; i < currentTurn; i += 1) {
  				//console.log("room.players[i].dropped",room.players[i].dropped)
  				//console.log("room.players[i].status",room.players[i].status)
                  if (room.players[i].dropped === false && room.players[i].status === 'playing') {
                      room.currentPlayer = i;
                      break;
                  }
              }
  		}
  		//console.log("New Player Turn :",room.currentPlayer);
    }catch (error) {
      Sys.Log.info('Error in changeTurn : ' + error);
      return new Error('Error in changeTurn');

    }
	},
	turnFinished : async function(room) {
    try {
		  let playinPlayer = 0;

		  //console.log('<=> Turn Finished  Called || GAME-NUMBER ['+room.game.gameNumber+'] || Clear TimeOut');

		  clearTimeout(Sys.Timers[room.id]);

		  room = await Sys.Game.CashGame.Deals.Services.RoomServices.update(room);

		  // Count no Of Player
		  for (let i=0; i < room.players.length; i += 1) {
  	    //console.log("room.players[i].status:",room.players[i].status);
        if (room.players[i].dropped === false && room.players[i].status === 'playing') {
          playinPlayer++;
        }
      }
		  //console.log("Player Count Turn Finished:",playinPlayer);
  		if(playinPlayer == 1 || playinPlayer == 0){
  			clearTimeout(Sys.Timers[room.id]); // Clear Room Timer
  			//console.log('<=> No Of Player 1 || GAME-NUMBER [] || Call Game Finished');
  			// Call Save History.
  			room.game.status = 'Finished';

  			await Sys.Game.CashGame.Deals.Controllers.RoomProcess.gameFinished(room);

  		}else{
  			if (room.getCurrentPlayer()) {

  				// Change Current Player Tuen
  				let currentPlayer = room.getCurrentPlayer();
  				currentPlayer.cardTurn = false; // Set Turn Variable False.
  				currentPlayer.turnCount = parseFloat(currentPlayer.turnCount) + 1; // Update Player Turn Count
  				roomUpdated = await Sys.Game.CashGame.Deals.Services.RoomServices.update(room);

  				//console.log("NextTurnPlayer Send Second");
  				await Sys.Io.of(Sys.Config.Namespace.CashDeals).to(room.id).emit('TurnPlayer', {
  					playerId: room.getCurrentPlayer().id
  				});

  					let timer = parseFloat(Sys.Config.Rummy.turnTime);
  					Sys.Timers[room.id] =  setInterval(async function(room){
  						//console.log("turnTime NextTurnPlayer Send ->",timer);
  						await Sys.Io.of(Sys.Config.Namespace.CashDeals).to(room.id).emit('OnTurnTimer', {
  							playerId: room.getCurrentPlayer().id,
  							timer : timer,
  							maxTimer :  parseFloat(Sys.Config.Rummy.turnTime),
  							name : 'turnTime'
  						});
  						timer--;
  						if( timer < 1){
  							clearTimeout(Sys.Timers[room.id]);
  							timer = parseFloat(currentPlayer.extraTime);
  							let  extraTimer = parseFloat(currentPlayer.extraTime);
  							Sys.Timers[room.id] =  setInterval(async function(room){
  								//console.log("extraTime NextTurnPlayer Send ->",timer);
  								await Sys.Io.of(Sys.Config.Namespace.CashDeals).to(room.id).emit('OnTurnTimer', {
  									playerId: room.getCurrentPlayer().id,
  									timer : timer,
  									maxTimer :  extraTimer,
  									name : 'extraTime'
  								});
  								timer--;
  								currentPlayer.extraTime = timer;
  								if(timer < 1){
  									clearTimeout(Sys.Timers[room.id]); // Clear Turn Timer

  										//console.log("Turn - check is timer not Close...");
  										await Sys.Game.CashGame.Deals.Controllers.RoomProcess.playerDefaultAction(room.id);

  								}
  							}, 1000, room);
  						}
  					}, 1000, room);

  			}else{
  				//console.log('<=> Current Player Not Found || GAME-NUMBER ['+room.game.gameNumber+'] ||');
  			}
  		}
    }catch (error) {
      Sys.Log.info('Error in turnFinished : ' + error);
      return new Error('Error in turnFinished');
    }
	},
	gameFinished : async function(room) {
	    try {

	  		clearTimeout(Sys.Timers[room.id]);
	    		room.status = "Finished"; // Set Finished. if anther process called Game Finished.
	  		// Winner Calculation

	  		let playinPlayer = 0;
	  		let winner = null;
	  		let winingChips = 0;
	  		let winnerPlayers = [];
	  		let playerInfoObj = {};
	  		let singlePlayerWinnigchips = 0;
	  		// let cutOfChips = 0;
	  		// Check Winner is Single Player
	  		let winnerPointAdd = 0;
	  		for (let i=0; i < room.players.length; i += 1) {
	  			// room.players[i].totalPoint = parseFloat(room.players[i].totalPoint) - parseFloat(room.players[i].playerScore);
	  			// Remove Self Score Form Player Total Points
	  			if (room.players[i].dropped === false && room.players[i].status === 'playing' ) {
	  				winner = room.players[i]; // Use Player Winner When Single Player is Winner.
	  				playinPlayer++;
	  				singlePlayerWinnigchips = parseFloat(singlePlayerWinnigchips) + (parseFloat(room.entryFees));
	  			}else{
	  				singlePlayerWinnigchips = parseFloat(singlePlayerWinnigchips) + (parseFloat(room.entryFees));
	  			}
	  		}

	  		if(playinPlayer != 1){
	  			// get Winner from Declare Array
		        // //console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&");
		        // //console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&");
		        // //console.log("room.game.declare", room.game.declare);
		        // //console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&");
		        // //console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&");
	  			for (let i=0; i < room.game.declare.length; i += 1) {
	  				if(winnerPlayers.length == 0){
	            		// //console.log("111111111111111111111111111111111111111111111111111111111");
	            		// //console.log("111111111111111111111111111111111111111111111111111111111");
	  					// for First Winner
	            		let FirstWinner = room.getPlayerById(room.game.declare[i]);

	  					// winnerPlayers.push({
	  					// 	type : 'winner',
	  					// 	playerId : room.players[i].id,
	  					// 	username : room.players[i].username,
	  					// 	won : 0,
	  					// 	score : 0,
	  					// 	cards : room.players[i].cardsString,
	  					// 	points : parseFloat(room.players[i].playerScore),
	  					// 	totalPoint : parseFloat(room.players[i].totalPoint) + parseFloat(room.players[i].playerScore),// For Pool / Deal
	      				// 	dropped : room.players[i].dropped
	  					// });
	            		room.game.winners.push(FirstWinner)
	            		winnerPlayers.push({
	  						type : 'winner',
	  						playerId : FirstWinner.id,
	  						username : FirstWinner.username,
	  						won : 0, // Fainal Winning Chips Add here After All Calualation Done.
	  						score : 0, // Fainal Loosing chips Add here.
	  						cards : FirstWinner.cardsString,
	  						points : parseFloat(FirstWinner.playerScore), // not Use in Pool
	  						totalPoint : parseFloat(FirstWinner.totalPoint) + parseFloat(FirstWinner.playerScore),// For Pool / Deal
	  						dropped : FirstWinner.dropped,
	              		wrongfinished: FirstWinner.wrongfinished
	  					});
	  				}else{
	  					// Push Looser
	          			// ~~ Comment this in case of 6 players playing Deal game
	          			// //console.log("222222222222222222222222222222222222222222222222222222222");
	          			// //console.log("222222222222222222222222222222222222222222222222222222222");
	            		winnerPlayers[0].points = parseFloat(room.players[i].playerScore)
	            		winnerPlayers[0].totalPoint = winnerPlayers[0].totalPoint + parseFloat(room.players[i].playerScore)
	            		room.getPlayerById(winnerPlayers[0].playerId).totalPoint = winnerPlayers[0].totalPoint

	            		room.game.losers.push(room.players[i])
  						winnerPlayers.push({
	  						type : 'loser',
	  						playerId : room.players[i].id,
	  						username : room.players[i].username,
	  						won :0,
	  						score : o,
	  						cards : room.players[i].cardsString,
	  						points : parseFloat(room.players[i].playerScore),
	  						totalPoint : (parseFloat(room.players[i].totalPoint) < 0 ) ? 0 : parseFloat(room.players[i].totalPoint) ,// For Pool / Deal
        					dropped : room.players[i].dropped,
              				wrongfinished:room.players[i].wrongfinished
  						});
	  				}
	  			}


	  			for (let i=0; i < room.players.length; i += 1) {
	          		// if (room.game.declare.indexOf(room.players[i].id) == -1 && room.players[i].status != 'waiting' ) { // if Player not in Declare Array
	  				if (room.players[i].status != 'waiting' ) { // if Player not in Declare Array
	  					room.players[i].totalPoint = parseFloat(room.players[i].totalPoint) - parseFloat(room.players[i].playerScore); // Update Player Total Points

	            		if (room.players[i].id != winnerPlayers[0].playerId) {
		              		// ~~ Comment this in case of 6 players playing Deal game
			                winnerPlayers[0].points = parseFloat(room.players[i].playerScore)
			                winnerPlayers[0].totalPoint = parseFloat(winnerPlayers[0].totalPoint) + parseFloat(room.players[i].playerScore)
			                room.getPlayerById(winnerPlayers[0].playerId).totalPoint = parseFloat(winnerPlayers[0].totalPoint)

			                // //console.log("33333333333333333333333333333333333333333333333333333333");
			                // //console.log("33333333333333333333333333333333333333333333333333333333");
		    				 	// Push Looser
		              		room.game.losers.push(room.players[i])
	    					winnerPlayers.push({
	    						type : 'loser',
	    						playerId : room.players[i].id,
	    						username : room.players[i].username,
	    						won : 0,
	    						score : 0,
	    						cards : room.players[i].cardsString,
	    						points : parseFloat(parseFloat(room.players[i].playerScore) * (-1)), // not Use in Pool
	    						totalPoint : (parseFloat(room.players[i].totalPoint) < 0 ) ? 0 : parseFloat(room.players[i].totalPoint) ,
	         					dropped : room.players[i].dropped,
	                			wrongfinished: room.players[i].wrongfinished
	    					});
	            		}
	  				}
	  			}

	  		}else{
		  		// when Single Player is Winner So Send All Chips to Single Player.
		        // winner.totalPoint = parseFloat(winner.totalPoint) + parseFloat(winner.playerScore); // Update Player Total Points
		        // //console.log("444444444444444444444444444444444444444444444444444444444444");
		        // //console.log("444444444444444444444444444444444444444444444444444444444444");
	        	room.game.winners.push(winner)
	  			winnerPlayers.push({
	  				type : 'winner',
	  				playerId : winner.id,
	  				username : winner.username,
	  				won : 0,
	  				score : 0,
	  				cards : winner.cardsString,
	          		points : parseFloat(winner.playerScore),   // For Pool / Deal
	  				// points : 0,   // For Pool / Deal
	  				totalPoint : parseFloat(winner.totalPoint),
	      			dropped : winner.dropped,
	          		wrongfinished: winner.wrongfinished
	  			});
	  			// Add Seingle Winner Chips
	  			// let playerObj = await Sys.Game.CashGame.Deals.Services.PlayerServices.getById(winner.id);
	  			// let newChips = parseFloat(playerObj.chips)+parseFloat(singlePlayerWinnigchips) ;
	  			// let updatedPlayer = await Sys.Game.CashGame.Deals.Services.PlayerServices.update(winner.id,{ chips: newChips });

	  			// Push Loser
	  			for (let i=0; i < room.players.length; i += 1) {
	  				if ( winner.id != room.players[i].id && room.players[i].status != 'waiting' && room.players[i].status != 'sitting' ) {
	            		room.players[i].totalPoint = parseFloat(room.players[i].totalPoint) - parseFloat(room.players[i].playerScore); // Update Player Total Points
	            		//console.log('winnerPlayers[0].totalPoint before',winnerPlayers[0].totalPoint);
	  					// winnerPlayers[0].totalPoint = parseFloat(winnerPlayers[0].totalPoint) + parseFloat(room.players[i].playerScore); // Update Winner Total Points
	            		// room.getPlayerById(winnerPlayers[0].playerId).totalPoint = parseFloat(winnerPlayers[0].totalPoint)


	            		//
			            winnerPlayers[0].points = parseFloat(room.players[i].playerScore)
			            winnerPlayers[0].totalPoint = parseFloat(winnerPlayers[0].totalPoint) + parseFloat(room.players[i].playerScore)
			            room.getPlayerById(winnerPlayers[0].playerId).totalPoint = parseFloat(winnerPlayers[0].totalPoint)
			            //
			            // //console.log("555555555555555555555555555555555555555555555555555555555");
			            // //console.log("555555555555555555555555555555555555555555555555555555555");
			            // //console.log('room.players[i].playerScore', room.players[i].playerScore);
			            // //console.log('winnerPlayers[0].totalPoint after',winnerPlayers[0].totalPoint);
			  				 	 // Push Looser
	             		room.game.losers.push(room.players[i])
	  					winnerPlayers.push({
	  						type : 'loser',
	  						playerId : room.players[i].id,
	  						username : room.players[i].username,
	  						won : 0,
	  						score : 0, // parseFloat(room.players[i].playerScore)
	  						cards : room.players[i].cardsString,
	  						points : parseFloat(parseFloat(room.players[i].playerScore) * (-1)),  // Not use in Pool
	  						totalPoint : (parseFloat(room.players[i].totalPoint) < 0 ) ? 0 : parseFloat(room.players[i].totalPoint) ,
	   				    	dropped : room.players[i].dropped,
	              			wrongfinished: room.players[i].wrongfinished
	  					});
	  				}
	  			}
	  		}

	  		//console.log('Winner :',winnerPlayers);
	  		//console.log('<=> Game Finished Called || GAME-NUMBER [] ||');
	  		roomUpdated = await Sys.Game.CashGame.Deals.Services.RoomServices.update(room);

	  		let timer = (!Sys.Config.Rummy.waitBeforeGameRestart ? 30 : Sys.Config.Rummy.waitBeforeGameRestart);
	  		let totalPlayers = 0;
	  		for (i = 0; i < room.players.length; i++) {
	        	room.game.players.push(room.players[i]);
	  			if(room.players[i].status != 'Left'){
	  				totalPlayers++;
	  			}
	  		}

			// if (winnerPlayers.length == 2) {
			//   // for (var i = 0; i < winnerPlayers.length; i++) {
			//     winnerPlayers[0].totalPoint
			//     winnerPlayers[0].totalPoint = parseFloat(winnerPlayers[0].totalPoint + getPlayerById(winnerPlayers[1].playerId).playerScore)
			//     getPlayerById(winnerPlayers[0].playerId).totalPoint = winnerPlayers[0].totalPoint;
			//   // }
			//
			// }

	  		Sys.Timers[room.id] = setInterval(async function(room){
	  			//console.log("Deals Fainal Game Finsihed Timer",timer)

	  			await Sys.Io.of(Sys.Config.Namespace.CashDeals).to(room.id).emit('OnGameFinished', {
	  				 	winners: winnerPlayers,
	  					timer : timer,
	  				 	maxTimer : (!Sys.Config.Rummy.waitBeforeGameRestart ? 30 : Sys.Config.Rummy.waitBeforeGameRestart),
	  				 	type : room.tableType
	  			});

	  			timer--;

	  			if(timer < 1){
	  				clearTimeout(Sys.Timers[room.id]); // Clear waitforDeclare
	  				//console.log("Check For Start New Round");
	  				await Sys.Io.of(Sys.Config.Namespace.CashDeals).to(room.id).emit('OnGameRestart', {});

	  				for (i = 0; i < room.players.length; i++) {
	  					// check If Player total Point is More then GameOverPoint
	  					if(parseFloat(room.players[i].totalPoint) <= 0){
	  						//console.log("***********************Remove Player for Zero Total ********************************")
	  						//console.log("* > room.players[i].username >  ",room.players[i].username)
	  						//console.log("* > room.players[i].totalPoint >  ",room.players[i].totalPoint)
	  						//console.log("*******************************************************")
	  						// Remove Player from Game Player
	  						room.players[i].status = 'Left';
	  						await Sys.Io.of(Sys.Config.Namespace.CashDeals).to(room.id).emit('OnPoolDealLeave', {
	  							playerId : room.players[i].id,
	  							totalPoint : parseFloat(room.players[i].totalPoint),
	  							gameType : room.tableType
	  						});
	  					}

	  					if(room.players[i].status != 'Left'){
							room.players[i].dropped = false;
							room.players[i].cards = [];
							room.players[i].cardsString = '';
							room.players[i].playerScore = 0;
							room.players[i].cardTurn = true;
							room.players[i].timerPosition = 1;
							room.players[i].declare = false;
							room.players[i].extraTime = Sys.Config.Rummy.extraTime;
							room.players[i].turnCount = 1;
	  					}
	  				}

	          		let currentRoomId = room.game.id;
	  				roomUpdated = await Sys.Game.CashGame.Deals.Services.RoomServices.update(room);
	  				timer = parseFloat(Sys.Config.Rummy.waitBeforeGameStart);

				    room.timerStart = false; // Reset Timer Variable
					clearTimeout(Sys.Timers[room.id]); // Clear Room Timer

					roomUpdated = await Sys.Game.CashGame.Deals.Services.RoomServices.update(room);

					totalPlayers = 0;
					for (i = 0; i < room.players.length; i++) {
						if(room.players[i].status != 'Left'){
	                    	// //console.log("6666666666666666666666666666666666666666666666666666");
	                    	// //console.log("room.players[i].status", room.players[i].status);
	                    	// //console.log("6666666666666666666666666666666666666666666666666666");
	  						totalPlayers++;
	  					}
	  				}

					room.status = "Finished";
					room.game = null;
					// room.dealer = 0;
					room.currentPlayer = 0;

					//console.log('<===============================>');
					//console.log('<=> Ramain Player : <=>',totalPlayers);
					//console.log('<===============================>');

	                let restartGame = true;
	                let tieMatch = false;
	                let maxTotalPoint = 0;
	                if (totalPlayers < room.minPlayers || room.gamecount == room.gameOverPoint) {
						restartGame = false;
						let minTotalPoint = parseFloat(room.gameOverPoint) * 80;
						for (let i=0; i < room.players.length; i += 1) {
							// getting minimum value of total points.
							if (room.players[i].totalPoint < minTotalPoint) {
								minTotalPoint = room.players[i].totalPoint;
							}
							if (maxTotalPoint < room.players[i].totalPoint) {
								maxTotalPoint = room.players[i].totalPoint;
							}
						}
	                  	// checking tie match condition between lowest totalpoint
	                  	for (let i=0; i < room.players.length; i += 1) {
	                    	for (let j=0; j < room.players.length; j += 1) {
	                      		if (room.players[i].id != room.players[j].id && room.players[i].totalPoint == room.players[j].totalPoint) {
	                        		if (room.players[j].totalPoint == minTotalPoint) {
										// Tie Match condition
										//console.log("TieMatch");
										//console.log("room.players[i].totalPoint", room.players[i].totalPoint);
										//console.log("room.players[j].totalPoint", room.players[j].totalPoint);
										await Sys.Io.of(Sys.Config.Namespace.CashDeals).to(room.id).emit('TieMatch', {});
										restartGame = true;
										tieMatch = true
	                        		}
	                      		}
	                    	}
	                  	}
	                }

	  				if(restartGame == true){
						//console.log('<===============================>');
						//console.log('<=> New Game Starting [] <=>');
						//console.log('<===============================>');
	                  	if (tieMatch == true) {
	                    	room.gamecount = parseInt(room.gamecount - 1);
	                  	}
	  					room.StartGame();
	  				}else{
						//console.log('<===============================>');
										//console.log('<=> New Game Cannot Start [] <=>');
						//console.log("maxTotalPoint", maxTotalPoint);
										//console.log('<===============================>');
						room.gamecount = 0;
						let poolwinner = null;
						let totalWiningchips = 0;
						console.log("1269 totalWiningchips: ",totalWiningchips);
	                  	// //console.log("totalWiningchipstotalWiningchipstotalWiningchipstotalWiningchips1", totalWiningchips);
	  					for (let i=0; i < room.players.length; i += 1) {
	  						if (room.players[i].status != 'sitting' && room.players[i].status != 'waiting' ) {
	  							totalWiningchips = parseFloat(totalWiningchips) + parseFloat(room.entryFees);
	  							console.log("1274 totalWiningchips: ",totalWiningchips);
	                      		
	  							if (room.players[i].status === 'playing' && room.players[i].totalPoint == maxTotalPoint) {
									poolwinner = {
										playerId: room.players[i].id,
										username : room.players[i].username,
										winingChips : 0
									}
	  							}else{
	  								singlePlayerWinnigchips  = parseFloat(singlePlayerWinnigchips) + (parseFloat(room.entryFees));
	  								console.log("1284 singlePlayerWinnigchips: ",singlePlayerWinnigchips);
	  							}
	  						}
	  					}
	                  	//console.log("=================================================");
	                  	//console.log("=================================================");
	  					//console.log("poolwinner :",poolwinner);
	  					//console.log("totalWiningchips :",totalWiningchips);
	                  	//console.log("=================================================");
	                  	//console.log("=================================================");

	                  	// If all player get Lefted
	                  	if (poolwinner == null) {
	                    	//console.log("No Winner calculation can done coz maybe all player have lefted.");
	                    	let maxTotalPoint = 0
	                    	for (var i = 0; i < room.players.length; i++) {
	                      		if (room.players[i].totalPoint > maxTotalPoint && room.players[i].status == "Left") {
	                        		poolwinner = {
										playerId: room.players[i].id,
	  									username : room.players[i].username,
	  									winingChips : 0
	  								}
	                      		}
	                    	}
	                  	}

	                  	console.log("1310 totalWiningchips: ",totalWiningchips);
	                  	// manage admin commission
	                  	if (parseFloat(totalWiningchips) > 0) {
		                    // Deduct rack percentage from winning Amount
		                    let winningAmount = parseFloat(totalWiningchips);
		                    totalWiningchips   = parseFloat( parseFloat( parseFloat( totalWiningchips ) * ( 100 - room.rack ) ) / 100 );
		                    console.log("1316 totalWiningchips: ",totalWiningchips);
		                    console.log("1316 winningAmount: ",winningAmount);

		                    // //console.log("totalWiningchipstotalWiningchipstotalWiningchipstotalWiningchips3", totalWiningchips);
		                    let adminCommissonAmount  = parseFloat( parseFloat( parseFloat( winningAmount ) * room.rack ) / 100 );
		                    let updatedAdminCommission = await Sys.Game.CashGame.Deals.Services.RoomServices.createCommission({
								roomid                : room.id,
								gameid                : currentRoomId,
								gameType              : room.gameType,
								prizepool             : winningAmount,
								commissionAmount      : adminCommissonAmount,
								commissionPercentage  : room.rack,
								winnerAmount          : totalWiningchips,
								createdAt							: Date.now(),
		                    });

		                   //TDS Start
		                   let tds  = await Sys.Game.CashGame.Deals.Services.RoomServices.getSettingsData({});
		                   let playerObj = await Sys.Game.CashGame.Deals.Services.PlayerServices.getById(poolwinner.playerId);
		                   //console.log("playerssss",playerObj);
		                   let totalWinAmtchips=totalWiningchips;
		                   //totalWiningchips =  (parseFloat(parseFloat(totalWiningchips))-(room.entryFees));
		                   console.log("1338 totalWiningchips: ",totalWiningchips);
		                   //console.log("feeeeeeeesss",totalWiningchips);

							if (parseFloat(totalWiningchips) > tds.amount) {
								//console.log("5555555555555555555555555555555555555");
								//console.log("5555555555555555555555555555555555555");
								//console.log("5555555555555555555555555555555555555");
								//console.log("5555555555555555555555555555555555555");
								//console.log("5555555555555555555555555555555555555");

								// Deduct rack percentage from winning Amount
								//console.log("feeeeeeeesss",totalWiningchips);
								let total = 0;
								total  = parseFloat( parseFloat( parseFloat( totalWiningchips ) * ( tds.rack ) / 100 ));
								let finalwinAmount = parseFloat( totalWiningchips ) - parseFloat( total );
								totalWiningchips=parseFloat( finalwinAmount ) + parseFloat( room.entryFees );

								//let adminCommissonAmount  = parseFloat( parseFloat( parseFloat( winningAmount ) * room.rack ) / 100 );
								let updatedTdsCommission = await Sys.Game.CashGame.Pool.Services.RoomServices.createTds({
									roomid                : room.id,
									gameid                : currentRoomId,
									username							 : playerObj.username,
									gameType              : room.gameType,
									prizepool             : winningAmount,
									winnerAmount          : totalWinAmtchips,
									tds                   : tds.rack,
									afterWinAmount				 : totalWiningchips,
									createdAt						 : Date.now(),
								});

								let totTds=0;
								//totTds =  ( parseFloat( parseFloat(totalWiningchips) ) + ( playerObj.tdsAmount ));
								totTds = parseFloat(total)	+ parseFloat( playerObj.tdsAmount );

								//console.log("tds",totTds);

								let updatedTds = await Sys.Game.CashGame.Deals.Services.PlayerServices.update(playerObj.id,{
									tdsAmount : totTds
								});

								//console.log(")))))))))))))))",updatedTds);
							}
							//TDS End
						}

	  					if(poolwinner != null){
	  						poolwinner.winingChips = totalWiningchips;
	                    	// //console.log("totalWiningchipstotalWiningchipstotalWiningchipstotalWiningchips4", totalWiningchips);
	  						let playerObj = await Sys.Game.CashGame.Deals.Services.PlayerServices.getById(poolwinner.playerId);
	  						// Add Player Chips
	  						// let newChips = parseFloat(parseFloat(playerObj.cash) + parseFloat(totalWiningchips));

	                    	// ~
	                    	let playerCashManager = await Sys.Game.CashGame.Deals.Services.PlayerServices.getCashManager({ playerId: poolwinner.playerId });
	                    	let transferAmount = 0; //from lockCash to depositedCash
	                    	let newLockCash = playerCashManager.lockCash;
	                    	// let newTotalCash = playerCashManager.totalCash + parseFloat(totalWiningchips);
	                    	//calculate winning reward points
	                    	console.log("1396 totalWiningchips: ",totalWiningchips);
	                    	console.log("1396 room.entryFees: ",room.entryFees);
	                    	let winningRewardPoint = parseFloat( (parseFloat(totalWiningchips)-room.entryFees) / 60 ); // deduction player's entry fee
	                    	console.log("1399 winningRewardPoint: ",winningRewardPoint);
	                    	if (playerCashManager.lockCash > 0 && playerCashManager.lockCash >= winningRewardPoint) {
	                      		newLockCash = newLockCash - winningRewardPoint;
	                      		transferAmount = winningRewardPoint;
	                    	}else if (playerCashManager.lockCash < winningRewardPoint && playerCashManager.lockCash != 0) {
	                      		newLockCash = 0;
	                      		transferAmount = playerCashManager.lockCash
	                    	}

	                    	console.log("1408 playerCashManager.wonCash: "+playerCashManager.wonCash);
	                    	console.log("1408 playerCashManager.depositedCash: "+playerCashManager.depositedCash);
	                    	console.log("1408 transferAmount: "+transferAmount);
	                    	let newTotalCash = playerCashManager.wonCash + ( parseFloat(totalWiningchips) - parseFloat(room.entryFees) ) + playerCashManager.depositedCash + transferAmount;
	                    	console.log("1412 newTotalCash: "+newTotalCash);

		                    //  check for if player reached the requiredRewardPoint from his last Deposit
		                    let withdrawLimitAddon = 0;
		                    let playerDepositManager = await Sys.Game.CashGame.Deals.Services.PlayerServices.getLastDepositManager({ playerId: playerObj.id, status: "Success" });
		                    if (playerDepositManager != null) {
								if (playerDepositManager.length != 0) {
									if ( playerDepositManager.requiredRewardPointReached != true ) {
										// if (playerDepositManager.requiredRewardPointReached && playerDepositManager.requiredRewardPointReached != true ) {
										if ( parseFloat(playerCashManager.rewardPoint + winningRewardPoint) >= playerDepositManager.requiredRewardPoint ) {
											withdrawLimitAddon = parseFloat(playerCashManager.depositedCash) + parseFloat(transferAmount)
											await Sys.Game.CashGame.Deals.Services.PlayerServices.updateDepositManager({ _id: playerDepositManager._id }, { requiredRewardPointReached : true });
										}
									}else {
										withdrawLimitAddon = parseFloat(transferAmount);
									}
								}
		                    }



		                    let cashManageData = {
								totalCash     : newTotalCash,
								wonCash       : playerCashManager.wonCash + (parseFloat(totalWiningchips) - parseFloat(room.entryFees) ),
								depositedCash : playerCashManager.depositedCash + transferAmount,
								lockCash      : newLockCash,
								withdrawLimit : playerCashManager.withdrawLimit + (parseFloat(totalWiningchips) - parseFloat(room.entryFees) ) + withdrawLimitAddon,
								rewardPoint   : playerCashManager.rewardPoint + winningRewardPoint,
								releasedCash  : playerCashManager.releasedCash + transferAmount,
		                    }
		                    let updatedPlayerCash = await Sys.Game.CashGame.Deals.Services.PlayerServices.updateCashManager({ playerId: playerObj.id },cashManageData);

		                    let updatedPlayer = await Sys.Game.CashGame.Deals.Services.PlayerServices.update(playerObj.id,{ cash: newTotalCash, rewardPoint: playerCashManager.rewardPoint + winningRewardPoint, cashTransaction:( parseFloat(playerObj.cashTransaction) + parseFloat(totalWiningchips) )  });

	                    	for (var i = 0; i < room.participantPlayers.length; i++) {
	                      		if (room.participantPlayers[i].id != poolwinner.playerId) {
	                        		let player = await Sys.Game.CashGame.Deals.Services.PlayerServices.getById(room.participantPlayers[i].id);

			                        // ~ Manage chips management start
			                        let wonValue = parseFloat(parseFloat(room.entryFees) * (-1))
			                        let playerCashManagerLooser = await Sys.Game.CashGame.Deals.Services.PlayerServices.getCashManager({ playerId: player.id });
			                        let transferAmountLooser = 0; //from lockCash to depositedCash
			                        let newWonCash = playerCashManagerLooser.wonCash;
			                        let newLockCashLooser = playerCashManagerLooser.lockCash;
			                        let newTotalCashLooser = playerCashManagerLooser.totalCash + wonValue;
			                        let newDepositedCash = playerCashManagerLooser.depositedCash;
			                        let newWithdrawLimit = playerCashManagerLooser.withdrawLimit
			                        //calculate winning reward points
			                        let winningRewardPointLooser = parseFloat( parseFloat(wonValue*-1) / 60 );

			                        if ( playerCashManagerLooser.totalCash < (wonValue*(-1)) ) {
										newTotalCashLooser = 0;
										newWonCash = 0;
										// newLockCashLooser = 0;
										newDepositedCash = 0;
										newWithdrawLimit = 0;
			                        }else {
										newTotalCashLooser = playerCashManagerLooser.totalCash + wonValue;
										if ( playerCashManagerLooser.wonCash < (wonValue*(-1)) ) {
											newWonCash = 0;
											if ( playerCashManagerLooser.depositedCash < ((wonValue + playerCashManagerLooser.wonCash) *(-1)) ) {
												newDepositedCash = 0;
											}else {
												newDepositedCash = playerCashManagerLooser.depositedCash + (wonValue + playerCashManagerLooser.wonCash);
											}	                           
										}else {
											newWonCash = playerCashManagerLooser.wonCash + wonValue;
										}

										if ( playerCashManagerLooser.withdrawLimit < (wonValue*(-1)) ) {
											newWithdrawLimit = 0;
										}else {
											newWithdrawLimit = playerCashManagerLooser.withdrawLimit + wonValue;
										}
			                        }

			                        if (newLockCashLooser > 0 && newLockCashLooser >= winningRewardPointLooser) {
			                        	newLockCashLooser = newLockCashLooser - winningRewardPointLooser;
			                        	transferAmountLooser = winningRewardPointLooser;
			                        }else if (newLockCashLooser < winningRewardPointLooser && newLockCash != 0) {
			                        	newLockCashLooser = 0;
			                        	transferAmountLooser = playerCashManagerLooser.lockCash
			                        }

			                        //  check for if player reached the requiredRewardPoint from his last Deposit
			                        let withdrawLimitAddonLooser = 0;
			                        let playerDepositManagerLooser = await Sys.Game.CashGame.Deals.Services.PlayerServices.getLastDepositManager({ playerId: player.id, status: "Success" });
			                        if (playerDepositManagerLooser != null) {
										if (playerDepositManagerLooser.length != 0) {
											if (playerDepositManagerLooser.requiredRewardPointReached && playerDepositManagerLooser.requiredRewardPointReached != true ) {
												if ( parseFloat(playerCashManagerLooser.rewardPoint + winningRewardPointLooser) >= playerDepositManagerLooser.requiredRewardPointReached ) {
													withdrawLimitAddonLooser = parseFloat(newDepositedCash) + parseFloat(transferAmountLooser)
													await Sys.Game.CashGame.Deals.Services.PlayerServices.updateDepositManager({ _id: playerDepositManagerLooser._id }, { requiredRewardPointReached : true });
												}
											}else {
												withdrawLimitAddonLooser = parseFloat(transferAmountLooser);
											}
										}
			                        }

			                        //
			                        if(transferAmountLooser > 0){
			                        	newTotalCashLooser = newTotalCashLooser + transferAmountLooser;
			                        }

			                        let cashManageData = {
										totalCash     : newTotalCashLooser,
										wonCash       : newWonCash,
										lockCash      : newLockCashLooser,
										depositedCash : newDepositedCash + transferAmountLooser,
										withdrawLimit : newWithdrawLimit + withdrawLimitAddonLooser,
										rewardPoint   : playerCashManagerLooser.rewardPoint + winningRewardPointLooser,
										releasedCash  : playerCashManagerLooser.releasedCash + transferAmountLooser,
			                        }
			                        let updatedPlayerCash = await Sys.Game.CashGame.Deals.Services.PlayerServices.updateCashManager({ playerId: player.id },cashManageData);
			                        let updatedPlayer = await Sys.Game.CashGame.Deals.Services.PlayerServices.update(player.id,{ cash: newTotalCashLooser, rewardPoint: playerCashManagerLooser.rewardPoint + winningRewardPointLooser, cashTransaction:(parseFloat(player.cashTransaction) + parseFloat(wonValue*(-1)) )  });
			                        // ~ Manage chips management end
	                      		}
	                    	}
	                    	room.participantPlayers = [];

							let trnsObj = {
								playerId          : playerObj.id,
								gameId            : currentRoomId,
								chips             : 0,
								cash              : parseFloat(totalWiningchips),
								type              : 'credit',   //debit/credit
								gameType          : "deals",
								tableType         : "CashGame",
								tranType 			    : 'cash',
								message           : 'Game Winning Chips',
								tableNumber       : room.tableNumber,
								transactionNumber : '',
								afterBalance      : newTotalCash,
								status            : 'sucess',
							}
							let chipsTransection = await Sys.Game.CashGame.Deals.Services.PlayerServices.cerateChipsCashHistory(trnsObj);
						}


						await Sys.Io.of(Sys.Config.Namespace.CashDeals).to(room.id).emit('OnPoolDealGameWinner', poolwinner);

						room.status = "waiting";
						room.game = null;
						room = await Sys.Game.CashGame.Deals.Services.RoomServices.update(room);
	  								
	  				}
	  			}

	  		}, 1000, room);
	  	}catch (error) {
	  		Sys.Log.info('Error in gameFinished : ' + error);
	  		return new Error('Error in gameFinished');
	  	}
	},
	pushOpenDeck: async function(data) {
		try{
			//console.log('<=> Game Player pushOpenDeck Action || :',data);
			let room = await Sys.Game.CashGame.Deals.Services.RoomServices.get(data.roomId);
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

			var currentPlayer = room.getCurrentPlayer();
			//console.log("Current Palyer :",currentPlayer.username);
			if (currentPlayer && (currentPlayer.id != data.playerId)) {
				return new Error('Its not your turn or your turn expired');
			}

			currentPlayer.droppedCount = 0;  // When Play Do Some Turn

			clearTimeout(Sys.Timers[room.id]); // Clear Turn Timer


			//console.log("room.game.status->",room.game.status);
			if (room.game.status == 'Running') {
				room.game.openDeck.push(data.card); // Push card to OpenDeck
				//console.log("Change turn");

				for(let i = 0; i < currentPlayer.cards.length ; i++){
					if(currentPlayer.cards[i] == data.card){
						currentPlayer.cards.splice(i,1);
					}
				}

				roomUpdated = await Sys.Game.CashGame.Deals.Services.RoomServices.update(room);

				await Sys.Game.CashGame.Deals.Controllers.RoomProcess.changeTurn(room);
				//console.log("Room Save");

				roomUpdated = await Sys.Game.CashGame.Deals.Services.RoomServices.update(room);
				//console.log("PushOpenDeck Brodcast Send");
				let broObj = {
					playerId : data.playerId,
					card: data.card
				}
				await Sys.Io.of(Sys.Config.Namespace.CashDeals).to(room.id).emit('PushOpenDeck',broObj);
				//console.log("Turn Finished Called");
				//Save History
				let dataObj = {
					playerId:currentPlayer.id,
					action: 'Push Open Deck',
					card : data.card,
					cardString : '',
					time : Date.now()
				}
				room = await Sys.Game.CashGame.Deals.Controllers.RoomProcess.saveHistory(room,dataObj);
				await Sys.Game.CashGame.Deals.Controllers.RoomProcess.turnFinished(room);
        return ;

			} else {
				return new Error('Game is not running');
			}
		}catch (error) {
			Sys.Log.info('Error in pushOpenDeck : ' + error);
			return new Error('Error in pushOpenDeck');
		}
	},
  	getOpenDeckList: async function(data) {
		try{
			//console.log('<=> Game Player pushOpenDeck Action || :',data);
			let room = await Sys.Game.CashGame.Deals.Services.RoomServices.get(data.roomId);
			if (!room) {
				return {
					status: 'fail',
					result: null,
					message: "Room not found",
					statusCode: 401
				};
			}
			return {
				status: 'success',
				result: room.game.openDeck,
				message: "Open Deck List",
				statusCode: 401
			};

		}catch (error) {
			Sys.Log.info('Error in pushOpenDeck : ' + error);
			return new Error('Error in pushOpenDeck');
		}
	},
	popOpenDeck: async function(data) {
		try{
			//console.log('<=> Game Player popOpenDeck Action || :',data);
			let room = await Sys.Game.CashGame.Deals.Services.RoomServices.get(data.roomId);
			if (!room) {
				return {status: 'fail',	result: null,message: "Room not found",statusCode: 401};
			}
      if (room.status != 'Running') {
				return new Error('Game Finished. Please Try Again!');
			}
			var currentPlayer = room.getCurrentPlayer();

			if (currentPlayer && (currentPlayer.id != data.playerId)) {
				return new Error('Its not your turn or your turn expired');
			}


			if(currentPlayer.cardTurn == true){
				//console.log("Card Turn Already Done.")
				return new Error('Card Turn Already Done.');
			}

			//console.log("room.game.status->",room.game.status);
			if (room.game.status == 'Running') {

        if(room.game.history.length > 1 && room.game.openDeck[room.game.openDeck.length-1] == 'PJ'){
        // if(room.game.openDeck.length !=1 && room.game.openDeck[room.game.openDeck.length-1] == 'PJ'){
					return new Error('It is Joker Card So You Can Not Pick');
				}
        if(room.game.history.length > 1 && room.game.openDeck[room.game.openDeck.length-1].length == 3){
        // if(room.game.openDeck.length !=1 && room.game.openDeck[room.game.openDeck.length-1].length == 3){
					return new Error('It is Joker Card So You Can Not Pick');
				}


				data.card = room.game.openDeck.pop(); // Move Card From open Deck to Player Cards
				currentPlayer.cards.push(data.card); //
				currentPlayer.cardTurn = true; // Card Turn Done
				//console.log("Room Save");

				roomUpdated = await Sys.Game.CashGame.Deals.Services.RoomServices.update(room);

				//console.log("popOpenDeck Brodcast Send");
				let broObj = {
					playerId : data.playerId,
					card: data.card,
					openDeckCard : (room.game.openDeck[room.game.openDeck.length-1] == undefined) ? ""  : room.game.openDeck[room.game.openDeck.length-1],

				}
				//console.log("broObj->",broObj);
				await Sys.Io.of(Sys.Config.Namespace.CashDeals).to(room.id).emit('PopOpenDeck',broObj);
				//Save History
				let dataObj = {
					playerId:currentPlayer.id,
					action: 'Pop Open Deck',
					card : data.card,
					cardString : '',
					time : Date.now()
				}
				room = await Sys.Game.CashGame.Deals.Controllers.RoomProcess.saveHistory(room,dataObj);
        return ;
			} else {
				return new Error('Game is not running');
			}
		}catch (error) {
			Sys.Log.info('Error in popOpenDeck : ' + error);
			return new Error('Error in popOpenDeck');
		}
	},
	popCloseDeck: async function(data) {
		try{
			let i = 0;
		//console.log('<=> Game Player popCloseDeck Action || :',data);
		let room = await Sys.Game.CashGame.Deals.Services.RoomServices.get(data.roomId);

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
    var currentPlayer = room.getCurrentPlayer();
			//console.log("Pop Close Deck Current Palyer :",currentPlayer.username);
		if (currentPlayer && (currentPlayer.id != data.playerId)) {
			return new Error('Its not your turn or your turn expired');
		}

		if(currentPlayer.cardTurn == true){
			//console.log("Card Turn Already Done.")
			return new Error('Card Turn Already Done.');
		}

		//console.log("room.game.status->",room.game.status);



		if (room.game.status == 'Running') {

			if(room.game.closeDeck.length == 0){
				//console.log("All Close Deck Card Finished!");
        let i, j, tempi, tempj;
				for (i = 0; i < room.game.openDeck.length; i += 1) {
					j = Math.floor(Math.random() * (i + 1));
					tempi = room.game.openDeck[i];
					tempj = room.game.openDeck[j];
					room.game.openDeck[i] = tempj;
					room.game.openDeck[j] = tempi;
				}
				for(i=0;i<room.game.openDeck.length - 1;i++){
					room.game.closeDeck.push(room.game.openDeck[i]); // Move Cards Form Open Deck To Close Deck
				}

				await Sys.Io.of(Sys.Config.Namespace.CashDeals).to(room.id).emit('CloseDeckCardsRefill',{});
			}


			data.card = room.game.closeDeck.pop(); // Move Card From open Deck to Player Cards

			currentPlayer.cards.push(data.card); //
			currentPlayer.cardTurn = true; // Card Turn Done
			//console.log("Room Save");

			roomUpdated = await Sys.Game.CashGame.Deals.Services.RoomServices.update(room);



			//console.log("popCloseDeck Brodcast Send");
			let broObj = {
				playerId : data.playerId,
				card: data.card
			}
			await Sys.Io.of(Sys.Config.Namespace.CashDeals).to(room.id).emit('PopCloseDeck',broObj);
		//Save History
		let dataObj = {
			playerId:currentPlayer.id,
			action: 'Pop Close Deck',
			card : data.card,
			cardString : '',
			time : Date.now()
		}
		room = await Sys.Game.CashGame.Deals.Controllers.RoomProcess.saveHistory(room,dataObj);
    return ;
		} else {
			return new Error('Game is not running');
		}
		}catch (error) {
			Sys.Log.info('Error in popCloseDeck : ' + error);
			return new Error('Error in popCloseDeck');
		}
	},
	playerDrop: async function(data) {
		try{
			//console.log("playerDrop Data", data);
			let room = await Sys.Game.CashGame.Deals.Services.RoomServices.get(data.roomId);

			if (!room) {

				//console.log('<=> Removing Player Room Not Found');
				return {
					status: 'fail',
					result: null,
					message: "Room Not Found",
					statusCode: 401
				};
			}
     	 if (room.status != 'Running') {
				return new Error('Game Finished. Please Try Again!');
			}
			 let currentPlayer = room.getCurrentPlayer()
				if (currentPlayer && (currentPlayer.id != data.playerId)) {
					return new Error('Its not your turn or your turn expired');
				}




			if (room.players.length > 0) {
				for (let i = 0; i < room.players.length; i++) {
					if (room.players[i].id == data.playerId && room.players[i].status != 'Left') {

						room.players[i].dropped = true;
            			if(room.players[i].turnCount == 2 || room.players[i].turnCount == 1){
							room.players[i].playerScore = Sys.Config.Rummy.playerFirstDrop;
						}else if(room.players[i].turnCount == 3){
							room.players[i].playerScore = Sys.Config.Rummy.playerSecondDrop;
						}else{
							room.players[i].playerScore = Sys.Config.Rummy.playerThirdDrop;
						}

						break;
					}
				}
			}
			await Sys.Io.of(Sys.Config.Namespace.CashDeals).to(room.id).emit('PlayerDrop', { 'playerId': data.playerId });

				roomUpdated = await Sys.Game.CashGame.Deals.Services.RoomServices.update(room); // Update Player

				// room  =  await Sys.Game.CashGame.Deals.Controllers.RoomProcess.broadcastPlayerInfo(room);
				room  =  await Sys.Game.CashGame.Deals.Controllers.RoomProcess.checkTurnFinished(room,data.playerId);
					// Save History
					let dataObj = {
						playerId:currentPlayer.id,
						action: 'Player Drop',
						card : '',
						cardString : '',
						time : Date.now()
					}
					room = await Sys.Game.CashGame.Deals.Controllers.RoomProcess.saveHistory(room,dataObj);

				return {
					status: 'success',
					message: "Player Droped success",
					statusCode: 200
				};

		}catch (error) {
			Sys.Log.info('Error in playerDrop : ' + error);
			return new Error('Error in playerDrop');
		}
	},
	playerCardsScore: async function(data) {
		try{

			let room = await Sys.Game.CashGame.Deals.Services.RoomServices.get(data.roomId);

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
					room.players[i].playerScore = data.pointValue;
					// room.players[i].cardsString = data.cardsString;
					break;
				}
			}
			roomUpdated = await Sys.Game.CashGame.Deals.Services.RoomServices.update(room);

			return {
				status: 'sucess',
				result:  data.pointValue,
				message: "Socre Updated",
				statusCode: 200
			};
		}catch (error) {
			Sys.Log.info('Error in playerCardsScore : ' + error);
			return new Error('Error in playerCardsScore');
		}
	},

  playerTableCards: async function(data) {
		try{

			let room = await Sys.Game.CashGame.Deals.Services.RoomServices.get(data.roomId);

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
					// room.players[i].playerScore = data.pointValue;
					room.players[i].cardsString = data.cardsString;
					break;
				}
			}
			roomUpdated = await Sys.Game.CashGame.Deals.Services.RoomServices.update(room);

			return {
				status: 'sucess',
				result:  data.pointValue,
				message: "Socre Updated",
				statusCode: 200
			};
		}catch (error) {
			Sys.Log.info('Error in playerTableCards : ' + error);
			return new Error('Error in playerTableCards');
		}
	},

	declarefinishGame: async function(data) {
		try{
			//console.log('<=> Game Player finishGame Action || :',data);
			let room = await Sys.Game.CashGame.Deals.Services.RoomServices.get(data.roomId);
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
		var currentPlayer = room.getCurrentPlayer();
		////console.log("Current Palyer :",currentPlayer);
		if (currentPlayer && (currentPlayer.id != data.playerId)) {
			return new Error('Its not your turn or your turn expired');
		}


		//console.log("room.game.status->",room.game.status);
		if (room.game.status == 'Running') {
			room.game.finishDeck.push(data.card); // Push card to OpenDeck
			//console.log("Change turn");
			// Save History
			let dataObj = {
				playerId:currentPlayer.id,
				action: 'Player Finishe Game',
				card : data.card,
				cardString : '',
				time : Date.now()
			}
			room = await Sys.Game.CashGame.Deals.Controllers.RoomProcess.saveHistory(room,dataObj);
			for(let i = 0; i < currentPlayer.cards.length ; i++){
				if(currentPlayer.cards[i] == data.card){
					currentPlayer.cards.splice(i,1);
				}
			}

			let broObj = {
				playerId : data.playerId,
				card: data.card
			}
			await Sys.Io.of(Sys.Config.Namespace.CashDeals).to(room.id).emit('PushFinishDeck',broObj);
			roomUpdated = await Sys.Game.CashGame.Deals.Services.RoomServices.update(room);

			// Start Finish Timer
			clearTimeout(Sys.Timers[room.id]);

			let timer = 45;
			Sys.Timers[room.id] = setInterval(async function(room){
				//console.log("Finish timer",timer)
				await Sys.Io.of(Sys.Config.Namespace.CashDeals).to(room.id).emit('OnFinishTimer', {
					roomId: room.id,
					timer : timer,
					playerId : data.playerId,
					finishName : currentPlayer.username,
					maxTimer : 45
				});
				timer--;

				if(timer == 0){
					clearTimeout(Sys.Timers[room.id]); // Clear waitforDeclare

					// Player Not Declare With in Timer So Drop Theme.
					if (room.players.length > 0) {
						for (let i = 0; i < room.players.length; i++) {
							if (room.players[i].id == data.playerId && room.players[i].status != 'Left') {
								room.players[i].dropped = true;
								room.players[i].playerScore =  80;
               					// if(room.players[i].turnCount == 2 || room.players[i].turnCount == 1){
								// 	room.players[i].playerScore = Sys.Config.Rummy.playerFirstDrop;
								// }else if(room.players[i].turnCount == 3){
								// 	room.players[i].playerScore = Sys.Config.Rummy.playerSecondDrop;
								// }else{
								// 	room.players[i].playerScore = Sys.Config.Rummy.playerThirdDrop;
								// }
								break;
							}
						}
					}
					await Sys.Io.of(Sys.Config.Namespace.CashDeals).to(room.id).emit('PlayerDrop', { 'playerId': data.playerId });

					roomUpdated = await Sys.Game.CashGame.Deals.Services.RoomServices.update(room); // Update Player
					room  =  await Sys.Game.CashGame.Deals.Controllers.RoomProcess.checkTurnFinished(room,data.playerId);


				}
			}, 1000, room);



		} else {
			return new Error('Game is not running');
		}
		}catch (error) {
			Sys.Log.info('Error in declarefinishGame : ' + error);
			return new Error('Error in declarefinishGame');
		}
	},
	declareGame: async function(data) {
		try{
			let i = 0;
		//console.log('<=> Game Player declareGame Action || :',data);
		let room = await Sys.Game.CashGame.Deals.Services.RoomServices.get(data.roomId);
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
		var currentPlayer = room.getCurrentPlayer();
		//console.log("room.game.declare.length :",room.game.declare.length);
		if (currentPlayer && (currentPlayer.id != data.playerId) &&  room.game.declare.length == 0) {
			return new Error('Its not your turn For Declare');

		}

		//console.log("room.game.status->",room.game.status);
		if (room.game.status == 'Running') {
			// When Current Player Declare
			if(currentPlayer.id == data.playerId){

				// Save History
			let dataObj = {
				playerId:currentPlayer.id,
				action: 'Player Declare Game',
				card : '',
				cardString : currentPlayer.cardsString,
				time : Date.now()
			}
			room = await Sys.Game.CashGame.Deals.Controllers.RoomProcess.saveHistory(room,dataObj);

				//console.log("currentPlayer.playerScore ++++++++++>",currentPlayer.playerScore);
					if(currentPlayer.playerScore == 0){
						clearTimeout(Sys.Timers[room.id]); // Clear waitforFinshDeclareDeclare
						//console.log('Game Finsihed Declare Player');
						currentPlayer.declare = true;
						room.game.declare.push(data.playerId);
						roomUpdated = await Sys.Game.CashGame.Deals.Services.RoomServices.update(room); // Update room

						if(room.game.declare.length == 1){ // if Some one Already declare so not call declare
							room  =  await Sys.Game.CashGame.Deals.Controllers.RoomProcess.waitForGameDeclare(room,data.playerId);
						}

						return {
							status: 'success',
							message: "Player Declare success",
							statusCode: 200
						};

					}else{
						//console.log('Droped Player');

           			 await Sys.Io.of(Sys.Config.Namespace.CashDeals).to(room.id).emit('CloseFinishTimer', {});
						currentPlayer.dropped = true;
            currentPlayer.playerScore = 80;
            if (data.wrongfinished) {
              currentPlayer.wrongfinished = data.wrongfinished;
            }

						// Save History
						let dataObj = {
							playerId:currentPlayer.id,
							action: 'Player Wrong Declare Drop',
							card : '',
							cardString : currentPlayer.cardsString,
							time : Date.now()
						}
						room = await Sys.Game.CashGame.Deals.Controllers.RoomProcess.saveHistory(room,dataObj);



						clearTimeout(Sys.Timers[room.id]); // Clear waitforDeclare


						await Sys.Io.of(Sys.Config.Namespace.CashDeals).to(room.id).emit('PlayerDrop', { 'playerId': data.playerId });

						roomUpdated = await Sys.Game.CashGame.Deals.Services.RoomServices.update(room); // Update Player


						room  =  await Sys.Game.CashGame.Deals.Controllers.RoomProcess.checkTurnFinished(room,data.playerId);


						return {
							status: 'success',
							message: "Player Droped success",
							statusCode: 200
						};

					}




			}else{
			// Other Player Decalre


				for (i = 0; i < room.players.length; i++) {
					if (room.players[i].id == data.playerId && room.players[i].status != 'Left') {
						// Save History
						let dataObj = {
							playerId:data.playerId,
							action: 'Player Declare',
							card : '',
							cardString : room.players[i].cardsString,
							time : Date.now()
						}
						room = await Sys.Game.CashGame.Deals.Controllers.RoomProcess.saveHistory(room,dataObj);
						room.players[i].declare = true;
						break;
					}
				}

				roomUpdated = await Sys.Game.CashGame.Deals.Services.RoomServices.update(room); // Update Player

				// check If All Player Declare
				let allDeclare = true;

				for (i = 0; i < room.players.length; i++) {
					if (room.players[i].declare == false &&  room.players[i].dropped == false && room.players[i].status == 'playing') {
						allDeclare = false;
					}
				}
				//console.log("All Player Declare :",allDeclare);
				if(allDeclare){
					clearTimeout(Sys.Timers[room.id]); // Clear waitforDeclare
					room  =  await Sys.Game.CashGame.Deals.Controllers.RoomProcess.gameFinished(room);
				}


				return {
					status: 'success',
					message: "Player Declare success",
					statusCode: 200
				};

			}
		} else {
			return new Error('Game is not running');
		}

		}catch (error) {
			Sys.Log.info('Error in declareGame : ' + error);
			return new Error('Error in declareGame');
		}
	},
	leaveRoom: async function(data) {
		try{
			////console.log("LeftRoom Data", data);
			if (!data.roomId) {
				//console.log('<=> Removing Player RoomID Not Found');
				return {
					status: 'fail',
					result: null,
					message: "Room Not Found",
					statusCode: 401
				};
			}
			let room = await Sys.Game.CashGame.Deals.Services.RoomServices.get(data.roomId);
			if (!room) {
				//console.log('<=> Removing Player Room Not Found');
				return {
					status: 'fail',
					result: null,
					message: "Room Not Found",
					statusCode: 401
				};
			}
			//console.log('<=> LeftRoom Called || GAME-NUMBER [] || Data : ',data);
			//check for user already present //
			// chek seat in players array
			let player = null;
			let playerId = 0;
			let removePlayer = false; // When Player Status is 'sitting' Or 'waiting' So Left Player From Room;
			if (room.players.length > 0 && data.playerId != undefined ) {
				for (let i = 0; i < room.players.length; i++) {
					if (room.players[i].id == data.playerId && room.players[i].status != 'Left') {

						if(room.players[i].status == 'sitting' || room.players[i].status == 'waiting'){
							removePlayer = true;

							let playerObj = await Sys.Game.CashGame.Deals.Services.PlayerServices.getById(data.playerId);
							if(!playerObj){
								return { status: 'fail', result: null, message: 'No Player Found!.', statusCode: 401 }
							}

							// let newChips =  parseFloat(parseFloat(playerObj.cash) + parseFloat(room.entryFees));
							// let updatedPlayer = await Sys.Game.CashGame.Deals.Services.PlayerServices.update(playerObj.id,{ cash: newChips });
							// let trnsObj = {
							// 	playerId : playerObj.id,
							// 	chips             : parseFloat(room.entryFees),
							// 	cash            : 0,
							// 	type              : 'credit',   //debit/credit
							// 	tranType : 'cash',
							// 	gameType : "deals",
							// 	tableType : "CashGame",
							// 	message            : 'Entry Fee Refund',
							// 	tableNumber            : room.tableNumber,
							// 	transactionNumber : '',
							// 	afterBalance      : newChips,
							// 	status           : 'sucess',
							// }
							// let chipsTransection = await Sys.Game.CashGame.Deals.Services.PlayerServices.cerateChipsCashHistory(trnsObj);
						}


						player = room.players[i];
						room.players[i].status = 'Left';

      			//console.log("room.players[i].droppedReturned", room.players[i].droppedReturned);

            if (room.players[i].dropped == false) {
              if(room.players[i].turnCount == 2  || room.players[i].turnCount == 1 ){
  							room.players[i].playerScore = Sys.Config.Rummy.playerFirstDrop;
  						}else if(room.players[i].turnCount == 3){
  							room.players[i].playerScore = Sys.Config.Rummy.playerSecondDrop;
  						}else{
  							room.players[i].playerScore = Sys.Config.Rummy.playerThirdDrop;
  						}
            }
            room.players[i].dropped = true;
						room.players[i].droppedReturned = true;



						//console.log("=======================================================");
						//console.log("room.players[i].status", room.players[i].status);
						//console.log("=======================================================");
						playerId = room.players[i].id;
            			//console.log("=======================================================");
						//console.log("room.players[i].username", room.players[i].username);
						//console.log("=======================================================");
						//console.log("=======================================================");
						//console.log("room.players[i].playerScore", room.players[i].playerScore);
						//console.log("=======================================================");
						break;
					}
				}
			}
			if (player) {
				//console.log('<=> Removing Player || GAME-NUMBER [] ||');

				if (room.game && room.game.status == 'Running') {

					//console.log('<=> Game PlayerLeft Broadcast || GAME-NUMBER [] || PlayerLeft : ',player.username);
					room  =  await Sys.Game.CashGame.Deals.Controllers.RoomProcess.checkTurnFinished(room,playerId);
				}
				//console.log('Remove Player');

				// if(removePlayer){
				// 	for (let i = 0; i < room.players.length; i++) {
				// 		if (room.players[i].status == 'Left' && room.players[i].id == playerId) {
				// 			room.players.splice(i, 1);
				// 		}
				// 	}
				// }


				// Remove Palyer From room

				roomUpdated = await Sys.Game.CashGame.Deals.Services.RoomServices.update(room); // Update Player

				await Sys.Io.of(Sys.Config.Namespace.CashDeals).to(room.id).emit('PlayerLeft', { 'playerId': player.id });

       			 if(removePlayer){
					for (let i = 0; i < room.players.length; i++) {
						if (room.players[i].status == 'Left' && room.players[i].id == playerId) {
							room.players.splice(i, 1);
						}
					}
				}
        // ~~~
        let activePlayerCount = 0;
        for (var i = 0; i < room.players.length; i++) {
          if (room.players[i].status != "Left") {
            activePlayerCount ++;
          }
        }
        //console.log("***********************************************************");
        //console.log("activePlayerCount", activePlayerCount);
        //console.log("room.minPlayers", room.minPlayers);
        //console.log("***********************************************************");
        if (activePlayerCount < room.minPlayers) {
          room.game = null;
        }
        if (activePlayerCount == 0 ) {

          // commented on 26 Dec 18 by K@Y
          // reason: Since is clear the further process when all players left when winner is about to calculate in poolgamewinner(variable) in gameFinished function
          // clearTimeout(Sys.Timers[room.id]);
          room.timerStart = false;
          room = await Sys.Game.CashGame.Deals.Services.RoomServices.update(room);

        }
        // ~~~

				// Just Send Player Info for Remainig Player
				// room  =  await Sys.Game.CashGame.Deals.Controllers.RoomProcess.broadcastPlayerInfo(room);


				return {
					status: 'success',
					message: "Player Leave success",
					statusCode: 200
				};


			} else {
				////console.log('<=> Removing Player Not Found');
				return {
					status: 'fail',
					result: null,
					message: "Player not found",
					statusCode: 401
				};
			}
		}catch (error) {
			Sys.Log.info('Error in leaveRoom : ' + error);
			return new Error('Error in leaveRoom');
		}
	},
	saveHistory: async function(room,data) {
		if(room.game){
			room.game.history.push(data);
		}
	  return room;
	},
	waitForGameDeclare: async function(room,playerId) {
    try {
		clearTimeout(Sys.Timers[room.id]);

		let timer = parseFloat(Sys.Config.Rummy.declareTimer);
		Sys.Timers[room.id] = setInterval(async function(room){
			//console.log("Declare timer",timer)
			await Sys.Io.of(Sys.Config.Namespace.CashDeals).to(room.id).emit('OnDeclareTimer', {
				roomId: room.id,
				timer : timer,
				playerId : playerId,
				maxTimer : Sys.Config.Rummy.declareTimer
			});
			timer--;
			if(timer == 0){
				clearTimeout(Sys.Timers[room.id]);// Clear waitforDeclare
				await Sys.Game.CashGame.Deals.Controllers.RoomProcess.gameFinished(room);
			}
		}, 1000, room);
    }catch (error) {
      Sys.Log.info('Error in waitForGameDeclare : ' + error);
      return new Error('Error in waitForGameDeclare');

    }

	},
	findGame: async function(data){
        try {
            Sys.Log.info('<=> Check findGame || ');
	        let room = await Sys.Game.CashGame.Deals.Services.RoomServices.get(data.roomId);
			if (!room) {
                return { status: 'fail',result: null,message: "Room not found",	statusCode: 401	};
			}
			// check Room running Stataus
			// if(room.status != 'Running'){
			// 	return { status: 'fail',result: null,message: "Room Not Running",	statusCode: 401	};
			// }
			// check Player Avilabe in Room
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
		   return room;
        }catch (error) {
			Sys.Log.info('Error in findGame : ' + error);
			return new Error('Error in findGame');
        }
	},
	// reconnectGame: async function(socket,data){
  //       try {
  //           Sys.Log.info('<=> Check findGame || ');
	//         let room = await Sys.Game.CashGame.Deals.Services.RoomServices.get(data.roomId);
	// 		if (!room) {
  //               return { status: 'fail',result: null,message: "Room not found",	statusCode: 401	};
	// 		}
	// 		// check Room running Stataus
	// 		if(room.status != 'Running'){
	// 			return { status: 'fail',result: null,message: "Room Not Running",	statusCode: 401	};
	// 		}
	// 		// check Player Avilabe in Room
	// 		let palyeravilable = false;
	// 		for (let i = 0; i < room.players.length; i++) {
	// 			if ( room.players[i].id == data.playerId && room.players[i].status != 'Left' ) {
	// 				palyeravilable = true;
	// 				break
	// 			}
	// 		}
	// 		if(!palyeravilable){
	// 			return { status: 'fail',result: null,message: "Player Not Found!",	statusCode: 401	};
	// 		}
  //
	// 		// Send Player Broadcast
	// 		// let totalPlayers=0;
	// 		// for (i = 0; i < room.players.length; i++) {
	// 		// 	if(room.players[i].status != 'Left'){
	// 		// 		totalPlayers++;
	// 		// 	}
	// 		// }
  //     //
  //     //
	// 		// // Just Send Player Info for Remainig Player
	// 		// for (let i = 0; i < room.players.length; i++) {
	// 		// 	if (room.players[i].id == data.id) {
	// 		// 		if(room.players[i].status != 'Left'){
	// 		// 			let playerInfoObj = {
	// 		// 				id : room.players[i].id,
	// 		// 				status : room.players[i].status,
	// 		// 				username : room.players[i].username,
	// 		// 				cash : room.players[i].cash,
	// 		// 				chips : room.players[i].chips,
	// 		// 				appId :room.players[i].appid,
	// 		// 				avatar :  room.players[i].appid,
	// 		// 				dropped : room.players[i].dropped,
	// 		// 				seatIndex : room.players[i].seatIndex,
	// 		// 				totalPlayers : totalPlayers
	// 		// 			};
  //     //
	// 		// 			//console.log('<=> Recconect  || PlayerInfo :',  room.players[i].username);
  //     //
	// 		// 			await Sys.Io.of(Sys.Config.Namespace.CashDeals).to(socket.id).emit('PlayerInfo', playerInfoObj);
	// 		// 		}
	// 		// 	}
	// 		// }
  //     //
	// 		// for (let i = 0; i < room.players.length; i++) {
  //     //
	// 		// 		if(room.players[i].status != 'Left'){
	// 		// 			let playerInfoObj = {
	// 		// 				id : room.players[i].id,
	// 		// 				status : room.players[i].status,
	// 		// 				username : room.players[i].username,
	// 		// 				cash : room.players[i].cash,
	// 		// 				chips : room.players[i].chips,
	// 		// 				appId :room.players[i].appid,
	// 		// 				avatar :  room.players[i].appid,
	// 		// 				dropped : room.players[i].dropped,
	// 		// 				seatIndex : room.players[i].seatIndex,
	// 		// 				totalPlayers : totalPlayers
	// 		// 			};
  //     //
	// 		// 			//console.log('<=> Recconect  || PlayerInfo :',  room.players[i].username);
  //     //
	// 		// 			await Sys.Io.of(Sys.Config.Namespace.CashDeals).to(socket.id).emit('PlayerInfo', playerInfoObj);
	// 		// 		}
  //     //
	// 		// }
  //
  //     // room  =  await Sys.Game.CashGame.Deals.Controllers.RoomProcess.broadcastPlayerInfo(room);
  //
	// 		if(room.game && room.game.status == 'Running'){
	// 			// Send Room Joker Cards & OpneDeck Card information
  //       let isPrintedJoker  = false;
  //       if (room.game.jokerCard[0] == 'PJ') {
  //         isPrintedJoker  = true;
  //       }
	// 			let joObj = {
	// 				jokerCard : room.game.jokerCard[0],
	// 				OpenCard : room.game.openDeck[room.game.openDeck.length-1],
  //         isPrintedJoker  : isPrintedJoker
	// 			}
	// 			//console.log("joObj->",joObj);
	// 			await Sys.Io.of(Sys.Config.Namespace.CashDeals).to(socket.id).emit('JokerOpenCardInfo', joObj);
  //
  //
	// 			room.players.forEach(async function (player) {
	// 				let playerCards = {
	// 					playerId : player.id,
	// 					cards : player.cards,
	// 				};
	// 				await Sys.Io.of(Sys.Config.Namespace.CashDeals).to(socket.id).emit('ReconnectPlayerDeck', playerCards);
	// 			});
	// 			await Sys.Io.of(Sys.Config.Namespace.CashDeals).to(socket.id).emit('TurnPlayer', {
	// 				playerId: room.getCurrentPlayer().id
	// 			});
	// 		}
  //
	// 	   return room;
  //       }catch (error) {
	// 		Sys.Log.info('Error in findGame : ' + error);
	// 		return new Error('Error in findGame');
  //       }
	// },

  reconnectGame: async function(socket,data){
        try {

            Sys.Log.info('<=> Check reconnectGame || ');
            Sys.Log.info('<=> Check reconnectGame || ');
            Sys.Log.info('<=> Check reconnectGame || ');
            Sys.Log.info('<=> Check reconnectGame || ');
            Sys.Log.info('<=> Check reconnectGame || ');
            Sys.Log.info('<=> Check reconnectGame || ');
          let room = await Sys.Game.CashGame.Deals.Services.RoomServices.get(data.roomId);
          // //console.log("ROOOOM",room)
      if (!room) {
                return { status: 'fail',result: null,message: "Room not found",	statusCode: 401	};
      }
      // check Room running Stataus
      // if(room.status != 'Running'){
      // 	return { status: 'fail',result: null,message: "Room Not Running",	statusCode: 401	};
      // }
      // check Player Avilabe in Room
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


      //console.log("GAME ID:",room.game.id);
      // if(room.game && room.game.status == 'Running'){
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
        //console.log("joObj->",joObj);


        room.players.forEach(async function (player) {
          if (player.turnCount < 2 && player.id == data.playerId) {
            let	timer = parseInt(Sys.Config.Rummy.waitBeforeGameStart);
          await Sys.Io.of(Sys.Config.Namespace.CashDeals).to(socket.id).emit('OnGameStartWait', {
            roomId: room.id,
            timer : timer,
            maxTimer :  parseInt(Sys.Config.Rummy.waitBeforeGameStart)
          });
          }
        });


        await Sys.Io.of(Sys.Config.Namespace.CashDeals).to(socket.id).emit('JokerOpenCardInfo', joObj);
        // //console.log("JOCKER CARD INFO ",joObj);

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
              await Sys.Io.of(Sys.Config.Namespace.CashDeals).to(socket.id).emit('PlayerDeck', playerCards);
            } else {
              //console.log("PLAYER TURN COUNT222",player.turnCount);
              //console.log("player.username222",player.username);
              if (player.turnCount==2) {
              await Sys.Io.of(Sys.Config.Namespace.CashDeals).to(socket.id).emit('PlayerDeck', playerCards);
                //console.log("PLAYER DECK DATA",playerCards);
              }
              await Sys.Io.of(Sys.Config.Namespace.CashDeals).to(socket.id).emit('ReconnectPlayerDeck', playerCards);
              //console.log("ReconnectPlayerDeck222",playerCards)
            }
          }

        });
        await Sys.Io.of(Sys.Config.Namespace.CashDeals).to(socket.id).emit('TurnPlayer', {
          playerId: room.getCurrentPlayer().id
        });
      // }

       return room;
        }catch (error) {
      Sys.Log.info('Error in findGame : ' + error);
      return new Error('Error in findGame');
        }
  }



}
