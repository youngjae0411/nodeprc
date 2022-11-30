const mongoose = require('mongoose')
const AutoIncrement = require("mongoose-sequence")(mongoose);


const CommentSchema = mongoose.Schema({

  postId : {
    type : String
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
  createdAt : {
    type : String,
    default : Date.now
  }
})

CommentSchema.plugin(AutoIncrement, { inc_field: "commentId" });

const Comment = mongoose.model('Comment ', CommentSchema);

module.exports = Comment