const mongoose = require('mongoose');
const plm = require("passport-local-mongoose")
require('dotenv').config(); 

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/pinterest";

mongoose.connect("mongodb+srv://User:1234@cluster0.vrtp76k.mongodb.net/")

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String
  },
  fullName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  dp: {
    type: String, // This can be a URL or a filename if you're storing locally
    default: true
  },
  posts: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post'
    }],
  profileImage: {
    type: String,
  }
});

userSchema.plugin(plm)
module.exports = mongoose.model('User', userSchema);
