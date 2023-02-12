
var Sys = require('../../../../Boot/Sys');

module.exports = function (Socket) {



    Socket.on("JoinRoom",async function(data,responce) {
        console.log("==============================================");
        console.log("JoinRoom  Called :",data);
        console.log("==============================================");
        responce(await Sys.Game.CashGame.Points.Controllers.RoomController.joinRoom(Socket,data));
    });

    Socket.on("ReJoinRoom",async function(data,responce) {
        console.log("ReJoinRoom  Called :",data);
        responce(await Sys.Game.CashGame.Points.Controllers.RoomController.rejoinRoom(Socket,data));
    });

    Socket.on("PushOpenDeck",async function(data,responce) {
      console.log("==============================================");
        console.log("PushOpenDeck  Called :",data);
        console.log("==============================================");
        responce(await Sys.Game.CashGame.Points.Controllers.RoomController.pushOpenDeck(Socket,data));
    });

    Socket.on("PopOpenDeck",async function(data,responce) {
      console.log("==============================================");
        console.log("PopOpenDeck  Called :",data);
        console.log("==============================================");
        responce(await Sys.Game.CashGame.Points.Controllers.RoomController.popOpenDeck(Socket,data));
    });


    Socket.on("PopCloseDeck",async function(data,responce) {
      console.log("==============================================");
        console.log("PopCloseDeck  Called :",data);
        console.log("==============================================");
        responce(await Sys.Game.CashGame.Points.Controllers.RoomController.popCloseDeck(Socket,data));
    });

    Socket.on("GetOpenDeckList",async function(data,responce) {
      console.log("==============================================");
        console.log("getOpenDeckList  Called :",data);
        console.log("==============================================");
        responce(await Sys.Game.CashGame.Points.Controllers.RoomController.getOpenDeckList(Socket,data));
    });


    Socket.on("PlayerDrop",async function(data,responce) {
      console.log("==============================================");
        console.log("PlayerDrop  Called :",data);
        console.log("==============================================");
        responce(await Sys.Game.CashGame.Points.Controllers.RoomController.playerDrop(Socket,data));
    });

    Socket.on("PlayerCardsScore",async function(data,responce) {
      console.log("==============================================");
        console.log("PlayerCardsScore  Called :");
        console.log("==============================================");
        responce(await Sys.Game.CashGame.Points.Controllers.RoomController.playerCardsScore(Socket,data));
    });

    Socket.on("PlayerTableCards",async function(data,responce) {
      console.log("==============================================");
        console.log("PlayerCardsScore  Called :");
        console.log("==============================================");
        responce(await Sys.Game.CashGame.Points.Controllers.RoomController.playerTableCards(Socket,data));
    });

    Socket.on("RePlayerCards",async function(data,responce) {
      console.log("==============================================");
        console.log("PlayerCardsScore  Called :");
        console.log("==============================================");
        responce(await Sys.Game.CashGame.Points.Controllers.RoomController.playerCards(Socket,data));
    });

    Socket.on("FinishGame",async function(data,responce) {
      console.log("==============================================");
        console.log("FinishGame  Called :",data);
        console.log("==============================================");
        responce(await Sys.Game.CashGame.Points.Controllers.RoomController.declarefinishGame(Socket,data));
    });

    Socket.on("DeclareGame",async function(data,responce) {
      console.log("==============================================");
        console.log("DeclareGame  Called :",data);
        console.log("==============================================");
        responce(await Sys.Game.CashGame.Points.Controllers.RoomController.declareGame(Socket,data));
    });

    Socket.on("ReconnectGame",async function(data,responce) {
      console.log("==============================================");
        console.log("ReconnectGame  Called :",data);
        console.log("==============================================");
        responce(await Sys.Game.CashGame.Points.Controllers.RoomController.reconnectGame(Socket,data));
    });
    Socket.on("OpenCloseJoker",async function(data,responce) {
      console.log("==============================================");
        console.log("OpenCloseJoker  Called :",data);
        console.log("==============================================");
        responce(await Sys.Game.CashGame.Points.Controllers.RoomController.openCloseJoker(Socket,data));
    });
    Socket.on("LeaveRoom",async function(data,responce) {
      console.log("==============================================");
        console.log("LeaveRoom  Called :",data);
        console.log("==============================================");
        responce(await Sys.Game.CashGame.Points.Controllers.RoomController.leaveRoom(Socket,data));
    });

    Socket.on("FinalCardString",async function(data,responce) {
        console.log('(((((((((((((((((((((((((())))))))))))))))))))))))))');
        console.log('(((((((((((((((((((((((((())))))))))))))))))))))))))');
        console.log('(((((((((((((((((((((((((())))))))))))))))))))))))))');
        console.log("FinalCardString  Called :", data);
        console.log('(((((((((((((((((((((((((())))))))))))))))))))))))))');
        console.log('(((((((((((((((((((((((((())))))))))))))))))))))))))');
        console.log('(((((((((((((((((((((((((())))))))))))))))))))))))))');
        responce(await Sys.Game.CashGame.Points.Controllers.RoomController.finalCardString(Socket,data));
    });

    Socket.on("disconnect",async function() {
      console.log("==============================================");
        console.log("CashGame Points Player  Disconnect", Socket.myData);
        console.log("==============================================");
        if (Socket.myData) {
          let responce = await Sys.Game.CashGame.Points.Controllers.RoomController.disconnectPlayer(Socket, Socket.myData);
          console.log("Player Dissconnect Responce :",responce);
          Socket.leave(Socket.myData.roomID);
        }
    });

}
