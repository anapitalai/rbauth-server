const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    default: 'basic',
    enum: ["basic", "supervisor", "admin"]
  },
  accessToken: {
    type: String
  },
  
  //added for email verify
  active:{
    type:Boolean,
    default:0
  }
})

const User = mongoose.model('user', UserSchema)

module.exports = User;