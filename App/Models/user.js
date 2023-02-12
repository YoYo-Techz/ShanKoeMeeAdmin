const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const UserSchema = new Schema({
      name: {
        type: 'string',
        required: true
      },
      email: {
        type: 'string',
        required: true
      },
      role: {
        type: 'string',
        required: true
      },
      password: {
        type: 'string',
        required: true
      },
      status: {
        type: 'string',
        defaultsTo: 'active'
      },
      resetPasswordToken:{
        type:'string',
      },
      resetPasswordExpires:{
        type:'string',
      },
      // name: {
      //   type: 'string',
      //   required: true
      // },
      // email: {
      //   type: 'string',
      //   required: true
      // },
      // password: {
      //   type: 'string',
      //   required: true
      // },
      status: {
        type: 'string',
        default: 'active'
      },
      // role: {
      //   type: 'string',
      //   required: true
      // },
      // uniqueIdentifier: {
      //   type: 'string',
      //   required: true
      // },
      // tableLimit: {
      //   type: 'number',
      //   default: 0
      // },
      // chips:  {
      //   type: 'number',
      //   default: 0
      // },
      // diamonds: {
      //   type: 'number',
      //   default: 0
      // },
      // createdAt  : {
      //   type : Date,
      //   default : Date.now
      // }
},{ collection: 'user' });

mongoose.model('user', UserSchema);
