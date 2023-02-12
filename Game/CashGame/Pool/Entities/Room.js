var Sys = require('../../../../Boot/Sys');

class Room {
  constructor(id, tableType, name,tableNumber,dealer, minPlayers, maxPlayers, type, owner,gameType,rack,entryFees, currentPlayer, players, gameWinners, gameLosers,status,  game,varient, numberOfDecks ,  printedJoker,timerStart,gameOverPoint,gamecount, participantPlayers) {
    var room = this;
    this.id = id;
    this.tableType = tableType;
    this.name = name;
    this.minPlayers = minPlayers;
    this.maxPlayers = maxPlayers;
    this.type = type;
    this.status = (status) ? status : 'waiting';
    //Track the dealer position between games
    this.dealer = 0;
    if (dealer) {
      this.dealer = dealer;
    }


    this.players = players;
    if (players && Array.isArray(players)) {
        room.players = [];
        players.forEach(function (player) {
          //player.room = room;
          room.players.push(new Sys.Game.CashGame.Pool.Entities.Player(player.id,player.socketId,player.username,player.avatar,player.status,player.appid,player.chips,player.cash,player.pointValue,player.totalPoint,player.playerScore,player.cardsString,player.seatIndex,player.isBot,player.cardTurn,player.declare,player.dropped,player.droppedCount,player.timerPosition,player.cards,player.defaultActionCount,player.extraTime,player.turnCount));
        })
    }


    this.gameWinners = [];
      if (gameWinners && Array.isArray(gameWinners) ) {
        room.gameWinners = gameWinners
       }
    this.gameLosers = [];
    //if (gameLosers) {
      // gameLosers.forEach(function (player) {
      //   player.room = room
      //   room.gameLosers.push(load('Games/CashGame/Points/Entities/Player', player))
      // })
    //}
    this.game = null
    if (game) {
      this.game = new Sys.Game.CashGame.Pool.Entities.Game().createObject(game);
    //  this.game = new Sys.Game.CashGame.Pool.Entities.Game(game.id,game.roomId,game.status, game.pot, game.history, game.gameNumber, game.gameType, game.jokerCard, game.openDeck, game.closeDeck, game.finishDeck, game.declare);
    }
    this.currentPlayer = currentPlayer;
    this.owner = owner;
    this.gameType = gameType;
    this.rack = rack;
    this.tableNumber = tableNumber;
    this.numberOfDecks = 2;
    // this.numberOfDecks = numberOfDecks;
    this.entryFees = entryFees;
    this.varient = varient;
    this.printedJoker = printedJoker;
    this.timerStart = timerStart;
    this.gameOverPoint = gameOverPoint;
    this.gamecount  = gamecount;
    this.prizepool  = 0;
    this.participantPlayers = [];



  }

  createObject(room) {
    return new Room(
      room.id,
      room.tableType,
      room.name,
      room.tableNumber,
      room.dealer,
      room.minPlayers,
      room.maxPlayers,
      room.type,
      room.owner,
      room.gameType,
      room.rack,
      room.entryFees,
      room.currentPlayer,
      room.players ,
      room.gameWinners,
      room.gameLosers,
      room.status,
      room.game,
      room.varient,
      room.numberOfDecks,
      room.printedJoker,
      room.timerStart,
      room.gameOverPoint,
      room.gamecount,
      room.participantPlayers,
    );
  }

  /*
   * Helper Methods Public
   */
  toJson() {


    let room = {
      id: this.id,
      tableType: this.tableType,
      name: this.name,
      tableNumber: this.tableNumber,
      dealer: this.dealer,
      minPlayers: this.minPlayers,
      maxPlayers: this.maxPlayers,
      type: this.type,
      owner: this.owner,
      gameType: this.gameType,
      rack  : this.rack,
      entryFees: this.entryFees,
      currentPlayer: this.currentPlayer,
      players: [],
      gameWinners: this.gameWinners,
      gameLosers: this.gameLosers,
      status: this.status,
      game: null,
      varient: this.varient,
      numberOfDecks: 2,
      // numberOfDecks: this.numberOfDecks,
      printedJoker: this.printedJoker,
      timerStart: this.timerStart,
      gameOverPoint: this.gameOverPoint,
      gamecount:  this.gamecount,
      participantPlayers:  this.participantPlayers,

    }
    if (this.players.length > 0) {
      this.players.forEach(function (player) {
        room.players.push(new Sys.Game.CashGame.Pool.Entities.Player(player.id,player.socketId,player.username,player.avatar,player.status,player.appid,player.chips,player.cash,player.pointValue,player.totalPoint,player.playerScore,player.cardsString,player.seatIndex,player.isBot,player.cardTurn,player.declare,player.dropped,player.droppedCount,player.timerPosition,player.cards,player.defaultActionCount,player.extraTime,player.turnCount));
      })
    }


    if (this.gameLosers.length > 0) {
      // this.gameLosers.forEach(function (player) {
      //   room.gameLosers.push(player.toJson())
      // })
    }
    // other field
    if (this.game) {
      // room.game = new Sys.Game.CashGame.Pool.Entities.Game(this.game.id,this.game.roomId,this.game.status, this.game.pot, this.game.history, this.game.gameNumber, this.game.gameType, this.game.jokerCard, this.game.openDeck, this.game.closeDeck, this.game.finishDeck, this.game.declare);
      room.game = this.game.toJson();
    }
    return room
  }

  async AddPlayer(id, socketId, username, status, avatar, appId, chips,cash, seatIndex, isBot) {

    let room = this
    let player = new Sys.Game.CashGame.Pool.Entities.Player(id,socketId,username,avatar,status,appId,chips,cash,80,0,80,'-',seatIndex,isBot,true,false,false,0,1,[],0,Sys.Config.Rummy.extraTime,1);
     this.players.push(player);
     return room; // Return Room
  }

  async StartGame() {

    var room = this
    //console.log('<=> Start Game Called || GAME-NUMBER [] ||  : ');
    let playingCounter = 0;
    let playingKey = 0;
    for (let i = 0; i < room.players.length; i++) {
      if (room.players[i].status == 'playing') {
        playingCounter++; // Count How Many Player playing Game.
        playingKey = i;
      }
    }
    if (playingCounter == 1) { // if Only One Player in Table
      room.players[playingKey].status = 'waiting'; // When Player is One Then Change Player Status
    }

    // Remove Player Which Have Status Left
    for (let i = 0; i < room.players.length; i++) {
      if (room.players[i].status == 'Left') {
        room.players.splice(i, 1);
      }
    }

    room = await Sys.Game.CashGame.Pool.Services.RoomServices.update(room);


    //If there is no current game and we have enough players, start a new game.
    let playersLength = 0
    this.players.forEach(function (player) {
      if (player.status != 'Left') {
        playersLength += 1;
      }
    })
    if (!room.game && playersLength >= this.minPlayers) {
      //console.log("<create new Game >");
      let gameobj = {
        roomId: room.id,
        status: 'Running',
        gameType  : room.tableType,
        type : room.type,
      };
      let game = await Sys.Game.CashGame.Pool.Services.GameServices.create(gameobj);

      if (game) {

        room.game = game;
        let playersLength = 0
        room.players.forEach(function (player) {
          if (player.status != 'Left') {
            playersLength += 1;
          }
        })
        if (playersLength >= room.minPlayers) {
          room.game.status = 'Running';
          room.status = 'Running';
          // Sys.Game.CashGame.Pool.Services.RoomServices.update(room);
          //console.log("Game Starting.......");
          let gameStarted = await Sys.Game.CashGame.Pool.Controllers.RoomProcess.newGameStarted(room);
          room.initNewRound();
        }
      }
    }

  }

  async initNewRound() {

    var room = this;
    //console.log('<=> Init New Game Round || GAME-NUMBER :',room.game.gameNumber);

    var i;
    room.game.status = 'Running';
    room.game.pot = 0;
    room.gamecount = parseInt(parseInt(room.gamecount) + 1);
    room.game.openDeck.splice(0, room.game.openDeck.length);
    room.game.closeDeck.splice(0, room.game.closeDeck.length);
    room.game.history.splice(0, room.game.history.length);

    for (i = 0; i < room.players.length; i += 1) {
        room.players[i].cards.splice(0, room.players[i].cards.length);
    }
    let deck =  new Sys.Game.CashGame.Pool.Entities.Deck();
    await  deck.fillDeck(2,room.game.closeDeck);
    // await  deck.fillDeck(room.numberOfDecks,room.game.closeDeck);


    // // Get Joker Card
     var index = Math.floor( Math.random()*room.game.closeDeck.length );
     let joker =  room.game.closeDeck.splice( index, 1 ); // Remove the item from the array
     index = Math.floor( Math.random()*room.game.closeDeck.length );
    room.game.openDeck =  room.game.closeDeck.splice( index, 1 ); // Remove the item from the array

    if(room.game.openDeck[0][0] == joker[0][0]){
      //console.log("Card Matched!.......")
      room.game.openDeck = [joker[0]+'J'];
    }

    // set Joker To Game
    room.game.jokerCard = joker;


    if(joker == 'PJ'){ // if Joker Card is Printed Joker So All A is Become Joker.
          for(let i=0;i<room.game.closeDeck.length;i++){
            if('A' == room.game.closeDeck[i][0]){
              room.game.closeDeck[i] = room.game.closeDeck[i]+'J';
            }
          }

          if(room.game.openDeck[0][0] == 'A'){
            room.game.openDeck = [room.game.openDeck[0]+'J'];
          }

    }else{
      for(let i=0;i<room.game.closeDeck.length;i++){
        if(joker[0][0] == room.game.closeDeck[i][0]){
          room.game.closeDeck[i] = room.game.closeDeck[i]+'J';
        }
      }
    }


   // //console.log("room.game.numberOfDecks ->",room.numberOfDecks);
   // //console.log("room.game.openDeck ->",room.game.openDeck);
////console.log("Joker ->",joker);
    // // End Here
    //  room.NewRound();

    //~~~ Copied from Point Game
    for (var i in room.players) {
      if (room.players[i].status == 'sitting' || room.players[i].status == 'waiting') {
          room.players[i].dropped = false;
          room.players[i].cardsString = '';
          room.players[i].pointValue = 0;
          room.players[i].cardTurn = true;
          room.players[i].defaultActionCount = 0;
          room.players[i].droppedCount = 0;
          room.players[i].timerPosition = 1;
          room.players[i].declare = false;
          room.players[i].status = 'playing';
          room.players[i].extraTime = Sys.Config.Rummy.extraTime; // Set Player Extra Timer Reset to Default
      }
      room.players[i].droppedCount = 0;
      room.players[i].wrongfinished = false;
    }

    // room  =  await Sys.Game.CashGame.Pool.Controllers.RoomProcess.broadcastPlayerInfo(room);

    // Select High Rank Player.
    let cardsArray = [
      '2C',
      '3D',
      '4H',
      '5H',
      '6D',
      '7C',
      '8H',
      '9D',
    ]
    //Shuffle the deck array with Fisher-Yates
    var i, j, tempi, tempj;
    for (i = 0; i < cardsArray.length; i += 1) {
        j = Math.floor(Math.random() * (i + 1));
        tempi = cardsArray[i];
        tempj = cardsArray[j];
        cardsArray[i] = tempj;
        cardsArray[j] = tempi;
    }
    //console.log("================================================");
    //console.log("room.gamecount", room.gamecount);
    //console.log("================================================");
    if (room.gamecount == 1) {
      let priorityCards = await Sys.Game.CashGame.Pool.Controllers.RoomProcess.turnPlayerSelection(room,cardsArray);
      for (var i = 0; i < room.players.length; i++) {
        room.players[i].seatIndex = parseInt(cardsArray[i].substring(0, 1))
      }
      //console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
      //console.log('Wait for Priority Cards Selection');
      //console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
    }


    // Add seatindex by player Card Rank
    // //console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&");
    // //console.log("room.players", room.players);



    // Sort Player By Priority Cards.
    // room.currentPlayer = 0;

    room.players.sort(function (a, b) {
      return a.seatIndex - b.seatIndex;
    })

    // //console.log("============================================");
    // //console.log('room.players[room.currentPlayer].username', room.players[room.currentPlayer].username);
    // //console.log('room.players[room.currentPlayer].status', room.players[room.currentPlayer].status);
    // if (room.players[room.currentPlayer].status != "playing") {
    //   room.currentPlayer++;
    // }




    Sys.Timers[room.id] = setTimeout(async function(room){

    let playerInfoDummy = [];

      for (let i = 0; i < room.players.length; i++) {
        if(room.players[i].status != 'Left'){
            let playerInfoObj = {
              id : room.players[i].id,
              status : room.players[i].status,
              username : room.players[i].username,
              cash : room.players[i].cash,
              chips : room.players[i].chips,
              appId :room.players[i].appid,
              avatar :  room.players[i].appid,
              dropped : room.players[i].dropped,
            };

            playerInfoDummy.push(playerInfoObj);


        }
      }
      let roomStatus = true;
      if (room.status == "Running" && room.game != null) {
        roomStatus = false;
      }
     // //console.log("Player List ->>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>.",playerInfoDummy)
      await Sys.Io.of(Sys.Config.Namespace.CashPool).to(room.id).emit('PlayerList', playerInfoDummy, { isBeforeGameStart: roomStatus });

     room.NewRound();
    }, 5000, room);
  }

  async NewRound() {
    var room = this
    //console.log('<=> New Game Round Start || GAME-NUMBER :',room.game.gameNumber);
    // Add players in waiting list
    // ~~~
    // for (var i in room.players) {
    //   if (room.players[i].status == 'sitting' || room.players[i].status == 'waiting') {
    //       room.players[i].dropped = false;
    //       room.players[i].cardsString = '';
    //       room.players[i].pointValue = 0;
    //       room.players[i].cardTurn = true;
    //       room.players[i].defaultActionCount = 0;
    //       room.players[i].droppedCount = 0;
    //       room.players[i].timerPosition = 1;
    //       room.players[i].declare = false;
    //       room.players[i].status = 'playing';
    //       room.players[i].extraTime = Sys.Config.Rummy.extraTime; // Set Player Extra Timer Reset to Default
    //   }
    //
    // }
    // Remove Player Which Status is Left
    for (let i = room.players.length - 1; i >= 0; i--) {
      if (room.players[i].status == 'Left') {
        room.players.splice(i, 1)
      }
    }
    room.gameWinners = [];
    room.gameLosers = [];

    room.players.sort(function (a, b) {
      return a.seatIndex - b.seatIndex
    })

    var i, smallBlind, bigBlind, playerLength;
    //Deal 2 cards to each player
    for (i = 0; i < room.players.length; i += 1) {
      if(room.players[i].status == 'playing'){
        room.players[i].cards.push(room.game.closeDeck.pop());
        room.players[i].cards.push(room.game.closeDeck.pop());
        room.players[i].cards.push(room.game.closeDeck.pop());
        room.players[i].cards.push(room.game.closeDeck.pop());
        room.players[i].cards.push(room.game.closeDeck.pop());
        room.players[i].cards.push(room.game.closeDeck.pop());
        room.players[i].cards.push(room.game.closeDeck.pop());
        room.players[i].cards.push(room.game.closeDeck.pop());
        room.players[i].cards.push(room.game.closeDeck.pop());
        room.players[i].cards.push(room.game.closeDeck.pop());
        room.players[i].cards.push(room.game.closeDeck.pop());
        room.players[i].cards.push(room.game.closeDeck.pop());
        room.players[i].cards.push(room.game.closeDeck.pop());
      }
    }



    //Identify Small and Big Blind player indexes

    if (room.gamecount == 1) {
      room.dealer = 0; // Set Dealer to First Palayer
    }else {
      room.dealer ++;
      if (room.dealer >= room.players.length) {
        //console.log("dealer is greater than player length");
        room.dealer = 0;
      }
    }
    //console.log(">>>>> Dealer : ",room.dealer);


    //console.log(">> Player-Length :",room.players.length);



    // get currentPlayer
    // //console.log("============================================");
    // //console.log('room.players[room.currentPlayer].username', room.players[room.currentPlayer].username);
    // //console.log('room.players[room.currentPlayer].status', room.players[room.currentPlayer].status);
    room.currentPlayer = room.dealer;
    if (room.players[room.currentPlayer].status != "playing") {
      room.currentPlayer++;
    }

    //console.log('<=> Room Running || GAME-NUMBER :',room.game.gameNumber);
    room.status = 'Running';
    room = await Sys.Game.CashGame.Pool.Services.RoomServices.update(room);
    let newRoundStarted = await Sys.Game.CashGame.Pool.Controllers.RoomProcess.newRoundStarted(room);

  }
  getCurrentPlayer() {
    return this.players[this.currentPlayer];
  }
  getPlayerById(id) {
    for(let i=0; i < this.players.length; i++ ){
      if(id == this.players[i].id ){
        return this.players[i];
      }
    }

  }
}



module.exports = Room
