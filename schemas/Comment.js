const mongoose = require('mongoose')
const Schema = require('mongoose').Schema;


const CommentSchema = mongoose.Schema({

  postId : {
    type : Schema.Types.ObjectId,
    required: true,
    ref: 'Posting',
  },

  user : {
    type : String,
    required: true
  },
  password : {
    type : String,
    required: true
  },
  content : {
    type : String,
    required: true
  },

}, {timestamps: true})

const Comment = mongoose.model('Comment ', CommentSchema);

module.exports = Comment