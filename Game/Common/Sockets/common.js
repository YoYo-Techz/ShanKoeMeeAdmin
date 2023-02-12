
var Sys = require('../../../Boot/Sys');

module.exports = function (Socket) {

    Socket.on("PlayerReconnect",async function(data,responce) {
        //console.log("Reconnect->>>>>> :",data)
        responce(await Sys.Game.Common.Controllers.PlayerController.reconnectPlayer(Socket,data));
    });

    Socket.on("LoginPlayer",async function(data,responce) {
        responce(await Sys.Game.Common.Controllers.PlayerController.playerLogin(Socket,data));
    });


    Socket.on("RegisterPlayer",async function(data,responce) {
        responce(await Sys.Game.Common.Controllers.PlayerController.playerRegister(Socket,data));
    });

    Socket.on("GameHistory",async function(data,responce) {
        //console.log("Game History :",data)
        responce(await Sys.Game.Common.Controllers.PlayerController.gameHistory(Socket,data));
    });


    Socket.on("GetProfileCashChips",async function(data,responce) {
        responce(await Sys.Game.Common.Controllers.PlayerController.getProfileCashChips(Socket,data));
    });

    Socket.on("GetCashChipsHistory",async function(data,responce) {
        //console.log("GetCashChipsHistory :",data)
        responce(await Sys.Game.Common.Controllers.PlayerController.getCashChipsHistory(Socket,data));
    });

    Socket.on("UpdateProfile",async function(data,responce) {
        responce(await Sys.Game.Common.Controllers.PlayerController.updateProfile(Socket,data));
    });


    Socket.on("GetProfile",async function(data,responce) {
        responce(await Sys.Game.Common.Controllers.PlayerController.getProfile(Socket,data));
    });

    Socket.on("LogOutPlayer",async function(data,responce) {
        responce(await Sys.Game.Common.Controllers.PlayerController.logOutPlayer(Socket,data));
    });

    Socket.on("ChangePassword",async function(data,responce) {
        responce(await Sys.Game.Common.Controllers.PlayerController.changePassword(Socket,data));
    });

    Socket.on("ForgetPassword",async function(data,responce) {
        responce(await Sys.Game.Common.Controllers.PlayerController.forgetPassword(Socket,data));
    });

    Socket.on("UploadDocument",async function(data,responce) {
        responce(await Sys.Game.Common.Controllers.PlayerController.uploadDocument(Socket,data));
    });


    Socket.on("WebGLHit",async function(data,responce) {
     // console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
       // console.log("WebGLHit  Called :",data);
        // responce(await Sys.Game.Practice.Points.Controllers.RoomController.leaveRoom(Socket,data));
    });

    Socket.on("ping",async function(data,responce) {
      //console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
       // console.log("Ping Called :",data);
        // responce(await Sys.Game.Practice.Points.Controllers.RoomController.joinRoom(Socket,data));
    });

    Socket.on("CheckForRunningGame",async function(data,responce) {
      //console.log("CheckForRunningGame :",data);
      responce(await Sys.Game.Common.Controllers.PlayerController.checkForRunningGame(Socket,data));
    });

    Socket.on("PlayerTableSetting",async function(data,responce) {
      //console.log("PlayerTableSetting :",data);
      responce(await Sys.Game.Common.Controllers.PlayerController.PlayerTableSetting(Socket,data));
    });

    // Socket.on("FindRoom",async function(data,responce) {
    //     console.log("FindRoom Called",data);
    //     responce(await Sys.Game.Common.Controllers.RoomController.findRoom(Socket,data));
    // });


    // Socket.on("createNamespace",async function(data,responce) {
    //     responce(await Sys.Game.Common.Controllers.RoomController.test(Socket,data));
    // });





    // Socket.on("Localaccess",async function(data,responce) {
    //      responce(await Game.ThreeCards.Controllers.PlayerController.localaccess(Socket,data));
    // });

    // Socket.on("CreateGuest", async function(data,responce) {
    //     responce(await Game.ThreeCards.Controllers.PlayerController.createGuest(Socket,data));
    // });

    // Socket.on("Fbaccess", async function(data,responce) {
    //     responce(await Game.ThreeCards.Controllers.PlayerController.fbaccess(Socket,data));
    // });


    // Socket.on("SubscribeChipsRoom", async function(data,responce) {
    //     console.log('data->',data)
    //     responce(await Game.ThreeCards.Controllers.RoomController.subscribeChipsRoom(Socket,data));
    // });


    // Socket.on("JoinRoom", async function(data,responce) {
    //     console.log('JoinRoom->',data)
    //     responce(await Game.ThreeCards.Controllers.RoomController.joinRoom(Socket,data));
    // });








}
