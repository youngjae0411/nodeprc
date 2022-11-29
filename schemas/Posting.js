const mongoose = require('mongoose')

const PostingSchema = mongoose.Schema({

  title : {
    type : String,
    required : true
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

const Posting = mongoose.model('Posting', PostingSchema);

module.exports = Posting 