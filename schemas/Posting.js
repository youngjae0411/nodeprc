const mongoose = require('mongoose')
const AutoIncrement = require("mongoose-sequence")(mongoose);

//dayjs!! 모먼트와 거의 흡사하지만 (10배) 훨씬 가볍다, 모먼트가 작년부터 업데이트가 중단 관리X!



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
  createdAt : {
    type : String,
    default : Date.now
  }
});

PostingSchema.plugin(AutoIncrement, { inc_field: "postId" });

const Posting = mongoose.model('Posting', PostingSchema);

module.exports = Posting 

//스키마에 쓸 땐 Date.now로 써야한다...