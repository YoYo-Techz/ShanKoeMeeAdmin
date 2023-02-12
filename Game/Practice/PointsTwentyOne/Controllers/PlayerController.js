var Sys = require('../../../../Boot/Sys');

module.exports = { 
    
    test: async function(socket,data){
        try {
 
            return {
                status: 'success',
                message: "Player Room Joind successfuly.",
                result: {
                    roomId: 'done'
                }
            };
            
        } catch (e) {
            //console.log("Erro",e);
        }

    }
}