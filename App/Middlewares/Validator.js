var validate = require('express-validation');
var Joi = require('joi');
module.exports = {
    loginPostValidate: function(req, res, next){
        console.log('Validation check:', req.body);
        const rulesSchema = Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().regex(/[a-zA-Z0-9]{3,30}/).required()
        });
        const ret = Joi.validate(req.body, rulesSchema, {
            allowUnknown: false,
            abortEarly: false
        });

        if (ret.error) {
            // res.status(400).end(ret.error.toString());
            console.log("Error",ret.error.toString());
            req.flash('error', ret.error.toString());
            res.redirect('/');
        } else {
            next();
        }
    },

    registerUserPostValidate: function(req, res, next){
        console.log('Validation check:', req.body);
        const rulesSchema = Joi.object({
            username: Joi.string().alphanum().min(3).max(30).required(),
            status: Joi.string().min(3).max(30).required(),
            role: Joi.string().min(3).max(30).required(),
            email: Joi.string().email().required(),
            password: Joi.string().regex(/[a-zA-Z0-9]{3,30}/).required()
            // image: Joi.required()
        });

        const data = {
          username: 'abcd1234',
          status: 'abc1',
          role: 'Joe',
          email: 'not_a_valid_email_to_show_custom_label',
          password : '123456'
        };

        const ret = Joi.validate(req.body, rulesSchema, {
            allowUnknown: false,
            abortEarly: false
        });

        if (ret.error) {
            // res.status(400).end(ret.error.toString());
            console.log("Error",ret.error.toString());
            req.flash('error', ret.error.toString());
            // console.log('ret.error', ret.error.toString());
            res.redirect('/addUser');
        } else {
            next();
        }
    },

    registerUserPostValidateForGame: function(data){
        console.log('Validation check:', data);
        const rulesSchema = Joi.object({
            username: Joi.string().allow('').trim().strict().alphanum().min(3).max(30).required(),
        });

        const demo = {
          username: 'abcd1234',
          status: 'abc1',
          role: 'Joe',
          email: 'not_a_valid_email_to_show_custom_label',
          password : '123456'
        };

        const ret = Joi.validate(data, rulesSchema, {
            allowUnknown: false,
            abortEarly: false
        });

        if (ret.error) {


            let data = {
                status : 'fail'
            };
            return data;

        } else {

            let data = {
                status : 'success'
            };
            return data;
        }
    },

    editUserPostValidate: function(req, res, next){
        console.log('Validation check:', req.body);
        const rulesSchema = Joi.object({
           username: Joi.string().alphanum().min(3).max(30).required(),
            status: Joi.string().min(3).max(30).required(),
            role: Joi.string().min(3).max(30).required(),
            // email: Joi.string().email().required(),
            // password: Joi.string().regex(/[a-zA-Z0-9]{3,30}/).required()
            // image: Joi
        });

        const data = {
          username: 'abcd1234',
          status: 'abc1',
          role: 'Joe',
          // email: 'not_a_valid_email_to_show_custom_label',
          password : '123456'
        };

        const ret = Joi.validate(req.body, rulesSchema, {
            allowUnknown: false,
            abortEarly: false
        });

        if (ret.error) {
            // res.status(400).end(ret.error.toString());
            console.log("Error",ret.error.toString());
            req.flash('error', ret.error.toString());
            // console.log('ret.error', ret.error.toString());
            res.redirect('/user');
        } else {
            next();
        }
    },


    /***

    Player Validation
    ------------------

    ***/

    registerPlayerPostValidate: function(req, res, next){
        console.log('Validation check:', req.body);
        const rulesSchema = Joi.object({
           username: Joi.string().alphanum().min(3).max(30).required(),
           password: Joi.string().regex(/[a-zA-Z0-9]{3,30}/).required(),
           firstname: Joi.string().alphanum().min(3).max(30).required(),
           lastname: Joi.string().alphanum().min(3).max(30).required(),
           email: Joi.string().email().required(),
           gender: Joi.string().required(),
           //bot: Joi.string().required(),
           mobile: Joi.number().required(),
        });

        const ret = Joi.validate(req.body, rulesSchema, {
            allowUnknown: false,
            abortEarly: false
        });

        if (ret.error) {
            // res.status(400).end(ret.error.toString());
            console.log("Error",ret.error.toString());
            req.flash('error', ret.error.toString());
            // console.log('ret.error', ret.error.toString());
            res.redirect('/addPlayer');
        } else {
            next();
        }
    },


    editPlayerPostValidate: function(req, res, next){
        console.log('Validation check:', req.body);
        const rulesSchema = Joi.object({
           username: Joi.string().alphanum().min(3).max(30).required(),
           // password: Joi.string().regex(/[a-zA-Z0-9]{3,30}/).required(),
           firstname: Joi.string().alphanum().min(3).max(30).required(),
           lastname: Joi.string().alphanum().min(3).max(30).required(),
           // email: Joi.string().email().required(),
           gender: Joi.string().required(),
           bot: Joi.string().required(),
           mobile: Joi.number().required(),
        });

        const ret = Joi.validate(req.body, rulesSchema, {
            allowUnknown: false,
            abortEarly: false
        });

        if (ret.error) {
            // res.status(400).end(ret.error.toString());
            console.log("Error",ret.error.toString());
            req.flash('error', ret.error.toString());
            // console.log('ret.error', ret.error.toString());
            res.redirect('/player');
        } else {
            next();
        }
    },


    stacksValidation: function(req,res,next){

        const rulesSchema = Joi.object({
           minStacks: Joi.string().alphanum().min(1).required(),
           maxStack: Joi.string().alphanum().min(1).required(),
           flag: Joi.string().alphanum().min(1).required(),
        });

        const ret = Joi.validate(req.body, rulesSchema, {
            allowUnknown: false,
            abortEarly: false
        });

        if (ret.error) {
            // res.status(400).end(ret.error.toString());
            console.log("Error",ret.error.toString());
            req.flash('error', ret.error.toString());
            // console.log('ret.error', ret.error.toString());
            res.redirect('/cashgames/stacks');
        } else {
            next();
        }
    },

    // Setting Validation

    settingsValidation: function(req,res,next){

        const rulesSchema = Joi.object({
           rakePercenage: Joi.number().required(),
           chips: Joi.number().required(),
           defaultDiamonds: Joi.number().required(),
           rackAmount: Joi.number().required(),
           expireTime : Joi.required(),
           id : Joi
        });
        const ret = Joi.validate(req.body, rulesSchema, {
            allowUnknown: false,
            abortEarly: false
        });

        if (ret.error) {
            // res.status(400).end(ret.error.toString());
            console.log("Error",ret.error.toString());
            req.flash('error', ret.error.toString());
            // console.log('ret.error', ret.error.toString());
            res.redirect('/settings');
        } else {
            next();
        }
    },


    addSitGoTouValidation: function(req,res,next){

        const rulesSchema = Joi.object({
            sit_n_go_tur_blind_levels : Joi,
            sit_n_go_tur_1st_payout : Joi,
            sit_n_go_tur_2st_payout : Joi,
            sit_n_go_tur_3st_payout : Joi,
            sit_n_go_tur_breaks_start_time : Joi,
            sit_n_go_tur_breaks : Joi,
            sit_n_go_tur_default_game_play_chips : Joi.number().required(),
            sit_n_go_tur_tex_stacks : Joi,
            sit_n_go_tur_tex_buy_in : Joi.number().required(),
            sit_n_go_tur_tex_entry_fee : Joi.number().required(),
            fee : Joi,
            sit_n_go_tur_omh_stacks : Joi,
            sit_n_go_tur_omh_buy_in : Joi.number().required(),
            sit_n_go_tur_omh_entry_fee : Joi.number().required(),

        });
        const ret = Joi.validate(req.body, rulesSchema, {
            allowUnknown: false,
            abortEarly: false
        });

        if (ret.error) {
            // res.status(400).end(ret.error.toString());
            console.log("Error",ret.error.toString());
            req.flash('error', ret.error.toString());
            // console.log('ret.error', ret.error.toString());
            res.redirect('/regular-tournament/tournament');
        } else {
            next();
        }
    },

}
