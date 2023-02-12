class Game {
    constructor(id, roomId,   status, pot,  players,  winners,  losers, history, gameNumber, type, gameType, jokerCard, openDeck, closeDeck, finishDeck,  declare ) {
      this.id = id;
      this.roomId = roomId;
      this.status = (status) ? status : 'waiting';
      this.pot = (pot) ? pot : 0;
      this.players = (players) ? players : []
      this.winners = (winners) ? winners : []
      this.losers = (losers) ? losers : []
      this.history = (history) ? history : []
      this.gameNumber = gameNumber;
      this.type = type;
      this.gameType = gameType || 'cash';
      this.jokerCard = (jokerCard) ? jokerCard : '';
      this.openDeck  = (openDeck) ? openDeck : [];
      this.closeDeck = (closeDeck) ? closeDeck : [];
      this.finishDeck = (finishDeck) ? finishDeck : [];
      this.declare = (declare)?declare : [];

    }
    createObject (game) {
        return new Game(
          game.id,
          game.roomId,
          game.status,
          game.pot,
          game.players,
          game.winners,
          game.losers,
          game.history,
          game.gameNumber,
          game.type,
          game.gameType,
          game.jokerCard ,
          game.openDeck ,
          game.closeDeck ,
          game.finishDeck ,
          game.declare,
        )
    }
    toJson() {
        var game = {
          id: this.id,
          roomId: this.roomId,
          status: this.status,
          pot: this.pot,
          players: this.players,
          winners: this.winners,
          losers : this.losers,
          history: this.history,
          gameNumber: this.gameNumber,
          type : this.type,
          gameType: this.gameType,
          jokerCard: this.jokerCard,
          openDeck: this.openDeck,
          closeDeck: this.closeDeck,
          finishDeck: this.finishDeck,
          declare : this.declare,
      }
        return game
    }

// async getSidePotAmount(room){

//   Logger.info('<=> Save Side Pot Data || GAME-NUMBER ['+room.game.gameNumber+'] || Room Round Name : ' , room.game.roundName);

//     let players = room.players;
//     let game = room.game;
//     let pot = [];
//     let sidepPot = {};
//     // let gamePot = [];
//     let allInPlayers = [];
//     let allInPlayersSidePot = [];
//     let playerIndex = [];
//     let playerIds = [];

//     let gameMainPot = 0;
//     let mainPortAddMore = 0;

//     let extraAmount = 0; // Lefted / Folded Player Amount

//     for (let i = 0; i < room.players.length; i++) {
//       if (room.players[i].allIn == true && room.players[i].status === 'playing' ) {
//         allInPlayers.push(i);
//         allInPlayersSidePot.push({ id: room.players[i].id, bet: game.roundBets[i] , seatIndex : room.players[i].seatIndex, index : i });
//       }

//       if (room.players[i].isSidepot == false && (room.players[i].folded == true || room.players[i].status === 'Left')) {
//           room.players[i].isSidepot = true; // Folded / Left Player Amount Save into Main Port;
//           Logger.info("Extrat amont Of Player : ",room.players[i].playerName);
//           Logger.info("Extrat amont  : ",game.roundBets[i]);
//           extraAmount += game.roundBets[i];
//       }

//     }

//     if (allInPlayers.length > 0) {

//      // Just sort By Bet Amount
//       allInPlayersSidePot.sort(function (a, b) {
//         return a.bet - b.bet;
//       });
//       Logger.info("Game Round Bets : ",game.roundBets);
//       Logger.info("allInPlayers : ",allInPlayers);
//       Logger.info("allInPlayersSidePot : ",allInPlayersSidePot);

//       let allInValue = 0;
//       for (let j = 0; j < allInPlayersSidePot.length; j++) {

//         let sumOfBet =  0;
//           for (let i = 0; i < game.roundBets.length; i++) {
//             if (game.roundBets[i] >= allInPlayersSidePot[j].bet) {
//               sumOfBet += allInPlayersSidePot[j].bet - allInValue;
//             }
//           }

//           playerIndex = [];
//           playerIds = [];
//           for (let i = 0; i < room.players.length; i++) {
//             if(room.players[i].isSidepot == false && room.players[i].status === 'playing'){ // chekc Already Side Pot not Calculate.
//                 playerIndex.push(i); // Add Aligible Player indexses for this Side pot.
//                 playerIds.push(room.players[i].id);
//             }
//           }


//           Logger.info("sumOfBet ->",sumOfBet);
//           sumOfBet += extraAmount;
//           extraAmount = 0; // After Assign value to Side Por Set Value 0
//           Logger.info("Fainal  extraAmount ->",extraAmount);
//           Logger.info("New sumOfBet ->",sumOfBet);

//           if(playerIndex.length == 1){ // When Side Pot Palyer is Single One Then We not Add This Amount in side Pot. Just Add this Amount in Main Port
//               mainPortAddMore += sumOfBet;
//               game.gameRevertPoint.push({
//                 playerID : allInPlayersSidePot[j].id,
//                 amount : sumOfBet,
//                 playerIndex : allInPlayersSidePot[j].index
//               });

//           }else{
//               // Save All in Player Side Pot in Single Variable
//               let isNotAvilabel = true;
//               for(let h=0;h < game.gamePot.length; h++){
//                 if(game.gamePot[h].sidePotPlayerID == allInPlayersSidePot[j].id){
//                   isNotAvilabel = false;
//                 }
//               }

//               if(isNotAvilabel && sumOfBet > 0){
//                 game.gamePot.push({
//                   playerIds : playerIds,
//                   playerIndex : playerIndex,
//                   sidePotPlayerID : allInPlayersSidePot[j].id,
//                   sidePotPlayerSeatIndex : allInPlayersSidePot[j].seatIndex,
//                   sidePotAmount : sumOfBet
//                 });
//               }

//           }
//         allInValue = allInPlayersSidePot[j].bet;
//         room.players[allInPlayersSidePot[j].index].isSidepot = true; // When Player side Pot is Calculate then we set variable true.
//         Logger.info("game.gamePot",game.gamePot);

//       }

//       for (let i = 0; i < game.roundBets.length; i++) {
//         if (game.roundBets[i] >= allInValue) {
//           gameMainPot += game.roundBets[i] - (allInValue);
//         }
//       }
//     }
//     else {
//       // Save All Bet Amount in Main Port
//       for (let i = 0; i < game.roundBets.length; i++) {
//         gameMainPot += game.roundBets[i];
//       }

//     }

//     gameMainPot += mainPortAddMore;  // RefundCoin Add in Main Port

//     Logger.info("------------------------------------------------");

//     game.gameMainPot = gameMainPot;
//     Logger.info("gameMainPot :",game.gameMainPot);
//     Logger.info("Game POT :",game.gamePot);
//     Logger.info("Game REvert Point :",game.gameRevertPoint);
//     Logger.info("------------------------------------------------");
//     return game.gamePot;

//   }



}


module.exports = Game
