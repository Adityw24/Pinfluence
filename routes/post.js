const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const postSchema = new mongoose.Schema({
  imageText: {
    type: String,
    required: false
  },
  description: {
    type: String,
    required: false
  },
  image: {
    type: String,
  },
  user: {
type: String,
required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now 
  },
  likes: {
    type: Array,
    default: []
},
});


module.exports = mongoose.model('Post', postSchema);

