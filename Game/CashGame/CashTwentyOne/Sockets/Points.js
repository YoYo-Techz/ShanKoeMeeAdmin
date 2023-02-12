
var Sys = require('../../../../Boot/Sys');

module.exports = function (Socket) {



    Socket.on("JoinRoom",async function(data,responce) {
        console.log("JoinRoom  Called :",data);
        responce(await Sys.Game.CashGame.CashTwentyOne.Controllers.RoomController.joinRoom(Socket,data));
    });

    Socket.on("ReJoinRoom",async function(data,responce) {
        console.log("ReJoinRoom  Called :",data);
        responce(await Sys.Game.CashGame.CashTwentyOne.Controllers.RoomController.rejoinRoom(Socket,data));
    });

    Socket.on("PushOpenDeck",async function(data,responce) {
        console.log("PushOpenDeck  Called :",data);
        responce(await Sys.Game.CashGame.CashTwentyOne.Controllers.RoomController.pushOpenDeck(Socket,data));
    });

    Socket.on("PopOpenDeck",async function(data,responce) {
        console.log("PopOpenDeck  Called :",data);
        responce(await Sys.Game.CashGame.CashTwentyOne.Controllers.RoomController.popOpenDeck(Socket,data));
    });


    Socket.on("PopCloseDeck",async function(data,responce) {
        console.log("PopCloseDeck  Called :",data);
        responce(await Sys.Game.CashGame.CashTwentyOne.Controllers.RoomController.popCloseDeck(Socket,data));
    });

    Socket.on("GetOpenDeckList",async function(data,responce) {
        console.log("getOpenDeckList  Called :",data);
        responce(await Sys.Game.CashGame.CashTwentyOne.Controllers.RoomController.getOpenDeckList(Socket,data));
    });


    Socket.on("PlayerDrop",async function(data,responce) {
        console.log("PlayerDrop  Called :",data);
        responce(await Sys.Game.CashGame.CashTwentyOne.Controllers.RoomController.playerDrop(Socket,data));
    });

    Socket.on("PlayerCardsScore",async function(data,responce) {
        //console.log("PlayerCardsScore  Called :");
        responce(await Sys.Game.CashGame.CashTwentyOne.Controllers.RoomController.playerCardsScore(Socket,data));
    });

    Socket.on("PlayerTableCards",async function(data,responce) {
        //console.log("PlayerTableCards  Called :");
        responce(await Sys.Game.CashGame.CashTwentyOne.Controllers.RoomController.playerTableCards(Socket,data));
    });

    Socket.on("RePlayerCards",async function(data,responce) {
        //console.log("PlayerCardsScore  Called :");
        responce(await Sys.Game.CashGame.CashTwentyOne.Controllers.RoomController.playerCards(Socket,data));
    });

    Socket.on("FinishGame",async function(data,responce) {
        console.log("FinishGame  Called :",data);
        responce(await Sys.Game.CashGame.CashTwentyOne.Controllers.RoomController.declarefinishGame(Socket,data));
    });

    Socket.on("DeclareGame",async function(data,responce) {
        console.log("DeclareGame  Called :",data);
        responce(await Sys.Game.CashGame.CashTwentyOne.Controllers.RoomController.declareGame(Socket,data));
    });

    Socket.on("ReconnectGame",async function(data,responce) {
        console.log("ReconnectGame  Called :",data);
        responce(await Sys.Game.CashGame.CashTwentyOne.Controllers.RoomController.reconnectGame(Socket,data));
    });
    Socket.on("OpenCloseJoker",async function(data,responce) {
        console.log("OpenCloseJoker  Called :",data);
        responce(await Sys.Game.CashGame.CashTwentyOne.Controllers.RoomController.openCloseJoker(Socket,data));
    });
    Socket.on("LeaveRoom",async function(data,responce) {
        console.log("LeaveRoom  Called :",data);
        responce(await Sys.Game.CashGame.CashTwentyOne.Controllers.RoomController.leaveRoom(Socket,data));
    });

    Socket.on("FinalCardString",async function(data,responce) {
        // console.log('(((((((((((((((((((((((((())))))))))))))))))))))))))');
        // console.log('(((((((((((((((((((((((((())))))))))))))))))))))))))');
        // console.log('(((((((((((((((((((((((((())))))))))))))))))))))))))');
        console.log("FinalCardString  Called :", data);
        // console.log('(((((((((((((((((((((((((())))))))))))))))))))))))))');
        // console.log('(((((((((((((((((((((((((())))))))))))))))))))))))))');
        // console.log('(((((((((((((((((((((((((())))))))))))))))))))))))))');
        responce(await Sys.Game.CashGame.CashTwentyOne.Controllers.RoomController.finalCardString(Socket,data));
    });

    Socket.on("disconnect",async function() {
        console.log("CashGame CashTwentyOne Player  Disconnect", Socket.myData);
        if (Socket.myData) {
          let responce = await Sys.Game.CashGame.CashTwentyOne.Controllers.RoomController.disconnectPlayer(Socket, Socket.myData);
          console.log("Player Dissconnect Responce :",responce);
          Socket.leave(Socket.myData.roomID);
        }
    });

}
