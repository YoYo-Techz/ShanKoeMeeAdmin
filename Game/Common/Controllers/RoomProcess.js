var Sys = require('../../../Boot/Sys');

module.exports = { 
    
    // checkRoomSeatAvilability: async function(data){
    //     try {
    //         /**/
    //          let room,rooms,isEmptySpace;
    //         /**/
    //         Sys.Log.info('<=> Check Room Seat Avilability Called || ');
            
	//         rooms = await Sys.Game.Common.Services.RoomServices.getByData({
    //             type: data.type.toLowerCase(), // 'Practice','Cashgame',''
    //             tableType: data.gameType.toLowerCase(), // 'Points',Pool','Deals'
    //             maxPlayers: data.noOfSeats,
    //             gameOverPoint: data.gameOverPoint,
    //             owner: 'user',
    //             status: { $ne: 'Closed' },
    //         });
          
    //         isEmptySpace = false;
    //         rooms.forEach(function (rm) {
    //             if (rm.players.length < rm.maxPlayers && isEmptySpace == false) {
    //                 isEmptySpace = true;
    //                 room = rm; // Assign to Room
    //             }
    //         });
    
    //         if (isEmptySpace == false) {
    //             Sys.Log.info('<=> Create New Room || ');
                
    //             let rm = await Sys.Game.Common.Services.RoomServices.create(data);
    //             if (!rm) {
    //                 return { status: 'fail', result: null, message: 'No Room Created 1.', statusCode: 401 }
    //             }
    //             room = rm; // Assign to Room
	// 	    }
    //         room = await Sys.Game.Common.Services.RoomServices.get(room.id); //// Just Get Table Data With Format.
    //         return room;
    //     }catch (error) {
    //         Sys.Log.info('Error in checkRoomSeatAvilability : ' + error);
    //     }
    // }

}