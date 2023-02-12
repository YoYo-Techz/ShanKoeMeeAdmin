 var Sys = require('../../../Boot/Sys');

module.exports = { 
    

    // findRoom: async function(socket,data){
    //     try {
    //         let player = await Sys.Game.Common.Services.PlayerServices.getById(data.playerId);
    //         if(!player){
    //             return { status: 'fail', result: null, message: 'No Player Found!.', statusCode: 401 }
    //         }
           
    //         data.socketId = socket.id; // Player Socket ID.
    //         if (player.chips < data.entry_fee) {
    //               return {   status: 'fail',   message: 'Insufficient chips.'  };
    //         }

    //         let room = await Sys.Game.Common.Controllers.RoomProcess.checkRoomSeatAvilability(data);
    //         if (!room) {
    //             return {
    //                 status: 'fail',  result: null,  message: "No Room Avilable", statusCode: 404
    //             };
    //         }
                
    //         return {
    //             status: 'success',
    //             message: "Player Room Joind successfuly.",
    //             result: {
    //                 roomId: room.id,
    //                 namespace : '/'+room.type+'_'+room.gameType+'/'+room.id
    //             }
    //         };

    //     } catch (error) {
    //         Sys.Log.info('Error in joinRoom : ' + error);
    //     }
    // },

    
    test: async function(socket,data){
    
        try {
 
            // Create new Room 
            Sys.Log.info('data : ', data); 

            Sys.Log.info('<=> Create New Room || ');
                
            let room = await Sys.Game.Common.Services.RoomServices.create(data);
            if (!room) {
                return { status: 'fail', result: null, message: 'No Room Created 1.', statusCode: 401 }
            }
            
            room = await Sys.Game.Common.Services.RoomServices.get(room.id); //// Just Get Table Data With Format.
            //console.log("room Before :",room.players)
            room.AddPlayer();
            //console.log("room After :",room)    

            return room;



            //  let time = 0;
             
            //  var DaynamicNamespace = Sys.Io.of('/practice/'+data.namespace ).on('connection', function(nameSpaceSocket){
            //     //console.log('Some One Connected....');
            //         Object.keys(Sys.Game.Practice.Points.Sockets).forEach(function(key){ // Register Socket File in Socket Variable
            //             Sys.Game.Practice.Points.Sockets[key](nameSpaceSocket);
            //         })
                   
                    
            //         setInterval(function(){ 
            //             //console.log("Timer :",time);
            //             nameSpaceSocket.emit('timer',time );
            //             time++; 
            //         }, 1000);

                  
            //         //console.log('user connected to ');
            // }); 

            // if(DaynamicNamespace){
            //     return {
            //         status: 'success',
            //         result: {
            //             url :  '/practice/'+data.namespace,
            //         },
            //         message: 'done'
            //     }
            // }else{
            //     return {
            //         status: 'fail',
            //         result: null,
            //         message: 'done'
            //     }
            // }
           
        } catch (error) {
            Sys.Log.info('Error in Test : ' + error);
        }

    },

}