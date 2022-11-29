const express = require("express");
const router = express.Router();
const mongoose = require("mongoose")
const ObjectId = mongoose.Types.ObjectId;

const Comment = require('../schemas/Comment')
const Posting = require('../schemas/Posting')

//댓글 작성 통과  
router.post('/:_postId', async (req, res) => {
  
  let { _postId } = req.params
  

  if(_postId.length !== 24){
    _postId = '000000000000000000000000'
  }
  console.log(_postId)

  try{
    const posts = await Posting.findOne({_id : _postId })
    console.log(posts)
  

    if( _postId ==='000000000000000000000000' || posts === null ) {
      return res.status(404).json({message: '존재하지 않는 게시물입니다.' })
    }

    if(req.body.password === undefined){
      return res.status(400).json({message: "비밀번호를 입력해주세요"})
    }
    if(req.body.user === undefined){
      return res.status(400).json({message : "유저를 입력해주세요"})
    }
    if(req.body.content === undefined){
      return res.status(400).json({message : "댓글 내용을 입력해주세요"})
    }

    const  obj_postId  = ObjectId(req.params._postId)

    await Comment.create({ postId :obj_postId, user : req.body.user, password : req.body.password, content : req.body.content })
    res.status(201).json({message : '댓글이 생성되었습니다.'})
    } catch(error) {
      console.log(error)
      res.status(500).json({error: error})
    }

})

//댓글 목록 조회 통과
router.get('/:_postId', async (req,res) => {
  let { _postId } = req.params
  if(_postId.length !== 24){
    _postId = '000000000000000000000000'
  }
  try {
    const posts = await Posting.findOne({_id : _postId })
    if( _postId ==='000000000000000000000000' || posts === null ) {
      return res.status(404).json({message: '존재하지 않는 게시물입니다.' })
    }

    const comments = await Comment.find({postId : _postId}).sort({createdAt: -1})


    const results = comments.map((comment) => {
      return {
        commentId: comment._id,      
        user: comment.user,      
        content: comment.content,     
        createdAt: comment.createdAt   
      }  
    })
      res.json({data : results})

    } catch (error) {
      res.status(500).json(error)
    }
})

//댓글 수정 통과
router.put('/:_commentId', async (req,res) => {
  let { _commentId } = req.params

  if(_commentId.length !== 24){
    _commentId = '000000000000000000000000'
  }

  try {
    const comments = await Comment.findOne({_id : _commentId})
    console.log(comments)
    
    if(_commentId === '000000000000000000000000'){
      return res.status(404).json({message: '데이터 형식이 올바르지 않습니다.'})
    }

    if(comments === null){
      return res.status(404).json({message : '존재하지않는 댓글입니다.'})
    }

    if(req.body.password !== comments.password){
      return res.status(401).json({message: "비밀번호를 확인해주세요"})
    }

    if(req.body.content === undefined || req.body.content.length === 0){
      return res.status(400).json({message: "댓글 내용을 입력해주세요"})
    }

    if([comments].length){
      await Comment.updateOne({_id : _commentId }, { $set: req.body});
    }
    res.json({ message: "댓글을 수정하였습니다."})
  } catch(error) {
    console.log(error)
    res.status(500).json({error})
  }

})

//댓글 삭제 통과
router.delete('/:_commentId', async (req,res) => {
  let { _commentId } = req.params

  if(_commentId.length !== 24){
    _commentId = '000000000000000000000000'
  }

  try {
    
    const comments = await Comment.findOne({_id : _commentId})

    if(_commentId === '000000000000000000000000'){
      return res.status(404).json({message: '데이터 형식이 올바르지 않습니다.'})
    }

    if(comments === null){
      return res.status(404).json({message : "존재하지않는 댓글입니다."})
    }

    if(comments.password !== req.body.password){
      return res.status(401).json({message : "비밀번호를 확인해주세요."})
    }



    if(comments !== null){
    await Comment.deleteOne({_commentId})
    }

    res.status(200).json({message: "댓글이 삭제되었습니다."})

  } catch(error) {
    console.log(error)
    res.status(500).json({error})
  }
})





module.exports = router;