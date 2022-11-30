const express = require("express");
const router = express.Router();
const mongoose = require("mongoose")


const Comment = require('../schemas/Comment')
const Posting = require('../schemas/Posting')

//댓글 작성 통과  
router.post('/:Id', async (req, res) => {
  
  let { Id } = req.params
  

  try{
    const posts = await Posting.findOne({postId : Id })
    console.log(posts)
  

    if(posts === null ) {
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

    const  postId  = req.params.Id

    await Comment.create({ postId : postId, user : req.body.user, password : req.body.password, content : req.body.content })
    res.status(201).json({message : '댓글이 생성되었습니다.'})
    } catch(error) {
      console.log(error)
      res.status(500).json({error: error})
    }

})

//댓글 목록 조회 통과
router.get('/:Id', async (req,res) => {
  let { Id } = req.params

  try {
    const posts = await Posting.findOne({postId : Id })
    if(posts === null ) {
      return res.status(404).json({message: '존재하지 않는 게시물입니다.' })
    }

    const comments = await Comment.find({postId : Id }).sort({createdAt: -1})


    const results = comments.map((comment) => {
      return {
        commentId: comment.commentId,      
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
router.put('/:commentId', async (req,res) => {
  let { commentId } = req.params

  try {
    const comments = await Comment.findOne({commentId : commentId})
    console.log(comments)
    
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
      await Comment.updateOne({commentId : commentId }, { $set: req.body});
    }
    res.json({ message: "댓글을 수정하였습니다."})
  } catch(error) {
    console.log(error)
    res.status(500).json({error})
  }

})

//댓글 삭제 통과
router.delete('/:commentId', async (req,res) => {
  let { commentId } = req.params


  try {
    
    const comments = await Comment.findOne({commentId : commentId})

    if(comments === null){
      return res.status(404).json({message : "존재하지않는 댓글입니다."})
    }

    if(comments.password !== req.body.password){
      return res.status(401).json({message : "비밀번호를 확인해주세요."})
    }



    if(comments !== null){
    await Comment.deleteOne({commentId})
    }

    res.status(200).json({message: "댓글이 삭제되었습니다."})

  } catch(error) {
    console.log(error)
    res.status(500).json({error})
  }
})





module.exports = router;