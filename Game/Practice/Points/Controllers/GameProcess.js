var Sys = require('../../../../Boot/Sys');

module.exports = {
    progress: async function(room){

        try {

            let self = this
            var i, j, cards, hand;
            if (room.game && room.currentPlayer != null) {

      console.log(room.game.status)
      if (room.getCurrentPlayer().allIn == true) {
        // load('Syss/Teenpatti/Controllers/Logical/SysProcess').shiftBets(room);
        let sidePot = await room.game.getSidePotAmount(room); // Save Data
        console.log('Side Pot Values : ', sidePot);

        // room.getCurrentPlayer();
        for (var i = 0; i < room.game.allInPlayers.length; i++) {
          if (room.game.allInPlayers[i].id == room.getCurrentPlayer().id) {
            
           // console.log(" ======================================================= ");
           // console.log(" SidePotAmount : ", room.game.allInPlayers[i].bet);
           // console.log(" ======================================================= ");

            load('Iniv/Ws').channel('/').inRoom(room.id).emit('SidePotAmount', {
              playerId: room.getCurrentPlayer().id,
              potValue: room.game.allInPlayers[i].bet
            });
          }
        }
      }
      console.log("Current Player Before --------------->",room.currentPlayer);
      let roundStatus = await self.checkForEndOfRound(room);
      console.log("roundStatus :", roundStatus);
      console.log("room.game.status :", room.game.status);

      if (room.game.status == 'ForceFinishedShow' || roundStatus.endOfRound == true || room.game.status == 'ForceFinishedFolded') {
        if (room.game.status == 'ForceFinishedFolded' || room.game.status == 'ForceFinishedShow') {
          console.log('ForceFinishedFolded or ForceFinishedShow force to finishe the game', room.game.status);
          room.game.roundName = 'Showdown';
          // load('Syss/Teenpatti/Controllers/Logical/SysProcess').shiftBets(room);
          let sidePot = await room.game.getSidePotAmount(room); // Save Data
          console.log('Side Pot Values : ', sidePot);
          let OtherFolded = false;
          if(room.game.status == 'ForceFinishedFolded'){
            OtherFolded = true;
          }

          await self.checkWinner(room, room.game.status, roundStatus.currentTurn);

          await self.checkForBankrupt(room);
          room.currentPlayer = null;
          room.game.status = 'Finished';

          // depricatedzfprogressv
          // Event.fire("PokerSysFinished", room);
          // console.log('Sys finished called in progress');
          // await load('Syss/Teenpatti/Controllers/Logical/RoomProcess').gameFinished(room)

          // await load('Syss/Teenpatti/Controllers/Logical/RoomController').gameFinished(room,OtherFolded)
          await Sys.Game.Practice.Points.Controllers.RoomProcess.gameFinished(room)
          return
          //~ Put game finish event here.
        } else {
          // depricated
          // Event.fire("PokerPlayerTurnFinished", room);
          try {
            // Reset All Player talked false.
            for (i = 0; i < room.players.length; i += 1) {
              room.players[i].talked = false
            }


            if (room.game.roundName == 3) {
              for (i = 0; i < room.players.length; i += 1) {
                if (room.players[i].blind) {
                  room.players[i].blind = false
                  await Sys.Game.Practice.Points.Services.RoomServices.update(room);
                  load('Iniv/Ws').channel('/').inRoom(room.id).emit('CardSeen', {
                    playerId: room.players[i].id
                  });
                }
              }
            }

            room.game.roundName++;
            console.log("room.game.roundName :", room.game.roundName);
            // turn update
            // room.currentPlayer++;
            // if (room.currentPlayer >= room.playingPlayers()) {
            //   room.currentPlayer = 0;
            // }
            // for (var i = room.currentPlayer; i < room.players.length; i++) {
            //   if (room.getCurrentPlayer().folded == false) {
            //     room.currentPlayer = i;
            //     break;
            //   }
            // }

            console.log("room.currentPlayer bef", room.currentPlayer)

            if (room.currentPlayer == 0) {
              for (let i = 1; i < room.players.length; i += 1) {
                if (room.players[i].folded == false && room.players[i].status == 'Playing') {
                  if (room.players[i].talked == false && room.players[i].allIn == false) {
                    room.currentPlayer = i;
                    break
                  }
                }
              }
            } else {

              let currentTurn;
              currentTurn = room.currentPlayer;
              console.log("current Turn", currentTurn);
              //currentTurn += 1;
              // Logger.info('Check for end of round',room.players)
              //For each player, check
              for (let i = currentTurn + 1; i < room.players.length; i += 1) {
                if (room.players[i].folded == false && room.players[i].status == 'Playing') {
                  if (room.players[i].talked == false && room.players[i].allIn == false) {
                    console.log("pla :", room.players[i].playerName);
                    room.currentPlayer = i;
                    break
                  }
                }
              }

              console.log("currentTurn :", currentTurn);
              console.log("room.currentPlayer :", room.currentPlayer);


              if (currentTurn == room.currentPlayer) {
                for (let i = 0; i < currentTurn; i += 1) {
                  if (room.players[i].folded == false && room.players[i].status == 'Playing') {
                    if (room.players[i].talked == false && room.players[i].allIn == false) {
                      console.log("pla 2 :", room.players[i].playerName);
                      room.currentPlayer = i;
                      break
                    }
                  }
                }
              }
            }

            console.log("room.currentPlayer aft ", room.currentPlayer)

            // load('Syss/Teenpatti/Controllers/Logical/SysProcess').shiftBets(room);
            // let sidePot =  room.game.getSidePotAmount(room); // Save Data
            // console.log('Side Pot Values : ',sidePot)
            // console.log('roundFinished')
            // await load('Syss/Teenpatti/Controllers/Logical/RoomProcess').turnFinished(room)
            await Sys.Game.Practice.Points.Controllers.RoomProcess.turnFinished(room)
          } catch (error) {
            console.log(error)
          }
          return
        }
      } else {
        // depricated
        // Event.fire("PokerPlayerTurnFinished", room);
        console.log("turn finisehd Call");
        await Sys.Game.Practice.Points.Controllers.RoomProcess.turnFinished(room)
        return
      }
    }
        } catch (e) {
            console.log("Erro",e);

        }

    }
}
