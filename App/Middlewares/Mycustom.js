module.exports = {
    cutomCheck: function(req, res, next){
        console.log('This is Custom Check:', Date.now())
        next();
    }
}