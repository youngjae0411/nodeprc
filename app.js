const express = require("express");
const app = express()
const mongoose = require("mongoose")
app.use(express.json())


require('dotenv').config();


app.use('/api/posts', require('./routes/posts'))
app.use('/api/comments', require('./routes/comment'))
app.use('/api/', require('./routes/index'))


app.listen(process.env.PORT, ()=> {
  console.log(process.env.PORT, '포트로 서버가 열렸습니다.')
})

app.get('/', (req,res) => {
  res.send("hello world")
})

mongoose.connect(process.env.URL)
  .then(() => console.log('MongoDB Connected!'))
  .catch(err => console.log(err))